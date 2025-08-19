import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import DebugPanel from '@/components/debug/DebugPanel'
import VersionFooter from '@/components/dashboard/VersionFooter'
import { subDays } from 'date-fns'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch user profile for TopBar
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Calculate recent landings (last 90 days)
  const ninetyDaysAgo = subDays(new Date(), 90).toISOString()
  
  const { data: recentFlights } = await supabase
    .from('flights')
    .select('landings_day, landings_night')
    .eq('user_id', user.id)
    .eq('deleted', false)
    .gte('flight_date', ninetyDaysAgo)

  const recentLandings = {
    dayLandings: recentFlights?.reduce((sum, f) => sum + (f.landings_day || 0), 0) || 0,
    nightLandings: recentFlights?.reduce((sum, f) => sum + (f.landings_night || 0), 0) || 0,
    totalLandings: 0
  }
  recentLandings.totalLandings = recentLandings.dayLandings + recentLandings.nightLandings

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar 
          user={user} 
          userProfile={userProfile}
          recentLandings={recentLandings}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
        <VersionFooter />
      </div>
      <DebugPanel />
    </div>
  )
}