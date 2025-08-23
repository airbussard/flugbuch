import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('🔷 Creating Supabase client')
  console.log('🔷 Has URL:', !!url)
  console.log('🔷 Has Anon Key:', !!anonKey)
  console.log('🔷 URL starts with:', url?.substring(0, 30))

  if (!url || !anonKey) {
    console.error('🔴 Missing Supabase configuration:', { url: !!url, anonKey: !!anonKey })
    throw new Error('Supabase configuration is missing. Please check environment variables.')
  }

  try {
    const client = createBrowserClient<Database>(url, anonKey)
    console.log('✅ Supabase client created successfully')
    return client
  } catch (error) {
    console.error('🔴 Error creating Supabase client:', error)
    throw error
  }
}