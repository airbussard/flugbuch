import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type Flight = Database['public']['Tables']['flights']['Row']

export function useRealtimeFlights(userId: string | undefined) {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    // Initial fetch
    const fetchFlights = async () => {
      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .eq('user_id', userId)
        .eq('deleted', false)
        .order('flight_date', { ascending: false })

      if (!error && data) {
        setFlights(data)
      }
      setLoading(false)
    }

    fetchFlights()

    // Subscribe to changes
    const subscription = supabase
      .channel('flights_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'flights',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Real-time update:', payload)
          
          if (payload.eventType === 'INSERT') {
            setFlights(prev => [payload.new as Flight, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setFlights(prev => 
              prev.map(flight => 
                flight.id === payload.new.id ? payload.new as Flight : flight
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setFlights(prev => prev.filter(flight => flight.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, supabase])

  return { flights, loading, refetch: () => {} }
}