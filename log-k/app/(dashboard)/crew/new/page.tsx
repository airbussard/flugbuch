import { createClient } from '@/lib/supabase/server'
import CrewForm from '@/components/crew/CrewForm'
import { redirect } from 'next/navigation'

export default async function NewCrewMemberPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="p-6">
      <CrewForm mode="create" />
    </div>
  )
}