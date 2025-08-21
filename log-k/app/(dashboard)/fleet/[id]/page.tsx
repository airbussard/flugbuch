import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AircraftDetail from '@/components/fleet/AircraftDetail'
import AircraftFlightsList from '@/components/fleet/AircraftFlightsList'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function AircraftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          Please log in to view aircraft details
        </div>
      </div>
    )
  }
  
  // Get aircraft details
  const { data: aircraft, error: aircraftError } = await supabase
    .from('aircrafts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('deleted', false)
    .single()
  
  if (aircraftError || !aircraft) {
    notFound()
  }
  
  // Get flights with this aircraft - search by registration which is more reliable
  // Many flights might not have aircraft_id but will have registration
  console.log('🔍 Searching for flights with aircraft:', {
    aircraftId: id,
    registration: aircraft.registration,
    userId: user.id
  })
  
  const { data: flights, error: flightsError } = await supabase
    .from('flights')
    .select('*')
    .eq('registration', aircraft.registration)
    .eq('user_id', user.id)
    .eq('deleted', false)
    .order('flight_date', { ascending: false })
  
  if (flightsError) {
    console.error('❌ Error fetching flights:', flightsError)
  }
  
  console.log('✈️ Flights found:', {
    count: flights?.length || 0,
    registration: aircraft.registration,
    error: flightsError
  })
  
  // Calculate statistics
  const stats = {
    totalFlights: flights?.length || 0,
    totalBlockTime: flights?.reduce((acc, f) => acc + (f.block_time || 0), 0) || 0,
    totalLandings: flights?.reduce((acc, f) => acc + (f.landings_day || 0) + (f.landings_night || 0), 0) || 0,
    totalPicTime: flights?.reduce((acc, f) => acc + (f.pic_time || 0), 0) || 0,
    totalSicTime: flights?.reduce((acc, f) => acc + (f.sic_time || 0), 0) || 0,
    totalNightTime: flights?.reduce((acc, f) => acc + (f.night_time || 0), 0) || 0,
    totalIfrTime: flights?.reduce((acc, f) => acc + (f.ifr_time || 0), 0) || 0,
    totalVfrTime: flights?.reduce((acc, f) => acc + (f.vfr_time || 0), 0) || 0,
  }
  
  console.log('📊 Statistics calculated:', stats)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/fleet" 
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Fleet
        </Link>
      </div>
      
      <AircraftDetail aircraft={aircraft} stats={stats} />
      
      <AircraftFlightsList flights={flights || []} aircraftRegistration={aircraft.registration} />
    </div>
  )
}