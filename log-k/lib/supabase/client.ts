import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.error('Missing Supabase configuration:', { url: !!url, anonKey: !!anonKey })
    throw new Error('Supabase configuration is missing. Please check environment variables.')
  }

  return createBrowserClient<Database>(url, anonKey)
}