'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { airportService, type Airport } from '@/lib/data/airport-service'
import { MapPin, Plane, Building2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

const ITEMS_PER_PAGE = 20

export default function AirportTable() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [airports, setAirports] = useState<Airport[]>([])
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  
  const query = searchParams.get('q') || ''
  const currentPage = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    const loadAirports = async () => {
      setLoading(true)
      
      // Load all airports (in production, this should be paginated on server)
      await airportService.loadAirports()
      
      if (query) {
        const results = await airportService.searchAirports(query, 1000)
        setFilteredAirports(results)
        setTotalPages(Math.ceil(results.length / ITEMS_PER_PAGE))
      } else {
        // Show some featured airports when no search
        const featured = [
          'EDDF', 'EDDM', 'EDDB', 'KJFK', 'KLAX', 'KORD',
          'EGLL', 'EGKK', 'LFPG', 'LFPO', 'LEMD', 'LEBL',
          'OMDB', 'VHHH', 'RJTT', 'WSSS', 'YSSY', 'YMML'
        ]
        
        const featuredAirports: Airport[] = []
        for (const code of featured) {
          const airport = await airportService.getAirport(code)
          if (airport) featuredAirports.push(airport)
        }
        setFilteredAirports(featuredAirports)
        setTotalPages(1)
      }
      
      setLoading(false)
    }
    
    loadAirports()
  }, [query])

  const paginatedAirports = filteredAirports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/airports?${params.toString()}`)
  }

  const getAirportIcon = (type: string) => {
    switch (type) {
      case 'large':
      case 'large_airport':
        return <Plane className="h-5 w-5 text-blue-500" />
      case 'medium':
      case 'medium_airport':
        return <Plane className="h-4 w-4 text-green-500" />
      case 'small':
      case 'small_airport':
        return <Plane className="h-4 w-4 text-gray-500" />
      case 'heliport':
        return <Building2 className="h-4 w-4 text-orange-500" />
      default:
        return <MapPin className="h-4 w-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  if (filteredAirports.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">
          {query ? `No airports found for "${query}"` : 'No airports to display'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ICAO / IATA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Coordinates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Elevation
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedAirports.map((airport) => (
              <tr 
                key={airport.icao}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {getAirportIcon(airport.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link 
                    href={`/airports/${airport.icao}`}
                    className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium"
                  >
                    <div>{airport.icao}</div>
                    {airport.iata && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {airport.iata}
                      </div>
                    )}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {airport.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {airport.municipality}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {airport.country}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {airport.lat.toFixed(3)}°, {airport.lon.toFixed(3)}°
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {airport.alt} ft
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredAirports.length)} of{' '}
              {filteredAirports.length} airports
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === page
                        ? 'bg-violet-500 text-white'
                        : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}