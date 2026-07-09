import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { NavDrawer } from './NavDrawer'
import { RoughButton } from './RoughButton'

const navItems = [
  { to: '/timer', labelKey: 'timer' },
  { to: '/result', labelKey: 'result' },
  { to: '/history', labelKey: 'history' },
  { to: '/achievement', labelKey: 'achievement' },
  { to: '/leaderboard', labelKey: 'leaderboard' },
] as const

function MenuIcon() {
  return (
    <svg className="nav-menu-icon" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 7 H20" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M3 12 H21" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M4 17 H19" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="nav-drawer-close-icon" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 6 L18 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M18 6 L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function NavMenu() {
  const { t, language } = useLanguage()
  const { user, profile } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const displayName =
    profile?.displayName || user?.displayName || user?.email || t('userMenuFallback')
  const photoURL = profile?.photoURL || user?.photoURL || ''

  return (
    <div className="nav-menu">
      <RoughButton
        type="button"
        className="nav-menu-toggle"
        frameClassName="nav-menu-toggle-frame"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={language === 'zh' ? '開啟選單' : 'Open menu'}
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </RoughButton>

      <NavDrawer isOpen={open} onClose={() => setOpen(false)}>
        <div className="nav-drawer-header">
          <span className="nav-drawer-title">{t('navDrawerTitle')}</span>
          <button
            type="button"
            className="nav-drawer-close"
            aria-label={language === 'zh' ? '關閉選單' : 'Close menu'}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </button>
        </div>

        {user && (
          <>
            <button
              type="button"
              className="nav-drawer-user"
              onClick={() => {
                setOpen(false)
                navigate('/user-profile')
              }}
            >
              {photoURL ? (
                <img className="nav-drawer-avatar" src={photoURL} alt="" />
              ) : (
                <span className="nav-drawer-avatar nav-drawer-avatar-fallback">
                  {displayName.slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="nav-drawer-user-name">{displayName}</span>
            </button>
            <div className="nav-drawer-divider" />
          </>
        )}

        <nav className="nav-drawer-nav" aria-label={language === 'zh' ? '導覽' : 'Navigation'}>
          <ul className="nav-menu-list" role="menu">
            {navItems.map((item) => (
              <li key={item.to} role="none">
                <NavLink
                  to={item.to}
                  role="menuitem"
                  className={({ isActive }) => `nav-menu-link${isActive ? ' is-active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  <span>{t(item.labelKey)}</span>
                  <span className="nav-drawer-chevron" aria-hidden="true">
                    ›
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </NavDrawer>
    </div>
  )
}
