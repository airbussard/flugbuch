import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export const getCachedFlights = unstable_cache(
  async (userId: string) => {
    const supabase = await createClient()
    
    const { data: flights } = await supabase
      .from('flights')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)
      .order('flight_date', { ascending: false })
    
    return flights || []
  },
  ['flights'],
  {
    revalidate: 60, // Cache for 1 minute
    tags: ['flights'],
  }
)

export const getCachedAircraft = unstable_cache(
  async (userId: string) => {
    const supabase = await createClient()
    
    const { data: aircraft } = await supabase
      .from('aircrafts')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)
      .order('registration')
    
    return aircraft || []
  },
  ['aircrafts'],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ['aircraft'],
  }
)

export const getCachedCrew = unstable_cache(
  async (userId: string) => {
    const supabase = await createClient()
    
    const { data: crew } = await supabase
      .from('crew_members')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)
      .order('last_name')
    
    return crew || []
  },
  ['crew'],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ['crew'],
  }
)