import { en } from './locales/en'
import { de } from './locales/de'
import { fr } from './locales/fr'
import { es } from './locales/es'

export type Language = 'en' | 'de' | 'fr' | 'es'

export type TranslationKeys = typeof en

export const translations: Record<Language, TranslationKeys> = {
  en,
  de,
  fr,
  es
}

export function getTranslation(lang: Language = 'en') {
  return translations[lang] || translations.en
}

// Helper function to get nested translation values
export function t(lang: Language, path: string): string {
  const translation = getTranslation(lang)
  const keys = path.split('.')
  let value: any = translation
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      // Return the path if translation not found (for debugging)
      return path
    }
  }
  
  return typeof value === 'string' ? value : path
}