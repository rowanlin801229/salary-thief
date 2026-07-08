import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLangSwitcher } from '../components/AuthLangSwitcher'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export function SignInPage() {
  const { t } = useLanguage()
  const { signInWithGoogle, signInWithEmail } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleGoogle = async () => {
    setError(null)
    setSubmitting(true)
    try {
      await signInWithGoogle()
      navigate('/setup-profile')
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
      await signInWithEmail(email)
      navigate('/verify-email')
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
        <h1 className="auth-title">{t('signInTitle')}</h1>
        <p className="auth-subtitle">{t('signInSubtitle')}</p>

        {error && <p className="auth-error">{error}</p>}

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

        <label className="auth-label" htmlFor="signin-email">
          {t('loginEmailLabel')}
        </label>
        <input
          id="signin-email"
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
          {t('noAccount')}
          <Link to="/signup">{t('signUpLink')}</Link>
        </p>
      </div>
    </main>
  )
}
