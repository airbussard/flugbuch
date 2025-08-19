import { createClient } from '@/lib/supabase/server'
import { createAdminClient, hasAdminAccess } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import UserManagement from './UserManagement'

export default async function UsersPage() {
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
    .eq('id', user.id)
    .single()
  
  if (!userProfile?.is_admin) {
    redirect('/dashboard')
  }

  // Check if we have admin access configured
  if (!hasAdminAccess()) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800">Admin Configuration Required</h2>
          <p className="text-yellow-700 mt-2">
            Service role key is not configured. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables.
          </p>
        </div>
      </div>
    )
  }

  // Use admin client to get all users
  const adminSupabase = createAdminClient()
  
  // Fetch all users with their profiles
  const { data: users } = await adminSupabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false })
  
  // Get auth users for email addresses
  const { data: { users: authUsers } } = await adminSupabase.auth.admin.listUsers()
  
  // Combine user profiles with auth data
  const usersWithAuth = users?.map(profile => {
    const authUser = authUsers?.find(au => au.id === profile.id)
    return {
      ...profile,
      auth_email: authUser?.email,
      last_sign_in: authUser?.last_sign_in_at
    }
  }) || []
  
  // Calculate statistics
  const stats = {
    totalUsers: users?.length || 0,
    adminUsers: users?.filter(u => u.is_admin).length || 0,
    activeUsers: authUsers?.filter(u => {
      if (!u.last_sign_in_at) return false
      const lastSignIn = new Date(u.last_sign_in_at)
      const daysSinceSignIn = (Date.now() - lastSignIn.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceSignIn <= 30
    }).length || 0
  }
  
  return <UserManagement users={usersWithAuth} stats={stats} />
}