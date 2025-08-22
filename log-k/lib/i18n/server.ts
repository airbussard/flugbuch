import { createClient } from '@/lib/supabase/server'
import { Language, getTranslation, t } from './translations'

export async function getServerTranslation(): Promise<{
  language: Language
  t: (path: string) => string
  translations: ReturnType<typeof getTranslation>
}> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  let language: Language = 'en' // Default language
  
  if (user) {
    // Fetch user's language preference
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('language')
      .eq('id', user.id)
      .single()
    
    if (profile?.language && ['en', 'de', 'fr', 'es'].includes(profile.language)) {
      language = profile.language as Language
    }
  }
  
  return {
    language,
    t: (path: string) => t(language, path),
    translations: getTranslation(language)
  }
}