import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export function UserMenu() {
  const { t } = useLanguage()
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  if (!user) return null

  const displayName = profile?.displayName || user.displayName || user.email || t('userMenuFallback')

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    navigate('/signin', { replace: true })
  }

  return (
    <div className="user-menu app-user-section" ref={menuRef}>
      <button
        type="button"
        className="user-menu-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        {profile?.photoURL || user.photoURL ? (
          <img className="user-menu-avatar" src={profile?.photoURL || user.photoURL || ''} alt="" />
        ) : (
          <span className="user-menu-avatar user-menu-avatar-fallback">
            {displayName.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="user-menu-name app-user-name">{displayName}</span>
      </button>

      {open && (
        <div className="user-menu-panel" role="menu">
          <button
            type="button"
            className="user-menu-item"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              navigate('/user-profile')
            }}
          >
            {t('userProfileTitle')}
          </button>
          <button type="button" className="user-menu-item" role="menuitem" onClick={handleSignOut}>
            {t('profileSignOut')}
          </button>
        </div>
      )}
    </div>
  )
}
