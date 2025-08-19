import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import FlightEditForm from '@/components/flights/FlightEditForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditFlightPage({ params }: PageProps) {
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
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('deleted', false)
    .single()
  
  if (error || !flight) {
    notFound()
  }
  
  // Fetch aircraft for dropdown
  const { data: aircraft } = await supabase
    .from('aircrafts')
    .select('id, registration, aircraft_type')
    .eq('user_id', user.id)
    .eq('deleted', false)
    .order('registration')
  
  // Fetch crew members for assignment
  const { data: crewMembers } = await supabase
    .from('crew_members')
    .select('id, name')
    .eq('user_id', user.id)
    .eq('deleted', false)
    .order('name')
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Flight</h1>
        <p className="text-gray-600 mt-1">Update flight details</p>
      </div>
      
      <FlightEditForm 
        flight={flight}
        aircraft={aircraft || []}
        crewMembers={crewMembers || []}
      />
    </div>
  )
}