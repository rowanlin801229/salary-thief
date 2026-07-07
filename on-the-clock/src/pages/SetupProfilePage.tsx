import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export function SetupProfilePage() {
  const { t } = useLanguage()
  const { user, profile, updateUserProfile } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/signin', { replace: true })
      return
    }
    if (profile?.displayName?.trim()) {
      navigate('/result', { replace: true })
      return
    }
    setDisplayName(profile?.displayName || user.displayName || '')
  }, [user, profile, navigate])

  const handleSubmit = async () => {
    const trimmed = displayName.trim()
    if (!trimmed) {
      setError(t('profileNameRequired'))
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      await updateUserProfile(trimmed)
      navigate('/result')
    } catch {
      setError(t('profileSaveError'))
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{t('setupProfileTitle')}</h1>
        <p className="auth-subtitle">{t('setupProfileSubtitle')}</p>

        <div className="auth-avatar-wrap">
          {user.photoURL ? (
            <img className="auth-avatar" src={user.photoURL} alt="" />
          ) : (
            <span className="auth-avatar auth-avatar-fallback">
              {(displayName || user.email || '?').slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>

        <label className="auth-label" htmlFor="profile-name">
          {t('setupProfileNameLabel')}
        </label>
        <input
          id="profile-name"
          className="auth-input"
          type="text"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder={t('setupProfileNamePlaceholder')}
          autoComplete="nickname"
        />

        {error && <p className="auth-error">{error}</p>}

        <button
          type="button"
          className="auth-btn auth-btn-primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {t('setupProfileSubmit')}
        </button>
      </div>
    </main>
  )
}
