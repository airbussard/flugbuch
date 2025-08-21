import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CrewMemberDetail from '@/components/crew/CrewMemberDetail'
import SharedFlightsList from '@/components/crew/SharedFlightsList'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function CrewMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          Please log in to view crew member details
        </div>
      </div>
    )
  }
  
  // Get crew member details
  const { data: crewMember, error: crewError } = await supabase
    .from('crew_members')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('deleted', false)
    .single()
  
  if (crewError || !crewMember) {
    notFound()
  }
  
  // Get shared flights through flight_roles
  const { data: flightRoles, error: rolesError } = await supabase
    .from('flight_roles')
    .select(`
      *,
      flights (
        id,
        flight_date,
        departure_airport,
        arrival_airport,
        aircraft_type,
        registration,
        block_time,
        pic_time,
        sic_time
      )
    `)
    .eq('crew_member_id', id)
    .eq('user_id', user.id)
    .eq('deleted', false)
    .order('created_at', { ascending: false })
  
  // Extract flights from flight_roles
  const flights = flightRoles?.map(role => ({
    ...role.flights,
    role_name: role.role_name
  })).filter(Boolean) || []
  
  // Calculate statistics
  const stats = {
    totalFlights: flights.length,
    totalBlockTime: flights.reduce((acc, f) => acc + (f.block_time || 0), 0),
    asPIC: flights.filter(f => f.role_name === 'PIC').length,
    asSIC: flights.filter(f => f.role_name === 'SIC').length,
    asInstructor: flights.filter(f => f.role_name === 'Instructor').length,
    asStudent: flights.filter(f => f.role_name === 'Student').length,
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/crew" 
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Crew
        </Link>
      </div>
      
      <CrewMemberDetail crewMember={crewMember} stats={stats} />
      
      <SharedFlightsList flights={flights} crewMemberName={crewMember.name} />
    </div>
  )
}