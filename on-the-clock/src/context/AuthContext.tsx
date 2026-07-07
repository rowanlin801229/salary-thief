import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User
} from 'firebase/auth'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import { auth } from '../lib/firebase'
import {
  clearPendingEmail,
  createEmailVerification,
  getEmailAuthPassword,
  getPendingEmail,
  saveEmailAuthPassword,
  verifyEmailVerificationCode
} from '../lib/emailVerification'
import {
  ensureUserProfile,
  getUserProfile,
  isProfileComplete,
  updateUserDisplayName,
  type UserProfile
} from '../lib/userProfile'
import { useLanguage } from './LanguageContext'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  isEmailVerified: boolean
  profileComplete: boolean
  loading: boolean
  pendingEmail: string | null
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string) => Promise<void>
  verifyEmailCode: (code: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (displayName: string) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingEmail, setPendingEmailState] = useState<string | null>(() => getPendingEmail())

  const loadProfile = useCallback(
    async (nextUser: User) => {
      const nextProfile = await ensureUserProfile(nextUser, language)
      setProfile(nextProfile)
      return nextProfile
    },
    [language]
  )

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)
      if (nextUser) {
        try {
          const nextProfile = await getUserProfile(nextUser.uid)
          setProfile(nextProfile ?? (await loadProfile(nextUser)))
        } catch {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [loadProfile])

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    clearPendingEmail()
    setPendingEmailState(null)
    await loadProfile(result.user)
  }, [loadProfile])

  const signInWithEmail = useCallback(async (email: string) => {
    const normalized = email.trim().toLowerCase()
    if (!normalized.includes('@')) {
      throw new Error('invalid_email')
    }
    await createEmailVerification(normalized)
    setPendingEmailState(normalized)
  }, [])

  const verifyEmailCode = useCallback(async (code: string) => {
    const email = getPendingEmail()
    if (!email) {
      throw new Error('missing_email')
    }

    const password = await verifyEmailVerificationCode(email, code)
    const existingPassword = await getEmailAuthPassword(email)
    const authPassword = existingPassword ?? password

    try {
      if (existingPassword) {
        await signInWithEmailAndPassword(auth, email, existingPassword)
      } else {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        await saveEmailAuthPassword(email, password)
        await updateProfile(credential.user, { displayName: '' })
      }
    } catch (error) {
      const firebaseError = error as { code?: string }
      if (firebaseError.code === 'auth/email-already-in-use' && existingPassword) {
        await signInWithEmailAndPassword(auth, email, existingPassword)
      } else if (firebaseError.code === 'auth/email-already-in-use') {
        await signInWithEmailAndPassword(auth, email, authPassword)
      } else {
        throw error
      }
    }

    clearPendingEmail()
    setPendingEmailState(null)
    if (auth.currentUser) {
      await loadProfile(auth.currentUser)
    }
  }, [loadProfile])

  const signOut = useCallback(async () => {
    clearPendingEmail()
    setPendingEmailState(null)
    await firebaseSignOut(auth)
    setProfile(null)
  }, [])

  const updateUserProfileHandler = useCallback(
    async (displayName: string) => {
      if (!user) return
      const trimmed = displayName.trim()
      await updateProfile(user, { displayName: trimmed })
      await updateUserDisplayName(user.uid, trimmed)
      setProfile((current) =>
        current ? { ...current, displayName: trimmed } : current
      )
    },
    [user]
  )

  const refreshProfile = useCallback(async () => {
    if (!user) return
    const nextProfile = await getUserProfile(user.uid)
    setProfile(nextProfile)
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isEmailVerified: Boolean(user?.emailVerified || user?.providerData.some((p) => p.providerId === 'google.com')),
      profileComplete: isProfileComplete(profile),
      loading,
      pendingEmail,
      signInWithGoogle,
      signInWithEmail,
      verifyEmailCode,
      signOut,
      updateUserProfile: updateUserProfileHandler,
      refreshProfile
    }),
    [
      user,
      profile,
      loading,
      pendingEmail,
      signInWithGoogle,
      signInWithEmail,
      verifyEmailCode,
      signOut,
      updateUserProfileHandler,
      refreshProfile
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
