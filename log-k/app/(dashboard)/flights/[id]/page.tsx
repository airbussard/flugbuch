import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { formatDate, formatTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Trash2, Plane, Calendar, Clock, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import FlightMap from '@/components/flights/FlightMap'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function FlightDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }
  
  // Fetch flight details
  const { data: flight, error } = await supabase
    .from('flights')
    .select(`
      *,
      aircrafts (
        id,
        registration,
        aircraft_type
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('deleted', false)
    .single()
  
  if (error || !flight) {
    notFound()
  }
  
  // Fetch crew assignments
  const { data: flightRoles } = await supabase
    .from('flight_roles')
    .select(`
      *,
      crew_members (
        name,
        email
      )
    `)
    .eq('flight_id', id)
    .eq('deleted', false)
  
  const handleDelete = async () => {
    'use server'
    const supabase = await createClient()
    
    await supabase
      .from('flights')
      .update({ deleted: true, deleted_at: new Date().toISOString() })
      .eq('id', id)
    
    redirect('/flights')
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/flights">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Flights
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Flight Details</h1>
        </div>
        <div className="flex space-x-2">
          <Link href={`/flights/${id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <form action={handleDelete}>
            <Button type="submit" variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </form>
        </div>
      </div>
      
      {/* Flight Map */}
      {flight.departure_airport && flight.arrival_airport && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Flugroute
          </h2>
          <FlightMap 
            departureIcao={flight.departure_airport}
            arrivalIcao={flight.arrival_airport}
          />
        </div>
      )}
      
      {/* Flight Overview Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Plane className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {flight.departure_airport} → {flight.arrival_airport}
              </h2>
              <p className="text-gray-600">
                {flight.flight_number ? `Flight ${flight.flight_number} • ` : ''}
                {flight.flight_date ? formatDate(flight.flight_date) : 'No date'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {formatTime(flight.block_time || 0)}
            </p>
            <p className="text-sm text-gray-600">Block Time</p>
          </div>
        </div>
        
        {/* Flight Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Aircraft */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <Plane className="h-4 w-4 mr-2" />
              Aircraft
            </p>
            <p className="font-medium text-gray-900">
              {flight.registration} • {flight.aircraft_type}
            </p>
          </div>
          
          {/* Times */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Block Times
            </p>
            <p className="font-medium text-gray-900">
              {flight.off_block && flight.on_block ? (
                <>
                  {new Date(flight.off_block).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  {' - '}
                  {new Date(flight.on_block).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </>
              ) : 'Not recorded'}
            </p>
          </div>
          
          {/* Landings */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Landings
            </p>
            <p className="font-medium text-gray-900">
              Day: {flight.landings_day || 0} • Night: {flight.landings_night || 0}
            </p>
          </div>
        </div>
      </div>
      
      {/* Time Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-3">
            <p className="text-sm text-gray-600">PIC Time</p>
            <p className="text-xl font-bold text-gray-900">{formatTime(flight.pic_time || 0)}</p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-sm text-gray-600">SIC Time</p>
            <p className="text-xl font-bold text-gray-900">{formatTime(flight.sic_time || 0)}</p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-sm text-gray-600">Night Time</p>
            <p className="text-xl font-bold text-gray-900">{formatTime(flight.night_time || 0)}</p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-sm text-gray-600">IFR Time</p>
            <p className="text-xl font-bold text-gray-900">{formatTime(flight.ifr_time || 0)}</p>
          </div>
        </div>
        
        {/* Additional Times */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="border rounded-lg p-3">
            <p className="text-sm text-gray-600">VFR Time</p>
            <p className="text-xl font-bold text-gray-900">{formatTime(flight.vfr_time || 0)}</p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-sm text-gray-600">Cross Country</p>
            <p className="text-xl font-bold text-gray-900">{formatTime(flight.cross_country_time || 0)}</p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-sm text-gray-600">Multi-Pilot</p>
            <p className="text-xl font-bold text-gray-900">{formatTime(flight.multi_pilot_time || 0)}</p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-sm text-gray-600">Dual Given</p>
            <p className="text-xl font-bold text-gray-900">{formatTime(flight.dual_given_time || 0)}</p>
          </div>
        </div>
      </div>
      
      {/* Crew */}
      {flightRoles && flightRoles.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Crew Members
          </h3>
          <div className="space-y-2">
            {flightRoles.map((role) => (
              <div key={role.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{role.crew_members?.name}</p>
                  <p className="text-sm text-gray-600">{role.crew_members?.email}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {role.role_name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Remarks */}
      {flight.remarks && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Remarks</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{flight.remarks}</p>
        </div>
      )}
      
      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <p>Created: {formatDate(flight.created_at)} at {new Date(flight.created_at).toLocaleTimeString()}</p>
        <p>Last updated: {formatDate(flight.updated_at)} at {new Date(flight.updated_at).toLocaleTimeString()}</p>
      </div>
    </div>
  )
}