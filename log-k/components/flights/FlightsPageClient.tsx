'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Download, Upload, FileText } from 'lucide-react'
import Link from 'next/link'
import FlightsTable from '@/components/flights/FlightsTable'
import FlightFilters from '@/components/flights/FlightFilters'
import ImportExportModal from '@/components/flights/ImportExportModal'
import { useRealtimeFlights } from '@/lib/hooks/useRealtimeFlights'
import { debug } from '@/lib/debug'

interface FlightsPageClientProps {
  initialFlights: any[]
  aircraft: any[]
  userId: string
}

export default function FlightsPageClient({ 
  initialFlights, 
  aircraft, 
  userId 
}: FlightsPageClientProps) {
  const [showImportExport, setShowImportExport] = useState(false)
  const { flights, refetch } = useRealtimeFlights(userId)
  
  // Use realtime flights if available, otherwise use initial
  const currentFlights = flights.length > 0 ? flights : initialFlights
  
  useEffect(() => {
    debug.info('FlightsPageClient: Mounted', {
      initialFlightsCount: initialFlights.length,
      aircraftCount: aircraft.length,
      userId,
      usingRealtimeFlights: flights.length > 0
    })
  }, [])
  
  useEffect(() => {
    debug.db('FlightsPageClient: Flights updated', {
      currentCount: currentFlights.length,
      isRealtime: flights.length > 0
    })
  }, [currentFlights])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Flight Logbook</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your flight records</p>
        </div>
        <div className="flex gap-3">
          <Link href="/flights/import">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Import LogTen
            </Button>
          </Link>
          <Button 
            variant="outline"
            onClick={() => setShowImportExport(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import/Export
          </Button>
          <Link href="/flights/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Flight
            </Button>
          </Link>
        </div>
      </div>

      <FlightFilters aircraft={aircraft} />
      <FlightsTable flights={currentFlights} />
      
      <ImportExportModal
        isOpen={showImportExport}
        onClose={() => setShowImportExport(false)}
        flights={currentFlights}
        onImportSuccess={() => {
          refetch()
        }}
      />
    </div>
  )
}