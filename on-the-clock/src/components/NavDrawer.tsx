import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type NavDrawerProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function NavDrawer({ isOpen, onClose, children }: NavDrawerProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      <div
        className={`nav-drawer-overlay${isOpen ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={`nav-drawer${isOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        {children}
      </aside>
    </>,
    document.body,
  )
}
