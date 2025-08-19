import { createClient } from '@/lib/supabase/server'
import AircraftCard from '@/components/fleet/AircraftCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function FleetPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Please log in to view your fleet
        </div>
      </div>
    )
  }
  
  const { data: aircraft, error } = await supabase
    .from('aircrafts')
    .select('*')
    .eq('user_id', user.id)
    .eq('deleted', false)
    .order('registration', { ascending: true })
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading fleet: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Aircraft Fleet</h1>
          <p className="text-gray-600 mt-1">Manage your aircraft</p>
        </div>
        <Link href="/fleet/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Aircraft
          </Button>
        </Link>
      </div>

      {aircraft && aircraft.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aircraft.map((plane) => (
            <AircraftCard key={plane.id} aircraft={plane} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">No aircraft in your fleet yet</p>
          <Link href="/fleet/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Aircraft
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}