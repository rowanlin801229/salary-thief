import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { RoughButton } from './RoughButton'
import { RoughFrame } from './RoughFrame'

const navItems = [
  { to: '/timer', labelKey: 'timer' },
  { to: '/result', labelKey: 'result' },
  { to: '/history', labelKey: 'history' },
  { to: '/achievement', labelKey: 'achievement' }
] as const

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg className="nav-menu-icon" viewBox="0 0 24 24" aria-hidden>
        <path d="M6 6 L18 18" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M18 6 L6 18" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg className="nav-menu-icon" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 7 H20" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M3 12 H21" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M4 17 H19" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  )
}

export function NavMenu() {
  const { t, language } = useLanguage()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className="nav-menu" ref={menuRef}>
      <RoughButton
        type="button"
        className="nav-menu-toggle"
        frameClassName="nav-menu-toggle-frame"
        active={open}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={language === 'zh' ? '開啟選單' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
      >
        <MenuIcon open={open} />
      </RoughButton>

      {open && (
        <RoughFrame
          className="nav-menu-panel"
        stroke="#000000"
        fill="#FFFFFF"
          contentClassName="nav-menu-panel-content"
        >
          <ul className="nav-menu-list" role="menu">
            {navItems.map((item) => (
              <li key={item.to} role="none">
                <NavLink
                  to={item.to}
                  role="menuitem"
                  className={({ isActive }) => `nav-menu-link${isActive ? ' is-active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {t(item.labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </RoughFrame>
      )}
    </div>
  )
}
