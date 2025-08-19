import { createClient } from '@/lib/supabase/server'
import FlightsPageClient from '@/components/flights/FlightsPageClient'

export default async function FlightsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Please log in to view your flights
        </div>
      </div>
    )
  }
  
  const { data: flights, error: flightsError } = await supabase
    .from('flights')
    .select('*')
    .eq('user_id', user.id)
    .eq('deleted', false)
    .order('flight_date', { ascending: false })

  const { data: aircraft, error: aircraftError } = await supabase
    .from('aircrafts')
    .select('id, registration, aircraft_type')
    .eq('user_id', user.id)
    .eq('deleted', false)
  
  if (flightsError || aircraftError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading data: {flightsError?.message || aircraftError?.message}
        </div>
      </div>
    )
  }

  return (
    <FlightsPageClient 
      initialFlights={flights || []} 
      aircraft={aircraft || []}
      userId={user.id}
    />
  )
}