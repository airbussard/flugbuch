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
  
  // Fetch user profile
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  // Prepare initial data
  const initialData = {
    firstName: userProfile?.first_name || '',
    lastName: userProfile?.last_name || '',
    email: user.email || '',
    licenseNumber: userProfile?.license_number || '',
    complianceMode: userProfile?.compliance_mode || 'EASA',
    notifications: userProfile?.email_notifications ?? true,
    darkMode: userProfile?.dark_mode ?? false,
    language: userProfile?.language || 'en',
    isAdmin: userProfile?.is_admin || false
  }

  return <SettingsForm initialData={initialData} userId={user.id} />
}