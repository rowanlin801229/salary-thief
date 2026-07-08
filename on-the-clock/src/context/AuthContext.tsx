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
  consumeEmailVerification,
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
  updateUserPhotoURL,
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
  signInWithEmail: (email: string) => Promise<string>
  verifyEmailCode: (code: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>
  updateUserPhoto: (photoURL: string) => Promise<void>
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
    const { code } = await createEmailVerification(normalized)
    setPendingEmailState(normalized)
    return code
  }, [])

  const verifyEmailCode = useCallback(async (code: string) => {
    console.log('[AuthContext] verifyEmailCode START')

    const email = getPendingEmail()
    console.log('[AuthContext] pendingEmail:', email)

    if (!email) {
      throw new Error('missing_email')
    }

    console.log('[AuthContext] Step 1: verifying code...')
    const password = await verifyEmailVerificationCode(email, code)
    console.log('[AuthContext] Step 1 SUCCESS: code verified')

    console.log('[AuthContext] Step 2: checking if returning user...')
    const existingPassword = await getEmailAuthPassword(email)
    console.log('[AuthContext] existingPassword:', existingPassword ? 'EXISTS' : 'NEW USER')

    try {
      if (existingPassword) {
        console.log('[AuthContext] Step 3: signing in EXISTING user...')
        await signInWithEmailAndPassword(auth, email, existingPassword)
        console.log('[AuthContext] Step 3 SUCCESS: existing user signed in')
      } else {
        console.log('[AuthContext] Step 3: creating NEW user...')
        try {
          const credential = await createUserWithEmailAndPassword(auth, email, password)
          console.log('[AuthContext] Step 3a SUCCESS: user created', credential.user.uid)

          console.log('[AuthContext] Step 3b: updating profile...')
          await updateProfile(credential.user, { displayName: '' })
          console.log('[AuthContext] Step 3b SUCCESS: profile updated')

          console.log('[AuthContext] Step 3c: saving password...')
          await saveEmailAuthPassword(email, password)
          console.log('[AuthContext] Step 3c SUCCESS: password saved')
        } catch (createError) {
          const firebaseError = createError as { code?: string; message?: string }
          console.error('[AuthContext] Step 3 create FAILED', createError)
          console.log('[AuthContext] Firebase error code:', firebaseError.code)
          console.log('[AuthContext] Firebase error message:', firebaseError.message)

          if (firebaseError.code === 'auth/email-already-in-use') {
            const storedPassword = (await getEmailAuthPassword(email)) ?? password
            console.log('[AuthContext] Retrying sign-in for existing email...')
            try {
              await signInWithEmailAndPassword(auth, email, storedPassword)
              console.log('[AuthContext] Retry sign-in SUCCESS')
            } catch (signInError) {
              const signInFirebaseError = signInError as { code?: string; message?: string }
              console.error('[AuthContext] Retry sign-in FAILED', signInError)
              console.log('[AuthContext] Retry error code:', signInFirebaseError.code)
              console.log('[AuthContext] Retry error message:', signInFirebaseError.message)
              if (
                signInFirebaseError.code === 'auth/wrong-password' ||
                signInFirebaseError.code === 'auth/invalid-credential' ||
                signInFirebaseError.code === 'auth/invalid-login-credentials'
              ) {
                throw new Error('auth_provider_conflict')
              }
              throw signInError
            }
          } else {
            throw createError
          }
        }
      }
    } catch (error) {
      const firebaseError = error as { code?: string; message?: string }
      console.error('[AuthContext] Step 3 FAILED', error)
      console.log('[AuthContext] Outer Firebase error code:', firebaseError.code)
      console.log('[AuthContext] Outer Firebase error message:', firebaseError.message)
      // Keep verification doc so the user can retry with the same code.
      throw error
    }

    console.log('[AuthContext] Step 4: clearing pending email + loading profile...')
    await consumeEmailVerification(email)
    clearPendingEmail()
    setPendingEmailState(null)
    if (auth.currentUser) {
      console.log('[AuthContext] Step 4b: loadProfile for', auth.currentUser.uid)
      await loadProfile(auth.currentUser)
      console.log('[AuthContext] Step 4b SUCCESS: profile loaded')
    } else {
      console.warn('[AuthContext] Step 4: no auth.currentUser after sign-in')
    }

    console.log('[AuthContext] verifyEmailCode COMPLETE')
  }, [loadProfile])

  const signOut = useCallback(async () => {
    clearPendingEmail()
    setPendingEmailState(null)
    await firebaseSignOut(auth)
    setProfile(null)
  }, [])

  const updateUserProfileHandler = useCallback(
    async (displayName: string, photoURL?: string) => {
      if (!user) return
      const trimmed = displayName.trim()
      const nextPhoto = photoURL ?? profile?.photoURL ?? user.photoURL ?? ''
      await updateProfile(user, { displayName: trimmed })
      await updateUserDisplayName(user.uid, trimmed)
      if (photoURL) {
        await updateUserPhotoURL(user.uid, photoURL)
      }
      setProfile((current) =>
        current
          ? { ...current, displayName: trimmed, photoURL: nextPhoto }
          : current
      )
    },
    [user, profile]
  )

  const updateUserPhotoHandler = useCallback(
    async (photoURL: string) => {
      if (!user) return
      // Store custom avatars in Firestore only (Base64 is too large for Auth photoURL).
      await updateUserPhotoURL(user.uid, photoURL)
      setProfile((current) => (current ? { ...current, photoURL } : current))
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
      updateUserPhoto: updateUserPhotoHandler,
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
      updateUserPhotoHandler,
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
