import { createClient } from '@/lib/supabase/server'
import { BarChart3, Plane, Users, Clock } from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'
import FlightChart from '@/components/dashboard/FlightChart'
import RecentFlights from '@/components/dashboard/RecentFlights'
import AirportWeatherMap from '@/components/dashboard/AirportWeatherMap'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Fetch user data
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch user profile for personalization and homebase
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('first_name, last_name, homebase')
    .eq('id', user?.id)  // Changed from user_id to id as per schema
    .single()
  
  // Fetch ALL flights for total statistics
  const { data: allFlights } = await supabase
    .from('flights')
    .select('block_time, flight_date')
    .eq('user_id', user?.id)
    .eq('deleted', false)
  
  // Calculate date for 12 months ago
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
  
  // Fetch recent flights for display
  const { data: recentFlights } = await supabase
    .from('flights')
    .select('*')
    .eq('user_id', user?.id)
    .eq('deleted', false)
    .order('flight_date', { ascending: false })
    .limit(10)
  
  // Fetch flights for chart (last 12 months)
  const { data: chartFlights } = await supabase
    .from('flights')
    .select('flight_date, block_time')
    .eq('user_id', user?.id)
    .eq('deleted', false)
    .gte('flight_date', twelveMonthsAgo.toISOString().split('T')[0])
    .order('flight_date', { ascending: true })

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

  // Calculate statistics from ALL flights
  const totalFlightTime = allFlights?.reduce((sum, f) => sum + (f.block_time || 0), 0) || 0
  const totalFlights = allFlights?.length || 0
  const totalAircraft = aircraft?.length || 0
  const totalCrew = crew?.length || 0
  
  // Calculate trend for last 12 months
  const last12MonthsFlights = allFlights?.filter(f => {
    const flightDate = f.flight_date ? new Date(f.flight_date) : null
    return flightDate && flightDate >= twelveMonthsAgo
  }) || []
  
  const last12MonthsTime = last12MonthsFlights.reduce((sum, f) => sum + (f.block_time || 0), 0)
  const monthlyAverage = last12MonthsTime / 12
  
  // Calculate previous 12 months for comparison
  const twentyFourMonthsAgo = new Date()
  twentyFourMonthsAgo.setMonth(twentyFourMonthsAgo.getMonth() - 24)
  
  const previous12MonthsFlights = allFlights?.filter(f => {
    const flightDate = f.flight_date ? new Date(f.flight_date) : null
    return flightDate && flightDate >= twentyFourMonthsAgo && flightDate < twelveMonthsAgo
  }) || []
  
  const previous12MonthsTime = previous12MonthsFlights.reduce((sum, f) => sum + (f.block_time || 0), 0)
  const previousMonthlyAverage = previous12MonthsTime / 12
  
  const trendPercentage = previousMonthlyAverage > 0 
    ? Math.round(((monthlyAverage - previousMonthlyAverage) / previousMonthlyAverage) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">
          Welcome back to your flight logbook{userProfile?.first_name ? `, ${userProfile.first_name}` : ''}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Flight Time"
          value={`${Math.floor(totalFlightTime)}:${Math.round((totalFlightTime % 1) * 60).toString().padStart(2, '0')}`}
          icon={<Clock className="h-6 w-6 text-purple-600" />}
          trend={trendPercentage !== 0 
            ? `${trendPercentage > 0 ? '+' : ''}${trendPercentage}% vs. previous 12 months`
            : "No change from previous year"
          }
        />
        <StatsCard
          title="Total Flights"
          value={totalFlights.toString()}
          icon={<Plane className="h-6 w-6 text-blue-600" />}
          trend="All flights in system"
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
        <FlightChart flights={chartFlights || []} />
        <RecentFlights flights={recentFlights || []} />
      </div>
      
      {/* Airport Weather Map */}
      <AirportWeatherMap homebase={userProfile?.homebase} />
    </div>
  )
}