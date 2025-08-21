'use client'

import { useState } from 'react'
import { Plane, Settings, Calendar, Edit, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface Aircraft {
  id: string
  registration: string
  aircraft_type: string
  serial_number: string | null
  engine_type: string | null
  first_flight: string | null
  aircraft_class: 'SEP' | 'MEP' | 'SET' | 'MET' | null
  default_condition: 'VFR' | 'IFR' | null
  complex_aircraft: boolean
  high_performance: boolean
  tailwheel: boolean
  glass_panel: boolean
}

export default function FleetTable({ aircraft }: { aircraft: Aircraft[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Filter aircraft based on search term
  const filteredAircraft = aircraft.filter(plane => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      plane.registration.toLowerCase().includes(search) ||
      plane.aircraft_type.toLowerCase().includes(search) ||
      plane.aircraft_class?.toLowerCase().includes(search) ||
      plane.serial_number?.toLowerCase().includes(search)
    )
  })
  
  const getClassBadgeColor = (aircraftClass: string | null) => {
    switch (aircraftClass) {
      case 'SEP': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'MEP': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'SET': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'MET': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }
  
  const getFeatures = (plane: Aircraft) => {
    const features = []
    if (plane.complex_aircraft) features.push('Complex')
    if (plane.high_performance) features.push('HP')
    if (plane.tailwheel) features.push('TW')
    if (plane.glass_panel) features.push('Glass')
    return features
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Search Bar */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by registration, type, or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aircraft
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Features
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAircraft.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No aircraft found matching your search' : 'No aircraft in fleet yet'}
                </td>
              </tr>
            ) : (
              filteredAircraft.map((plane) => (
                <tr key={plane.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/fleet/${plane.id}`} className="flex items-center hover:opacity-80">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                          <Plane className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400">
                          {plane.registration}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {plane.aircraft_type}
                    </div>
                    {plane.engine_type && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {plane.engine_type}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {plane.aircraft_class && (
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getClassBadgeColor(plane.aircraft_class)}`}>
                        {plane.aircraft_class}
                      </span>
                    )}
                    {plane.default_condition && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {plane.default_condition}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {getFeatures(plane).map(feature => (
                        <span
                          key={feature}
                          className="px-2 py-1 text-xs font-medium rounded bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {plane.serial_number && (
                      <div className="flex items-center">
                        <Settings className="h-3 w-3 mr-1" />
                        S/N: {plane.serial_number}
                      </div>
                    )}
                    {plane.first_flight && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(plane.first_flight).getFullYear()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/fleet/${plane.id}/edit`}>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost" className="ml-2">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}