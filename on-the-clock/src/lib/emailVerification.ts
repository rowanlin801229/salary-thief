import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

const PENDING_EMAIL_KEY = 'on-the-clock/pending-email'
const DEV_CODE_KEY = 'on-the-clock/dev-verification-code'
const CODE_TTL_MS = 10 * 60 * 1000

export interface EmailVerificationRecord {
  email: string
  code: string
  password: string
  expiresAt: number
}

/** Normalize email, then make a safe Firestore doc id (dots → underscores). */
export function emailDocId(email: string): string {
  // IMPORTANT: /\./ must be escaped. /./ would replace every character.
  return email.trim().toLowerCase().replace(/\./g, '_')
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Keep digits only so pasted/fullwidth codes still compare cleanly. */
export function normalizeCode(code: string): string {
  return String(code ?? '').replace(/\D/g, '')
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
  sessionStorage.setItem(PENDING_EMAIL_KEY, normalizeEmail(email))
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

export async function createEmailVerification(
  email: string
): Promise<{ code: string; docId: string }> {
  const normalized = normalizeEmail(email)
  const docId = emailDocId(normalized)
  const code = generateCode()
  // Reuse stored auth password for returning users so Firebase Auth can sign them in.
  const existingPassword = await getEmailAuthPassword(normalized)
  const password = existingPassword ?? generatePassword()
  const record: EmailVerificationRecord = {
    email: normalized,
    code,
    password,
    expiresAt: Date.now() + CODE_TTL_MS
  }

  const ref = doc(db, 'emailVerifications', docId)
  await setDoc(ref, record)

  // Confirm round-trip so UI never shows a code that wasn't persisted.
  const confirm = await getDoc(ref)
  if (!confirm.exists()) {
    throw new Error('verification_save_failed')
  }
  const saved = confirm.data() as EmailVerificationRecord
  const savedCode = normalizeCode(String(saved.code ?? ''))
  if (savedCode !== code) {
    console.error('[emailVerification] save mismatch', { expected: code, saved: saved.code })
    throw new Error('verification_save_failed')
  }

  await setDoc(doc(db, 'mail', `${docId}-${Date.now()}`), {
    to: normalized,
    message: {
      subject: '薪水小偷驗證碼 / On The Clock Verification Code',
      text: `您的驗證碼是：${code}，10 分鐘內有效。\nYour verification code is: ${code}, valid for 10 minutes.`,
    },
  })

  setPendingEmail(normalized)

  if (import.meta.env.DEV) {
    sessionStorage.setItem(DEV_CODE_KEY, savedCode)
    console.info('[emailVerification] saved', {
      email: normalized,
      docId,
      code: savedCode,
      expiresAt: saved.expiresAt
    })
  }

  return { code: savedCode, docId }
}

export async function verifyEmailVerificationCode(
  email: string,
  code: string
): Promise<string> {
  const normalized = normalizeEmail(email)
  const docId = emailDocId(normalized)
  const ref = doc(db, 'emailVerifications', docId)
  const snapshot = await getDoc(ref)
  const entered = normalizeCode(code)

  console.log('[emailVerification] verify', { email: normalized, docId, exists: snapshot.exists() })
  console.log('Expected: (pending Firestore read)')
  console.log('Got:', entered)

  if (!snapshot.exists()) {
    console.error('[emailVerification] missing doc', docId)
    throw new Error('verification_not_found')
  }

  const record = snapshot.data() as EmailVerificationRecord
  const storedCode = normalizeCode(String(record.code ?? ''))

  // Exact debug lines requested for diagnosing mismatch.
  console.log('Expected:', storedCode)
  console.log('Got:', entered)
  console.log('[emailVerification] record', {
    email: record.email,
    code: record.code,
    expiresAt: record.expiresAt,
    now: Date.now()
  })

  const expiresAt = Number(record.expiresAt)
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    await deleteDoc(ref)
    throw new Error('verification_expired')
  }

  if (storedCode !== entered || storedCode.length !== 6) {
    console.error('[emailVerification] code mismatch', { storedCode, entered })
    throw new Error('verification_invalid')
  }

  // Keep the doc until Auth succeeds; AuthContext deletes after sign-in.
  return String(record.password)
}

export async function consumeEmailVerification(email: string): Promise<void> {
  const ref = doc(db, 'emailVerifications', emailDocId(normalizeEmail(email)))
  try {
    await deleteDoc(ref)
  } catch {
    // Ignore missing docs.
  }
}

export async function getEmailAuthPassword(email: string): Promise<string | null> {
  const snapshot = await getDoc(doc(db, 'emailAuth', emailDocId(normalizeEmail(email))))
  if (!snapshot.exists()) return null
  return (snapshot.data() as { password: string }).password
}

export async function saveEmailAuthPassword(email: string, password: string): Promise<void> {
  await setDoc(doc(db, 'emailAuth', emailDocId(normalizeEmail(email))), { password })
}
