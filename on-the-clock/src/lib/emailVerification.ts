import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

const PENDING_EMAIL_KEY = 'on-the-clock/pending-email'
const DEV_CODE_KEY = 'on-the-clock/dev-verification-code'
const CODE_TTL_MS = 10 * 60 * 1000

export interface EmailVerificationRecord {
  code: string
  password: string
  expiresAt: number
}

function emailDocId(email: string): string {
  return email.trim().toLowerCase().replace(/\./g, '_')
}

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function generatePassword(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function setPendingEmail(email: string): void {
  sessionStorage.setItem(PENDING_EMAIL_KEY, email.trim().toLowerCase())
}

export function getPendingEmail(): string | null {
  return sessionStorage.getItem(PENDING_EMAIL_KEY)
}

export function clearPendingEmail(): void {
  sessionStorage.removeItem(PENDING_EMAIL_KEY)
  sessionStorage.removeItem(DEV_CODE_KEY)
}

export function getDevVerificationCode(): string | null {
  if (!import.meta.env.DEV) return null
  return sessionStorage.getItem(DEV_CODE_KEY)
}

export async function createEmailVerification(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase()
  const code = generateCode()
  const password = generatePassword()
  const record: EmailVerificationRecord = {
    code,
    password,
    expiresAt: Date.now() + CODE_TTL_MS
  }

  await setDoc(doc(db, 'emailVerifications', emailDocId(normalized)), record)
  setPendingEmail(normalized)

  if (import.meta.env.DEV) {
    sessionStorage.setItem(DEV_CODE_KEY, code)
  }
}

export async function verifyEmailVerificationCode(
  email: string,
  code: string
): Promise<string> {
  const normalized = email.trim().toLowerCase()
  const ref = doc(db, 'emailVerifications', emailDocId(normalized))
  const snapshot = await getDoc(ref)

  if (!snapshot.exists()) {
    throw new Error('verification_not_found')
  }

  const record = snapshot.data() as EmailVerificationRecord

  if (Date.now() > record.expiresAt) {
    await deleteDoc(ref)
    throw new Error('verification_expired')
  }

  if (record.code !== code.trim()) {
    throw new Error('verification_invalid')
  }

  await deleteDoc(ref)
  return record.password
}

export async function getEmailAuthPassword(email: string): Promise<string | null> {
  const snapshot = await getDoc(doc(db, 'emailAuth', emailDocId(email)))
  if (!snapshot.exists()) return null
  return (snapshot.data() as { password: string }).password
}

export async function saveEmailAuthPassword(email: string, password: string): Promise<void> {
  await setDoc(doc(db, 'emailAuth', emailDocId(email)), { password })
}
