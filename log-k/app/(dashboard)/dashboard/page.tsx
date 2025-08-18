import { createClient } from '@/lib/supabase/server'
import { BarChart3, Plane, Users, Clock } from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'
import FlightChart from '@/components/dashboard/FlightChart'
import RecentFlights from '@/components/dashboard/RecentFlights'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Fetch user data
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch statistics
  const { data: flights } = await supabase
    .from('flights')
    .select('*')
    .eq('user_id', user?.id)
    .eq('deleted', false)
    .order('flight_date', { ascending: false })
    .limit(10)

  const { data: aircraft } = await supabase
    .from('aircrafts')
    .select('*')
    .eq('user_id', user?.id)
    .eq('deleted', false)

  const { data: crew } = await supabase
    .from('crew_members')
    .select('*')
    .eq('user_id', user?.id)
    .eq('deleted', false)

  // Calculate statistics
  const totalFlightTime = flights?.reduce((sum, f) => sum + (f.block_time || 0), 0) || 0
  const totalFlights = flights?.length || 0
  const totalAircraft = aircraft?.length || 0
  const totalCrew = crew?.length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back to your flight logbook</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Flight Time"
          value={`${Math.floor(totalFlightTime)}:${Math.round((totalFlightTime % 1) * 60).toString().padStart(2, '0')}`}
          icon={<Clock className="h-6 w-6 text-purple-600" />}
          trend="+12% from last month"
        />
        <StatsCard
          title="Total Flights"
          value={totalFlights.toString()}
          icon={<Plane className="h-6 w-6 text-blue-600" />}
          trend="This period"
        />
        <StatsCard
          title="Aircraft"
          value={totalAircraft.toString()}
          icon={<BarChart3 className="h-6 w-6 text-green-600" />}
          trend="In your fleet"
        />
        <StatsCard
          title="Crew Members"
          value={totalCrew.toString()}
          icon={<Users className="h-6 w-6 text-orange-600" />}
          trend="Active members"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FlightChart flights={flights || []} />
        <RecentFlights flights={flights || []} />
      </div>
    </div>
  )
}