import { createClient } from '@/lib/supabase/server'
import FlightsTable from '@/components/flights/FlightsTable'
import FlightFilters from '@/components/flights/FlightFilters'
import { Button } from '@/components/ui/button'
import { Plus, Download } from 'lucide-react'
import Link from 'next/link'

export default async function FlightsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: flights } = await supabase
    .from('flights')
    .select('*')
    .eq('user_id', user?.id)
    .eq('deleted', false)
    .order('date', { ascending: false })

  const { data: aircraft } = await supabase
    .from('aircraft')
    .select('id, registration, type')
    .eq('user_id', user?.id)
    .eq('deleted', false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Flight Logbook</h1>
          <p className="text-gray-600 mt-1">Manage your flight records</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Link href="/flights/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Flight
            </Button>
          </Link>
        </div>
      </div>

      <FlightFilters aircraft={aircraft || []} />
      <FlightsTable flights={flights || []} />
    </div>
  )
}