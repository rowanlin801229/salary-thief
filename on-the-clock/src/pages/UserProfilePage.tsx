import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export function UserProfilePage() {
  const { t } = useLanguage()
  const { user, profile, updateUserProfile, signOut } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(profile?.displayName ?? user?.displayName ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSaveName = async () => {
    const trimmed = displayName.trim()
    if (!trimmed) {
      setError(t('profileNameRequired'))
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await updateUserProfile(trimmed)
      setEditing(false)
    } catch {
      setError(t('profileSaveError'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/signin', { replace: true })
  }

  if (!user) return null

  return (
    <main className="auth-page auth-page-in-app">
      <div className="auth-card">
        <h1 className="auth-title">{t('userProfileTitle')}</h1>

        <div className="auth-avatar-wrap">
          {user.photoURL ? (
            <img className="auth-avatar" src={user.photoURL} alt="" />
          ) : (
            <span className="auth-avatar auth-avatar-fallback">
              {(profile?.displayName || user.email || '?').slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>

        <div className="auth-profile-field">
          <span className="auth-label">{t('setupProfileNameLabel')}</span>
          {editing ? (
            <input
              className="auth-input"
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          ) : (
            <p className="auth-profile-value">{profile?.displayName || user.displayName || '—'}</p>
          )}
        </div>

        <div className="auth-profile-field">
          <span className="auth-label">Email</span>
          <p className="auth-profile-value">{user.email || '—'}</p>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-actions-stack">
          {editing ? (
            <button
              type="button"
              className="auth-btn auth-btn-primary"
              onClick={handleSaveName}
              disabled={submitting}
            >
              {t('profileSave')}
            </button>
          ) : (
            <button
              type="button"
              className="auth-btn auth-btn-secondary"
              onClick={() => setEditing(true)}
            >
              {t('profileEditName')}
            </button>
          )}
          <button type="button" className="auth-btn auth-btn-secondary" onClick={handleSignOut}>
            {t('profileSignOut')}
          </button>
          <button type="button" className="auth-btn auth-btn-secondary" onClick={() => navigate('/result')}>
            {t('back')}
          </button>
        </div>
      </div>
    </main>
  )
}
