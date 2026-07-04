import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { translations } from '../i18n/translations'
import type { Language } from '../types'

interface LanguageContextValue {
  language: Language
  setLanguage: (next: Language) => void
  t: (key: keyof (typeof translations)['en']) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh')

  const value = useMemo<LanguageContextValue>(() => {
    const dictionary = translations[language]
    return {
      language,
      setLanguage,
      t: (key) => dictionary[key]
    }
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
