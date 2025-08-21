import { createClient } from '@/lib/supabase/server'
import FleetTable from '@/components/fleet/FleetTable'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { debug, logSupabaseQuery, logSupabaseResponse } from '@/lib/debug'

export default async function FleetPage() {
  debug.info('FleetPage: Starting render')
  
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  debug.auth('FleetPage: Auth check', { userId: user?.id, email: user?.email })
  
  if (!user) {
    debug.warn('FleetPage: No user authenticated')
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Please log in to view your fleet
        </div>
      </div>
    )
  }
  
  // Log query details
  logSupabaseQuery('aircrafts', 'select', {
    user_id: user.id,
    deleted: false
  })
  
  const { data: aircraft, error } = await supabase
    .from('aircrafts')
    .select('*')
    .eq('user_id', user.id)
    .eq('deleted', false)
    .order('registration', { ascending: true })
  
  // Log response
  logSupabaseResponse('aircrafts', aircraft, error)
  debug.db('FleetPage: Query complete', {
    resultCount: aircraft?.length || 0,
    hasError: !!error
  })
  
  if (error) {
    debug.error('FleetPage: Database error', error)
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading fleet: {error.message}
        </div>
      </div>
    )
  }

  // Log successful render
  if (aircraft && aircraft.length > 0) {
    debug.success('FleetPage: Rendering aircraft cards', { count: aircraft.length })
  } else {
    debug.info('FleetPage: No aircraft found for user', { userId: user.id })
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

      <FleetTable aircraft={aircraft || []} />
    </div>
  )
}