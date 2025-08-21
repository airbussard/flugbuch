'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import FlightForm from '@/components/flights/FlightForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CrewAssignment } from '@/components/flights/CrewSelector'

export default function NewFlightPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (data: any) => {
    setLoading(true)
    setError(null)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError('Sie müssen angemeldet sein')
      setLoading(false)
      return
    }

    // Extract crew assignments from data
    const crewAssignments: CrewAssignment[] = data.crew_assignments || []
    delete data.crew_assignments

    // Format times for database (convert time strings to timestamps)
    const flightDate = data.flight_date
    const formattedData = {
      ...data,
      user_id: user.id,
      deleted: false,
      off_block: data.off_block ? `${flightDate}T${data.off_block}:00` : null,
      on_block: data.on_block ? `${flightDate}T${data.on_block}:00` : null,
      takeoff: data.takeoff ? `${flightDate}T${data.takeoff}:00` : null,
      landing: data.landing ? `${flightDate}T${data.landing}:00` : null,
      block_time: data.block_time || null
    }
    
    // Insert flight
    const { data: insertedFlight, error: flightError } = await supabase
      .from('flights')
      .insert([formattedData])
      .select()
      .single()

    if (flightError || !insertedFlight) {
      console.error('Error creating flight:', flightError)
      setError('Fehler beim Speichern des Fluges')
      setLoading(false)
      return
    }

    // Insert flight_roles if crew was assigned
    if (crewAssignments.length > 0) {
      const flightRoles = crewAssignments.map(assignment => ({
        flight_id: insertedFlight.id,
        crew_member_id: assignment.crew_member_id,
        role_name: assignment.role_name,
        user_id: user.id,
        deleted: false
      }))

      const { error: rolesError } = await supabase
        .from('flight_roles')
        .insert(flightRoles)

      if (rolesError) {
        console.error('Error creating flight roles:', rolesError)
        // Don't fail the whole operation if roles fail, but log it
      }
    }

    router.push('/flights')
    router.refresh()
    
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/flights" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zu Flügen
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Neuen Flug hinzufügen</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}
        
        <FlightForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}