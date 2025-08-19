'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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
}

export default function FlightEditForm({ flight, aircraft, crewMembers }: FlightEditFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const supabase = createClient()
    
    try {
      // Update flight
      const { error: updateError } = await supabase
        .from('flights')
        .update({
          flight_date: formData.get('flight_date'),
          departure_airport: formData.get('departure_airport'),
          arrival_airport: formData.get('arrival_airport'),
          registration: formData.get('registration'),
          aircraft_type: formData.get('aircraft_type'),
          flight_number: formData.get('flight_number') || null,
          block_time: parseFloat(formData.get('block_time') as string) || null,
          pic_time: parseFloat(formData.get('pic_time') as string) || null,
          sic_time: parseFloat(formData.get('sic_time') as string) || null,
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
          
          {/* Registration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration *
            </label>
            <input
              type="text"
              name="registration"
              defaultValue={flight.registration}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          {/* Aircraft Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aircraft Type *
            </label>
            <input
              type="text"
              name="aircraft_type"
              defaultValue={flight.aircraft_type}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
      
      {/* Flight Times */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Times</h3>
        
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PIC Time
            </label>
            <input
              type="number"
              name="pic_time"
              defaultValue={flight.pic_time || ''}
              step="0.1"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SIC Time
            </label>
            <input
              type="number"
              name="sic_time"
              defaultValue={flight.sic_time || ''}
              step="0.1"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
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