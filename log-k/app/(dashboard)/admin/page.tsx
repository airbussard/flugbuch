import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Check if user is admin
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()
  
  if (!userProfile?.is_admin) {
    redirect('/dashboard')
  }
  
  // Fetch system statistics
  const { count: totalUsers } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
  
  const { count: totalFlights } = await supabase
    .from('flights')
    .select('*', { count: 'exact', head: true })
    .eq('deleted', false)
  
  const { count: totalAircraft } = await supabase
    .from('aircrafts')
    .select('*', { count: 'exact', head: true })
    .eq('deleted', false)
  
  // Fetch recent users
  const { data: recentUsers } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  
  // Fetch system activity (recent flights across all users)
  const { data: recentActivity } = await supabase
    .from('flights')
    .select(`
      id,
      flight_date,
      departure_airport,
      arrival_airport,
      block_time,
      user_id,
      user_profiles!inner(first_name, last_name)
    `)
    .eq('deleted', false)
    .order('created_at', { ascending: false })
    .limit(20)
  
  const stats = {
    totalUsers: totalUsers || 0,
    totalFlights: totalFlights || 0,
    totalAircraft: totalAircraft || 0,
    activeToday: 0 // Would need real-time tracking
  }
  
  return (
    <AdminDashboard 
      stats={stats}
      recentUsers={recentUsers || []}
      recentActivity={recentActivity || []}
    />
  )
}