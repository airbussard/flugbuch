import { createClient } from '@/lib/supabase/server'
import AircraftCard from '@/components/fleet/AircraftCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function FleetPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: aircraft } = await supabase
    .from('aircraft')
    .select('*')
    .eq('user_id', user?.id)
    .eq('deleted', false)
    .order('registration', { ascending: true })

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