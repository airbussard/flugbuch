import { createClient } from '@/lib/supabase/server'
import StatsOverview from '@/components/analytics/StatsOverview'
import FlightsByMonth from '@/components/analytics/FlightsByMonth'
import AircraftUsage from '@/components/analytics/AircraftUsage'
import ComplianceStatus from '@/components/analytics/ComplianceStatus'
import FlightsMap from '@/components/analytics/FlightsMap'

export default async function AnalyticsPage() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data: flights, error: flightsError } = await supabase
      .from('flights')
      .select('*')
      .eq('user_id', user?.id)
      .eq('deleted', false)

    if (flightsError) {
      console.error('Error fetching flights:', flightsError)
    }

    const { data: aircraft, error: aircraftError } = await supabase
      .from('aircrafts')
      .select('*')
      .eq('user_id', user?.id)
      .eq('deleted', false)

    if (aircraftError) {
      console.error('Error fetching aircraft:', aircraftError)
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Flight statistics and insights</p>
      </div>

      <StatsOverview flights={flights || []} />
      
      <FlightsMap flights={flights || []} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FlightsByMonth flights={flights || []} />
        <AircraftUsage flights={flights || []} aircraft={aircraft || []} />
      </div>
      
      <ComplianceStatus flights={flights || []} />
    </div>
  )
  } catch (error) {
    console.error('Analytics page error:', error)
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error Loading Analytics</h2>
          <p className="text-red-600 mt-1">Unable to load analytics data. Please try refreshing the page.</p>
        </div>
      </div>
    )
  }
}