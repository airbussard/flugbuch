'use client'

import { useState, useEffect, useCallback } from 'react'
import { Language, getTranslation, t } from '@/lib/i18n/translations'
import { LanguageContext } from '@/lib/i18n/hooks'
import { createClient } from '@/lib/supabase/client'

interface LanguageProviderProps {
  children: React.ReactNode
  initialLanguage: Language
  userId?: string
}

export default function LanguageProvider({ children, initialLanguage, userId }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)
  const supabase = createClient()

  const setLanguage = useCallback(async (newLang: Language) => {
    setLanguageState(newLang)
    
    // If user is logged in, update their language preference in the database
    if (userId) {
      try {
        await supabase
          .from('user_profiles')
          .update({ language: newLang })
          .eq('id', userId)
      } catch (error) {
        console.error('Failed to update language preference:', error)
      }
    }
  }, [userId, supabase])

  // Listen for language changes from settings
  useEffect(() => {
    const channel = supabase
      .channel('language-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_profiles',
        filter: userId ? `id=eq.${userId}` : undefined
      }, (payload) => {
        if (payload.new && 'language' in payload.new) {
          const newLang = payload.new.language as Language
          if (['en', 'de', 'fr', 'es'].includes(newLang)) {
            setLanguageState(newLang)
          }
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  const value = {
    language,
    setLanguage,
    t: (path: string) => t(language, path),
    translations: getTranslation(language)
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}