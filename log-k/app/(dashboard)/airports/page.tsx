import AirportSearch from '@/components/airports/AirportSearch'
import AirportTable from '@/components/airports/AirportTable'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Globe, Search, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AirportsPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }
  
  // Check if user is admin
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  const isAdmin = profile?.is_admin || false
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="h-7 w-7 text-violet-500" />
            Airports Database
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Search and explore over 74,000 airports worldwide
          </p>
        </div>
        {isAdmin && (
          <Link href="/airports/admin/editor">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Admin Editor
            </Button>
          </Link>
        )}
      </div>
      
      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Search Airports
          </h2>
        </div>
        <AirportSearch />
      </div>
      
      {/* Results Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <AirportTable />
      </div>
    </div>
  )
}