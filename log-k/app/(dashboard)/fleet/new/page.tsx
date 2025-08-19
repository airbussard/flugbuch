import { createClient } from '@/lib/supabase/server'
import AircraftForm from '@/components/fleet/AircraftForm'
import { redirect } from 'next/navigation'

export default async function NewAircraftPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="p-6">
      <AircraftForm mode="create" />
    </div>
  )
}