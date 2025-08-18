import { createClient } from '@/lib/supabase/server'
import FlightsPageClient from '@/components/flights/FlightsPageClient'

export default async function FlightsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: flights } = await supabase
    .from('flights')
    .select('*')
    .eq('user_id', user?.id)
    .eq('deleted', false)
    .order('flight_date', { ascending: false })

  const { data: aircraft } = await supabase
    .from('aircrafts')
    .select('id, registration, aircraft_type')
    .eq('user_id', user?.id)
    .eq('deleted', false)

  return (
    <FlightsPageClient 
      initialFlights={flights || []} 
      aircraft={aircraft || []}
      userId={user?.id || ''}
    />
  )
}