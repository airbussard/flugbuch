import { createClient } from '@/lib/supabase/server'
import CrewTable from '@/components/crew/CrewTable'
import { Button } from '@/components/ui/button'
import { Plus, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default async function CrewPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Please log in to view your crew
        </div>
      </div>
    )
  }
  
  const { data: crew, error } = await supabase
    .from('crew_members')
    .select('*')
    .eq('user_id', user.id)
    .eq('deleted', false)
    .order('name', { ascending: true })
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading crew: {error.message}
        </div>
      </div>
    )
  }

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