import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { translations } from '../i18n/translations'
import type { Language } from '../types'

const LANGUAGE_STORAGE_KEY = 'on-the-clock/language'

interface LanguageContextValue {
  language: Language
  setLanguage: (next: Language) => void
  t: (key: keyof (typeof translations)['en']) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function loadLanguage(): Language {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return saved === 'en' || saved === 'zh' ? saved : 'zh'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => loadLanguage())

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, next)
  }, [])

  const value = useMemo<LanguageContextValue>(() => {
    const dictionary = translations[language]
    return {
      language,
      setLanguage,
      t: (key) => dictionary[key]
    }
  }, [language, setLanguage])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
