import { createClient } from '@/lib/supabase/server'
import StatsOverview from '@/components/analytics/StatsOverview'
import FlightsByMonth from '@/components/analytics/FlightsByMonth'
import AircraftUsage from '@/components/analytics/AircraftUsage'
import ComplianceStatus from '@/components/analytics/ComplianceStatus'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: flights } = await supabase
    .from('flights')
    .select('*')
    .eq('user_id', user?.id)
    .eq('deleted', false)

  const { data: aircraft } = await supabase
    .from('aircraft')
    .select('*')
    .eq('user_id', user?.id)
    .eq('deleted', false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Flight statistics and insights</p>
      </div>

      <StatsOverview flights={flights || []} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FlightsByMonth flights={flights || []} />
        <AircraftUsage flights={flights || []} aircraft={aircraft || []} />
      </div>
      
      <ComplianceStatus flights={flights || []} />
    </div>
  )
}