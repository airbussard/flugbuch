'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { extractUTCTime, extractUTCDate } from '@/lib/utils/utc-time'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import AircraftSelector from './AircraftSelector'
import CrewSelector, { CrewAssignment } from './CrewSelector'

interface Flight {
  id: string
  flight_date: string
  departure_airport: string
  arrival_airport: string
  registration: string
  aircraft_type: string
  aircraft_id: string | null
  flight_number: string | null
  off_block: string | null
  on_block: string | null
  takeoff: string | null
  landing: string | null
  block_time: number | null
  pic_time: number | null
  sic_time: number | null
  night_time: number | null
  ifr_time: number | null
  vfr_time: number | null
  cross_country_time: number | null
  multi_pilot_time: number | null
  dual_given_time: number | null
  dual_received_time: number | null
  landings_day: number | null
  landings_night: number | null
  remarks: string | null
}

interface Aircraft {
  id: string
  registration: string
  aircraft_type: string
}

interface CrewMember {
  id: string
  name: string
}

interface FlightEditFormProps {
  flight: Flight
  aircraft: Aircraft[]
  crewMembers: CrewMember[]
  existingCrewAssignments?: CrewAssignment[]
}

export default function FlightEditForm({ flight, aircraft, crewMembers, existingCrewAssignments = [] }: FlightEditFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Initialize role based on existing PIC/SIC times
  const [myRole, setMyRole] = useState<'PIC' | 'SIC'>(
    flight.pic_time && flight.pic_time > 0 ? 'PIC' : 'SIC'
  )
  const [blockTime, setBlockTime] = useState(flight.block_time || 0)
  
  // Aircraft selection state
  const [selectedAircraftId, setSelectedAircraftId] = useState<string | null>(flight.aircraft_id)
  const [registration, setRegistration] = useState(flight.registration)
  const [aircraftType, setAircraftType] = useState(flight.aircraft_type)
  
  // Crew assignments state
  const [crewAssignments, setCrewAssignments] = useState<CrewAssignment[]>(existingCrewAssignments)
  
  const handleAircraftChange = (aircraftId: string | null, reg: string, type: string) => {
    setSelectedAircraftId(aircraftId)
    setRegistration(reg)
    setAircraftType(type)
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const supabase = createClient()
    
    try {
      // Calculate PIC/SIC time based on selected role
      const currentBlockTime = parseFloat(formData.get('block_time') as string) || 0
      const picTime = myRole === 'PIC' ? currentBlockTime : 0
      const sicTime = myRole === 'SIC' ? currentBlockTime : 0
      
      // Get date and times for UTC timestamps
      const flightDate = formData.get('flight_date') as string
      const offBlockTime = formData.get('off_block') as string
      const onBlockTime = formData.get('on_block') as string
      const takeoffTime = formData.get('takeoff') as string
      const landingTime = formData.get('landing') as string
      
      // Update flight
      const { error: updateError } = await supabase
        .from('flights')
        .update({
          flight_date: flightDate,
          departure_airport: formData.get('departure_airport'),
          arrival_airport: formData.get('arrival_airport'),
          registration: registration,
          aircraft_type: aircraftType,
          aircraft_id: selectedAircraftId,
          flight_number: formData.get('flight_number') || null,
          off_block: offBlockTime ? `${flightDate}T${offBlockTime}:00Z` : null,
          on_block: onBlockTime ? `${flightDate}T${onBlockTime}:00Z` : null,
          takeoff: takeoffTime ? `${flightDate}T${takeoffTime}:00Z` : null,
          landing: landingTime ? `${flightDate}T${landingTime}:00Z` : null,
          block_time: currentBlockTime,
          pic_time: picTime,
          sic_time: sicTime,
          night_time: parseFloat(formData.get('night_time') as string) || null,
          ifr_time: parseFloat(formData.get('ifr_time') as string) || null,
          vfr_time: parseFloat(formData.get('vfr_time') as string) || null,
          cross_country_time: parseFloat(formData.get('cross_country_time') as string) || null,
          multi_pilot_time: parseFloat(formData.get('multi_pilot_time') as string) || null,
          dual_given_time: parseFloat(formData.get('dual_given_time') as string) || null,
          dual_received_time: parseFloat(formData.get('dual_received_time') as string) || null,
          landings_day: parseInt(formData.get('landings_day') as string) || 0,
          landings_night: parseInt(formData.get('landings_night') as string) || 0,
          remarks: formData.get('remarks') || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', flight.id)
      
      if (updateError) throw updateError
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      // Handle crew assignments
      // First, delete all existing flight_roles for this flight
      await supabase
        .from('flight_roles')
        .delete()
        .eq('flight_id', flight.id)
        .eq('user_id', user.id)
      
      // Then insert new crew assignments
      if (crewAssignments.length > 0) {
        const flightRoles = crewAssignments.map(assignment => ({
          flight_id: flight.id,
          crew_member_id: assignment.crew_member_id,
          role_name: assignment.role_name,
          user_id: user.id,
          deleted: false
        }))
        
        const { error: rolesError } = await supabase
          .from('flight_roles')
          .insert(flightRoles)
        
        if (rolesError) {
          console.error('Error updating flight roles:', rolesError)
          // Don't fail the whole operation, but log the error
        }
      }
      
      router.push(`/flights/${flight.id}`)
      router.refresh()
    } catch (err) {
      console.error('Error updating flight:', err)
      setError('Failed to update flight. Please try again.')
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Flight Information</h3>
          <Link href={`/flights/${flight.id}`}>
            <Button type="button" variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </Link>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Flight Date *
            </label>
            <input
              type="date"
              name="flight_date"
              defaultValue={flight.flight_date}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          {/* Flight Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Flight Number
            </label>
            <input
              type="text"
              name="flight_number"
              defaultValue={flight.flight_number || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          {/* Departure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure Airport *
            </label>
            <input
              type="text"
              name="departure_airport"
              defaultValue={flight.departure_airport}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="ICAO/IATA"
            />
          </div>
          
          {/* Arrival */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrival Airport *
            </label>
            <input
              type="text"
              name="arrival_airport"
              defaultValue={flight.arrival_airport}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="ICAO/IATA"
            />
          </div>
          
          {/* Aircraft Selector - replaces Registration and Type fields */}
          <div className="md:col-span-2">
            <AircraftSelector
              value={selectedAircraftId}
              onChange={handleAircraftChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        {/* Times Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Off Block (UTC) *
            </label>
            <input
              type="time"
              name="off_block"
              defaultValue={extractUTCTime(flight.off_block)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              On Block (UTC) *
            </label>
            <input
              type="time"
              name="on_block"
              defaultValue={extractUTCTime(flight.on_block)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Takeoff (UTC)
            </label>
            <input
              type="time"
              name="takeoff"
              defaultValue={extractUTCTime(flight.takeoff)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Landing (UTC)
            </label>
            <input
              type="time"
              name="landing"
              defaultValue={extractUTCTime(flight.landing)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
      
      {/* Flight Times */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Times</h3>
        
        {/* My Role Selection */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            My Role in this Flight
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                value="PIC"
                checked={myRole === 'PIC'}
                onChange={() => setMyRole('PIC')}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                PIC (Pilot in Command)
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                value="SIC"
                checked={myRole === 'SIC'}
                onChange={() => setMyRole('SIC')}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                SIC (Second in Command)
              </span>
            </label>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            This determines whether your block time is logged as PIC or SIC time.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Block Time
            </label>
            <input
              type="number"
              name="block_time"
              defaultValue={flight.block_time || ''}
              step="0.1"
              min="0"
              onChange={(e) => setBlockTime(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PIC Time
            </label>
            <input
              type="number"
              value={myRole === 'PIC' ? blockTime : 0}
              step="0.1"
              min="0"
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-calculated</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SIC Time
            </label>
            <input
              type="number"
              value={myRole === 'SIC' ? blockTime : 0}
              step="0.1"
              min="0"
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-calculated</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Night Time
            </label>
            <input
              type="number"
              name="night_time"
              defaultValue={flight.night_time || ''}
              step="0.1"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IFR Time
            </label>
            <input
              type="number"
              name="ifr_time"
              defaultValue={flight.ifr_time || ''}
              step="0.1"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              VFR Time
            </label>
            <input
              type="number"
              name="vfr_time"
              defaultValue={flight.vfr_time || ''}
              step="0.1"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cross Country
            </label>
            <input
              type="number"
              name="cross_country_time"
              defaultValue={flight.cross_country_time || ''}
              step="0.1"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Multi-Pilot
            </label>
            <input
              type="number"
              name="multi_pilot_time"
              defaultValue={flight.multi_pilot_time || ''}
              step="0.1"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dual Given
            </label>
            <input
              type="number"
              name="dual_given_time"
              defaultValue={flight.dual_given_time || ''}
              step="0.1"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dual Received
            </label>
            <input
              type="number"
              name="dual_received_time"
              defaultValue={flight.dual_received_time || ''}
              step="0.1"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Day Landings
            </label>
            <input
              type="number"
              name="landings_day"
              defaultValue={flight.landings_day || 0}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Night Landings
            </label>
            <input
              type="number"
              name="landings_night"
              defaultValue={flight.landings_night || 0}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
      
      {/* Crew Assignments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Crew Members</h3>
        <CrewSelector
          assignments={crewAssignments}
          onChange={setCrewAssignments}
          disabled={isSubmitting}
        />
      </div>
      
      {/* Remarks */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Remarks</h3>
        <textarea
          name="remarks"
          rows={4}
          defaultValue={flight.remarks || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Additional notes or remarks..."
        />
      </div>
      
      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Link href={`/flights/${flight.id}`}>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}