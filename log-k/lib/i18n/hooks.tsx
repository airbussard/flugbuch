'use client'

import { createContext, useContext } from 'react'
import { Language, getTranslation, t } from './translations'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (path: string) => string
  translations: ReturnType<typeof getTranslation>
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Fallback to English if no context is available
    const fallbackLang: Language = 'en'
    return {
      language: fallbackLang,
      setLanguage: () => {},
      t: (path: string) => t(fallbackLang, path),
      translations: getTranslation(fallbackLang)
    }
  }
  return context
}

export { LanguageContext }