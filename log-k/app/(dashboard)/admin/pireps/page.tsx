import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PIREPModerationPanel from '@/components/admin/PIREPModerationPanel'

export default async function AdminPIREPsPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }
  
  // Check admin status
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!profile?.is_admin) {
    redirect('/dashboard')
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          PIREP Moderation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review and approve pilot reports
        </p>
      </div>
      
      <PIREPModerationPanel />
    </div>
  )
}