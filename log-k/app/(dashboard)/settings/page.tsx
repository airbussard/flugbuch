import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Fetch user profile - using 'id' as primary key which matches auth.users.id
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  // Prepare initial data - map actual database fields
  const initialData = {
    firstName: userProfile?.first_name || '',
    lastName: userProfile?.last_name || '',
    email: userProfile?.email || user.email || '',
    username: userProfile?.username || '',
    licenseNumber: userProfile?.license_number || '',
    complianceMode: userProfile?.compliance_mode || 'EASA',
    homebase: userProfile?.homebase || '',
    // These fields don't exist in DB, using defaults
    notifications: true,
    darkMode: false, 
    language: 'en',
    isAdmin: userProfile?.is_admin || false
  }

  return <SettingsForm initialData={initialData} userId={user.id} />
}