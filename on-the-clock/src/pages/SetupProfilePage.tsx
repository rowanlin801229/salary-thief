import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AvatarEditor } from '../components/AvatarEditor'
import { useAppState } from '../context/AppStateContext'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { backfillLocalStorageSessions } from '../lib/firestore-session'
import { uploadProfileImage } from '../lib/imageUpload'
import { isScheduleComplete } from '../lib/salary'
import { loadMonthlyHistory, yearMonthFromDate } from '../lib/storage'
import type { SalaryConfig } from '../types'

function getDestination(salaryConfig: SalaryConfig, from?: string): string {
  const hasSalary = salaryConfig.amount > 0 && isScheduleComplete(salaryConfig)
  if (!hasSalary) return '/setup'
  if (from && from !== '/signin' && from !== '/signup') return from
  return '/result'
}

export function SetupProfilePage() {
  const { t } = useLanguage()
  const { user, profile, updateUserProfile } = useAuth()
  const { salaryConfig } = useAppState()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [displayName, setDisplayName] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [pendingPhotoDataUrl, setPendingPhotoDataUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/signin', { replace: true, state: { from } })
      return
    }
    if (profile?.displayName?.trim()) {
      navigate(getDestination(salaryConfig, from), { replace: true })
      return
    }
    setDisplayName(profile?.displayName || user.displayName || '')
  }, [user, profile, navigate, salaryConfig, from])

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const currentPhoto = previewUrl || pendingPhotoDataUrl || profile?.photoURL || user?.photoURL || ''

  const handleImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !user) return

    setError(null)
    setUploading(true)
    try {
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl((prev) => {
        if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
        return objectUrl
      })
      const dataUrl = await uploadProfileImage(file, user.uid)
      setPendingPhotoDataUrl(dataUrl)
      setPreviewUrl((prev) => {
        if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
        return dataUrl
      })
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : ''
      if (message === 'photo_format') setError(t('photoFormatError'))
      else if (message === 'photo_size') setError(t('photoSizeError'))
      else setError(t('profileSaveError'))
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    const trimmed = displayName.trim()
    if (!trimmed) {
      setError(t('profileNameRequired'))
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      await updateUserProfile(trimmed, pendingPhotoDataUrl ?? undefined)

      // Backfill 本月 localStorage（失敗不擋）
      const currentMonth = yearMonthFromDate()
      const monthlyLocal = loadMonthlyHistory(currentMonth)
      if (monthlyLocal.length > 0 && user) {
        await backfillLocalStorageSessions(user.uid, monthlyLocal).catch((err) =>
          console.error('[SetupProfile] Backfill failed:', err)
        )
      }

      navigate(getDestination(salaryConfig, from))
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
          <AvatarEditor
            photoSrc={currentPhoto}
            fallbackText={(displayName || user.email || '?').slice(0, 1).toUpperCase()}
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
          disabled={submitting || uploading}
        >
          {t('setupProfileSubmit')}
        </button>
      </div>
    </main>
  )
}
