import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { getDevVerificationCode } from '../lib/emailVerification'

const CODE_LENGTH = 6

export function VerifyEmailPage() {
  const { t } = useLanguage()
  const { pendingEmail, verifyEmailCode, signInWithEmail } = useAuth()
  const navigate = useNavigate()
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const devCode = useMemo(() => getDevVerificationCode(), [])

  useEffect(() => {
    if (!pendingEmail) {
      navigate('/signin', { replace: true })
    }
  }, [pendingEmail, navigate])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const timerId = window.setTimeout(() => setCountdown((value) => value - 1), 1000)
    return () => window.clearTimeout(timerId)
  }, [countdown])

  const code = digits.join('')

  const handleDigitChange = (index: number, value: string) => {
    const next = value.replace(/\D/g, '').slice(-1)
    setDigits((current) => {
      const copy = [...current]
      copy[index] = next
      return copy
    })
    if (next && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (!pasted) return
    const next = Array(CODE_LENGTH).fill('')
    pasted.split('').forEach((char, index) => {
      next[index] = char
    })
    setDigits(next)
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus()
  }

  const clearDigits = () => setDigits(Array(CODE_LENGTH).fill(''))

  const handleVerify = async () => {
    if (code.length !== CODE_LENGTH) {
      setError(t('authCodeIncomplete'))
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      await verifyEmailCode(code)
      navigate('/setup-profile')
    } catch {
      setError(t('authCodeInvalid'))
      clearDigits()
      inputRefs.current[0]?.focus()
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (!pendingEmail || countdown > 0) return
    setError(null)
    try {
      await signInWithEmail(pendingEmail)
      setCountdown(60)
      clearDigits()
      inputRefs.current[0]?.focus()
    } catch {
      setError(t('authEmailError'))
    }
  }

  if (!pendingEmail) return null

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{t('verifyEmailTitle')}</h1>
        <p className="auth-subtitle">
          {t('verifyEmailSent')} <strong>{pendingEmail}</strong>
        </p>

        {import.meta.env.DEV && devCode && (
          <p className="auth-dev-hint">
            {t('verifyDevCode')}: <strong>{devCode}</strong>
          </p>
        )}

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-code-inputs">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element
              }}
              className="auth-code-input"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(event) => handleDigitChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
              aria-label={`${t('verifyCodeDigit')} ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="auth-btn auth-btn-primary"
          onClick={handleVerify}
          disabled={submitting || code.length !== CODE_LENGTH}
        >
          {t('verifySubmit')}
        </button>

        <button
          type="button"
          className="auth-btn auth-btn-secondary"
          onClick={handleResend}
          disabled={countdown > 0}
        >
          {countdown > 0 ? `${t('verifyResendWait')} ${countdown}s` : t('verifyResend')}
        </button>
      </div>
    </main>
  )
}
