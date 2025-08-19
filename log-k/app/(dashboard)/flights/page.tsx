import { createClient } from '@/lib/supabase/server'
import FlightsPageClient from '@/components/flights/FlightsPageClient'
import { debug, logSupabaseQuery, logSupabaseResponse } from '@/lib/debug'

export default async function FlightsPage() {
  debug.info('FlightsPage: Starting render')
  
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  debug.auth('FlightsPage: Auth check', { userId: user?.id, email: user?.email })
  
  if (!user) {
    debug.warn('FlightsPage: No user authenticated')
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Please log in to view your flights
        </div>
      </div>
    )
  }
  
  // Query flights
  logSupabaseQuery('flights', 'select', {
    user_id: user.id,
    deleted: false
  })
  
  const { data: flights, error: flightsError } = await supabase
    .from('flights')
    .select('*')
    .eq('user_id', user.id)
    .eq('deleted', false)
    .order('flight_date', { ascending: false })
  
  logSupabaseResponse('flights', flights, flightsError)
  debug.db('FlightsPage: Flights query complete', {
    resultCount: flights?.length || 0,
    hasError: !!flightsError
  })

  // Query aircraft
  logSupabaseQuery('aircrafts', 'select', {
    user_id: user.id,
    deleted: false,
    fields: 'id, registration, aircraft_type'
  })
  
  const { data: aircraft, error: aircraftError } = await supabase
    .from('aircrafts')
    .select('id, registration, aircraft_type')
    .eq('user_id', user.id)
    .eq('deleted', false)
  
  logSupabaseResponse('aircrafts', aircraft, aircraftError)
  debug.db('FlightsPage: Aircraft query complete', {
    resultCount: aircraft?.length || 0,
    hasError: !!aircraftError
  })
  
  if (flightsError || aircraftError) {
    debug.error('FlightsPage: Database error', {
      flightsError: flightsError?.message,
      aircraftError: aircraftError?.message
    })
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading data: {flightsError?.message || aircraftError?.message}
        </div>
      </div>
    )
  }

  debug.success('FlightsPage: Rendering with data', {
    flightsCount: flights?.length || 0,
    aircraftCount: aircraft?.length || 0,
    userId: user.id
  })
  
  return (
    <FlightsPageClient 
      initialFlights={flights || []} 
      aircraft={aircraft || []}
      userId={user.id}
    />
  )
}