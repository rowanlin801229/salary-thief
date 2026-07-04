import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLanguage } from './LanguageContext'

interface BossKeyContextValue {
  isActive: boolean
  toggle: () => void
  deactivate: () => void
}

const BossKeyContext = createContext<BossKeyContextValue | null>(null)

export function BossKeyProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage()
  const [isActive, setIsActive] = useState(false)

  const deactivate = useCallback(() => setIsActive(false), [])
  const toggle = useCallback(() => setIsActive((prev) => !prev), [])

  useEffect(() => {
    if (!isActive) {
      document.title = t('appTitle')
      return
    }

    document.title = 'Inbox - Mail'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsActive(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive, t])

  const value = useMemo(
    () => ({
      isActive,
      toggle,
      deactivate
    }),
    [isActive, toggle, deactivate]
  )

  return <BossKeyContext.Provider value={value}>{children}</BossKeyContext.Provider>
}

export function useBossKey() {
  const context = useContext(BossKeyContext)
  if (!context) {
    throw new Error('useBossKey must be used within BossKeyProvider')
  }
  return context
}
