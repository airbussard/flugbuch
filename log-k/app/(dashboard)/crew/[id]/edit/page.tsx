import { createClient } from '@/lib/supabase/server'
import CrewForm from '@/components/crew/CrewForm'
import { notFound } from 'next/navigation'

export default async function EditCrewMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: crewMember } = await supabase
    .from('crew_members')
    .select('*')
    .eq('id', id)
    .eq('user_id', user?.id)
    .single()
  
  if (!crewMember) {
    notFound()
  }
  
  return (
    <div className="p-6">
      <CrewForm crewMember={crewMember} mode="edit" />
    </div>
  )
}