import { createClient } from '@/lib/supabase/server'
import { createAdminClient, hasAdminAccess } from '@/lib/supabase/admin'
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
    .eq('id', user.id)  // Primary key is 'id', not 'user_id'
    .single()
  
  if (!userProfile?.is_admin) {
    redirect('/dashboard')
  }

  // Check if we have admin access configured
  if (!hasAdminAccess()) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800">Admin Configuration Required</h2>
          <p className="text-yellow-700 mt-2">
            Service role key is not configured. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables.
          </p>
        </div>
      </div>
    )
  }

  // Use admin client for system-wide queries (bypasses RLS)
  const adminSupabase = createAdminClient()
  
  // Fetch system statistics using admin client
  const { count: totalUsers } = await adminSupabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
  
  const { count: totalFlights } = await adminSupabase
    .from('flights')
    .select('*', { count: 'exact', head: true })
    .eq('deleted', false)
  
  const { count: totalAircraft } = await adminSupabase
    .from('aircrafts')
    .select('*', { count: 'exact', head: true })
    .eq('deleted', false)
  
  // Fetch recent users - now shows ALL users
  const { data: recentUsers } = await adminSupabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  
  // Fetch system activity (recent flights across all users)
  const { data: recentActivity } = await adminSupabase
    .from('flights')
    .select(`
      id,
      flight_date,
      departure_airport,
      arrival_airport,
      block_time,
      user_id
    `)
    .eq('deleted', false)
    .order('created_at', { ascending: false })
    .limit(20)
  
  // Fetch user details for the flights
  const userIds = [...new Set(recentActivity?.map(f => f.user_id) || [])]
  const { data: userProfiles } = await adminSupabase
    .from('user_profiles')
    .select('id, first_name, last_name')
    .in('id', userIds)
  
  // Map user profiles to flights
  const activityWithUsers = recentActivity?.map(flight => ({
    ...flight,
    user_profiles: userProfiles?.find(u => u.id === flight.user_id)
  })) || []
  
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
      recentActivity={activityWithUsers}
    />
  )
}