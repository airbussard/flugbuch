import { createClient } from '@/lib/supabase/server'
import CrewTable from '@/components/crew/CrewTable'
import { Button } from '@/components/ui/button'
import { Plus, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { debug, logSupabaseQuery, logSupabaseResponse } from '@/lib/debug'

export default async function CrewPage() {
  debug.info('CrewPage: Starting render')
  
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  debug.auth('CrewPage: Auth check', { userId: user?.id, email: user?.email })
  
  if (!user) {
    debug.warn('CrewPage: No user authenticated')
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Please log in to view your crew
        </div>
      </div>
    )
  }
  
  // Log query details
  logSupabaseQuery('crew_members', 'select', {
    user_id: user.id,
    deleted: false
  })
  
  const { data: crew, error } = await supabase
    .from('crew_members')
    .select('*')
    .eq('user_id', user.id)
    .eq('deleted', false)
    .order('name', { ascending: true })
  
  // Log response
  logSupabaseResponse('crew_members', crew, error)
  debug.db('CrewPage: Query complete', {
    resultCount: crew?.length || 0,
    hasError: !!error
  })
  
  if (error) {
    debug.error('CrewPage: Database error', error)
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading crew: {error.message}
        </div>
      </div>
    )
  }

  // Log successful render
  debug.success('CrewPage: Rendering crew table', { count: crew?.length || 0 })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crew Members</h1>
          <p className="text-gray-600 mt-1">Manage your crew and co-pilots</p>
        </div>
        <Link href="/crew/new">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Crew Member
          </Button>
        </Link>
      </div>

      <CrewTable crew={crew || []} />
    </div>
  )
}