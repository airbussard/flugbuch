import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'
import { checkSupabaseConfig } from './config-check'

export async function createClient() {
  const cookieStore = await cookies()
  const { url, anonKey } = checkSupabaseConfig()

  if (!url || !anonKey) {
    throw new Error('Supabase configuration is missing. Check environment variables.')
  }

  return createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method is called from Server Components
          }
        },
      },
    }
  )
}