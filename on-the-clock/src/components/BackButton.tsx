import { useLocation, useNavigate } from 'react-router-dom'
import { useAppState } from '../context/AppStateContext'
import { useLanguage } from '../context/LanguageContext'
import { clearActiveTimer } from '../lib/storage'

function BackIcon() {
  return (
    <svg className="back-button-icon" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M15 6 L9 12 L15 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BackButton() {
  const location = useLocation()
  const navigate = useNavigate()
  const { clearTimer } = useAppState()
  const { t } = useLanguage()

  if (location.pathname === '/setup') return null

  const handleBack = () => {
    if (location.pathname === '/timer') {
      clearTimer()
      clearActiveTimer()
      navigate('/setup')
    } else if (location.pathname === '/result') {
      navigate('/timer')
    } else if (location.pathname === '/history') {
      navigate('/result')
    } else if (location.pathname === '/achievement') {
      navigate('/result')
    } else if (location.pathname === '/user-profile') {
      navigate('/result')
    }
  }

  return (
    <div className="back-button-row">
      <button type="button" className="back-button" onClick={handleBack}>
        <BackIcon />
        <span className="back-button-text">{t('back')}</span>
      </button>
    </div>
  )
}
