import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthLangSwitcher } from '../components/AuthLangSwitcher'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { checkEmailRegistered } from '../lib/emailVerification'

export function SignUpPage() {
  const { t } = useLanguage()
  const { signInWithGoogle, signInWithEmail } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as { from?: string; prefillEmail?: string } | null
  const from = locationState?.from
  const prefillEmail = locationState?.prefillEmail
  const [email, setEmail] = useState(prefillEmail ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleGoogle = async () => {
    setError(null)
    setSubmitting(true)
    try {
      await signInWithGoogle()
      navigate('/setup-profile', { state: { from }, replace: true })
    } catch {
      setError(t('authGoogleError'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSendCode = async () => {
    setError(null)
    setSubmitting(true)
    try {
      const registered = await checkEmailRegistered(email)
      if (registered === true) {
        // 確定已存在才導向
        navigate('/signin', {
          state: { from, prefillEmail: email.trim().toLowerCase() },
          replace: true,
        })
        return
      }
      await signInWithEmail(email)
      navigate('/verify-email', { state: { from }, replace: true })
    } catch {
      setError(t('authEmailError'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <AuthLangSwitcher />
      <div className="auth-card">
        <h1 className="auth-title">{t('signUpTitle')}</h1>
        <p className="auth-subtitle">{t('signUpSubtitle')}</p>

        {error && <p className="auth-error">{error}</p>}

        <p className="auth-terms">{t('termsText')}</p>

        <button
          type="button"
          className="auth-btn auth-btn-primary"
          onClick={handleGoogle}
          disabled={submitting}
        >
          {t('loginWithGoogle')}
        </button>

        <div className="auth-divider">
          <span>{t('loginOr')}</span>
        </div>

        <label className="auth-label" htmlFor="signup-email">
          {t('loginEmailLabel')}
        </label>
        <input
          id="signup-email"
          className="auth-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t('loginEmailPlaceholder')}
          autoComplete="email"
        />

        <button
          type="button"
          className="auth-btn auth-btn-secondary"
          onClick={handleSendCode}
          disabled={submitting || !email.trim()}
        >
          {t('loginSendCode')}
        </button>

        <p className="auth-link">
          {t('haveAccount')}
          <Link to="/signin" state={{ from }}>
            {t('signInLink')}
          </Link>
        </p>
      </div>
    </main>
  )
}
