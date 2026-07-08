import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AvatarEditor } from '../components/AvatarEditor'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { uploadProfileImage } from '../lib/imageUpload'

export function UserProfilePage() {
  const { t } = useLanguage()
  const { user, profile, updateUserProfile, updateUserPhoto, signOut } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(profile?.displayName ?? user?.displayName ?? '')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    setDisplayName(profile?.displayName ?? user?.displayName ?? '')
  }, [profile?.displayName, user?.displayName])

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const photoSrc = previewUrl || profile?.photoURL || user?.photoURL || ''

  const handleImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !user) return

    setError(null)
    setSuccess(null)
    setUploading(true)
    try {
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl((prev) => {
        if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
        return objectUrl
      })
      const dataUrl = await uploadProfileImage(file, user.uid)
      await updateUserPhoto(dataUrl)
      setPreviewUrl((prev) => {
        if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
        return null
      })
      setSuccess(t('photoUpdateSuccess'))
      window.setTimeout(() => setSuccess(null), 2000)
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : ''
      if (message === 'photo_format') setError(t('photoFormatError'))
      else if (message === 'photo_size') setError(t('photoSizeError'))
      else setError(t('profileSaveError'))
      setPreviewUrl((prev) => {
        if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
        return null
      })
    } finally {
      setUploading(false)
    }
  }

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
          <AvatarEditor
            photoSrc={photoSrc}
            fallbackText={(profile?.displayName || user.email || '?').slice(0, 1).toUpperCase()}
            uploading={uploading}
            onPick={() => fileInputRef.current?.click()}
            title={uploading ? t('uploadingPhoto') : t('uploadProfilePhoto')}
          />
          <input
            ref={fileInputRef}
            className="auth-file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageSelect}
          />
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
        {success && <p className="auth-success">{success}</p>}

        <div className="auth-actions-stack">
          {editing ? (
            <button
              type="button"
              className="auth-btn auth-btn-primary"
              onClick={handleSaveName}
              disabled={submitting || uploading}
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
