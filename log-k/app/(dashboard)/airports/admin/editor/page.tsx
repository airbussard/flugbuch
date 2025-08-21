import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AirportEditorWithTabs from '@/components/airports/AirportEditorWithTabs'

interface PageProps {
  searchParams: Promise<{ icao?: string }>
}

export default async function AirportEditorPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }
  
  // Check if user is admin
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!profile?.is_admin) {
    redirect('/airports')
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Airport Data Editor
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Edit airport information in the CSV database
        </p>
      </div>
      
      <AirportEditorWithTabs icao={params.icao} />
    </div>
  )
}