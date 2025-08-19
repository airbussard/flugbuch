import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import DebugPanel from '@/components/debug/DebugPanel'
import VersionFooter from '@/components/dashboard/VersionFooter'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar user={user} />
        <main className="flex-1 p-6">
          {children}
        </main>
        <VersionFooter />
      </div>
      <DebugPanel />
    </div>
  )
}