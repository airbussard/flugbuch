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
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (data: any) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Validate required fields
      if (!data.flight_date || !data.departure_airport || !data.arrival_airport || 
          !data.off_block || !data.on_block || !data.registration || !data.aircraft_type) {
        setError('Please fill in all required fields (marked with *)')
        setLoading(false)
        return
      }
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('You must be logged in to save a flight')
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
      const errorMessage = flightError?.message || 'Failed to save flight'
      if (errorMessage.includes('duplicate')) {
        setError('A flight with these details already exists')
      } else if (errorMessage.includes('invalid')) {
        setError('Please check all required fields are filled correctly')
      } else {
        setError(`Error saving flight: ${errorMessage}`)
      }
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

      setSuccess('Flight saved successfully! Redirecting...')
      setTimeout(() => {
        router.push('/flights')
        router.refresh()
      }, 1500)
    } catch (err: any) {
      console.error('Unexpected error:', err)
      setError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/flights" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Flights
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Flight</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg">
            {success}
          </div>
        )}
        
        <FlightForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}