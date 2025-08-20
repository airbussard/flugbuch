import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { airportService } from '@/lib/data/airport-service'
import AirportDetail from '@/components/airports/AirportDetail'
import AirportMap from '@/components/airports/AirportMap'
import AirportWeather from '@/components/airports/AirportWeather'
import AirportFrequencies from '@/components/airports/AirportFrequencies'
import AirportRunways from '@/components/airports/AirportRunways'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit } from 'lucide-react'

interface PageProps {
  params: Promise<{ icao: string }>
}

export default async function AirportDetailPage({ params }: PageProps) {
  const { icao } = await params
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return notFound()
  }
  
  // Check if user is admin
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  const isAdmin = profile?.is_admin || false
  
  // Load airport data using server-side method
  await airportService.loadAirportsFromFile()
  const airport = await airportService.getAirport(icao.toUpperCase())
  
  if (!airport) {
    notFound()
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/airports">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Airports
            </Button>
          </Link>
        </div>
        {isAdmin && (
          <Link href={`/airports/admin/editor?icao=${airport.icao}`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Airport
            </Button>
          </Link>
        )}
      </div>
      
      {/* Airport Details */}
      <AirportDetail airport={airport} />
      
      {/* Map Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Airport Location
        </h2>
        <AirportMap airport={airport} />
      </div>
      
      {/* Weather Section */}
      <AirportWeather icao={airport.icao} />
      
      {/* Frequencies Section */}
      <AirportFrequencies icao={airport.icao} />
      
      {/* Runways Section */}
      <AirportRunways icao={airport.icao} />
    </div>
  )
}