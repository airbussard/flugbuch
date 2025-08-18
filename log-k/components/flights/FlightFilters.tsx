'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Filter, Calendar } from 'lucide-react'

interface Aircraft {
  id: string
  registration: string
  type: string
}

export default function FlightFilters({ aircraft }: { aircraft: Aircraft[] }) {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    aircraftId: '',
    airport: '',
    search: ''
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    // TODO: Implement filter logic
    console.log('Applying filters:', filters)
  }

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      aircraftId: '',
      airport: '',
      search: ''
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aircraft
          </label>
          <Select
            value={filters.aircraftId}
            onChange={(e) => handleFilterChange('aircraftId', e.target.value)}
            className="w-full"
          >
            <option value="">All Aircraft</option>
            {aircraft.map(ac => (
              <option key={ac.id} value={ac.id}>
                {ac.registration} - {ac.type}
              </option>
            ))}
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Airport
          </label>
          <Input
            type="text"
            placeholder="ICAO Code"
            value={filters.airport}
            onChange={(e) => handleFilterChange('airport', e.target.value.toUpperCase())}
            className="w-full"
            maxLength={4}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-end gap-2">
          <Button onClick={applyFilters} className="flex-1">
            <Filter className="h-4 w-4 mr-2" />
            Apply
          </Button>
          <Button onClick={resetFilters} variant="outline">
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}