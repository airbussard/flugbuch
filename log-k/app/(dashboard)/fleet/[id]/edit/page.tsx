import { createClient } from '@/lib/supabase/server'
import AircraftForm from '@/components/fleet/AircraftForm'
import { notFound } from 'next/navigation'

export default async function EditAircraftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: aircraft } = await supabase
    .from('aircrafts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user?.id)
    .single()
  
  if (!aircraft) {
    notFound()
  }
  
  return (
    <div className="p-6">
      <AircraftForm aircraft={aircraft} mode="edit" />
    </div>
  )
}