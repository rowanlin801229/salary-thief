import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp
} from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from './firebase'

export interface UserStats {
  monthlyStats: Record<string, { best: number; total: number }>
  allTimeStats: { best: number; total: number }
}

export interface UserProfile {
  email: string
  displayName: string
  photoURL: string
  currency: string
  language: string
  createdAt: Timestamp | null
  stats: UserStats
}

const defaultStats = (): UserStats => ({
  monthlyStats: {},
  allTimeStats: { best: 0, total: 0 }
})

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, 'users', userId))
  if (!snapshot.exists()) return null
  return snapshot.data() as UserProfile
}

export async function ensureUserProfile(user: User, language: string): Promise<UserProfile> {
  const ref = doc(db, 'users', user.uid)
  const existing = await getDoc(ref)

  if (existing.exists()) {
    return existing.data() as UserProfile
  }

  const profile: UserProfile = {
    email: user.email ?? '',
    displayName: '',
    photoURL: user.photoURL ?? '',
    currency: 'NT$',
    language,
    createdAt: serverTimestamp() as Timestamp,
    stats: defaultStats()
  }

  await setDoc(ref, profile)
  return profile
}

export async function updateUserDisplayName(userId: string, displayName: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), { displayName })
}

export async function updateUserPhotoURL(userId: string, photoURL: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), { photoURL })
}

export function isProfileComplete(profile: UserProfile | null): boolean {
  return Boolean(profile?.displayName?.trim())
}
