'use client'

import { useState, useEffect } from 'react'
import { frequencyService, type Frequency } from '@/lib/data/frequency-service'
import { Radio, Loader2 } from 'lucide-react'

interface AirportFrequenciesProps {
  icao: string
}

export default function AirportFrequencies({ icao }: AirportFrequenciesProps) {
  const [frequencies, setFrequencies] = useState<Frequency[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFrequencies = async () => {
      setLoading(true)
      try {
        const data = await frequencyService.getFrequencies(icao)
        // Group and sort frequencies by type
        const sorted = data.sort((a, b) => {
          const typeOrder = ['ATIS', 'CLEARANCE', 'GROUND', 'TOWER', 'DEPARTURE', 'APPROACH', 'CENTER', 'CTAF', 'UNICOM', 'AFIS', 'FSS', 'EMERGENCY', 'A/D']
          const aIndex = typeOrder.indexOf(a.type)
          const bIndex = typeOrder.indexOf(b.type)
          if (aIndex === -1 && bIndex === -1) return a.type.localeCompare(b.type)
          if (aIndex === -1) return 1
          if (bIndex === -1) return -1
          return aIndex - bIndex
        })
        setFrequencies(sorted)
      } catch (error) {
        console.error('Failed to load frequencies:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFrequencies()
  }, [icao])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Radio className="h-5 w-5 text-blue-500" />
          Frequenzen
        </h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
        </div>
      </div>
    )
  }

  if (frequencies.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Radio className="h-5 w-5 text-blue-500" />
          Frequenzen
        </h2>
        <p className="text-gray-500 dark:text-gray-400">Keine Frequenzen verfügbar</p>
      </div>
    )
  }

  // Group frequencies by type
  const groupedFrequencies = frequencies.reduce((acc, freq) => {
    if (!acc[freq.type]) {
      acc[freq.type] = []
    }
    acc[freq.type].push(freq)
    return acc
  }, {} as Record<string, Frequency[]>)

  const getFrequencyColor = (type: string) => {
    const colors: Record<string, string> = {
      'ATIS': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'TOWER': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'GROUND': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'APPROACH': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'DEPARTURE': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'CENTER': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'CTAF': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'EMERGENCY': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Radio className="h-5 w-5 text-blue-500" />
        Frequenzen
      </h2>
      
      <div className="space-y-4">
        {Object.entries(groupedFrequencies).map(([type, freqs]) => (
          <div key={type}>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {type}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {freqs.map((freq, idx) => (
                <div
                  key={`${type}-${idx}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-900"
                >
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getFrequencyColor(type)}`}>
                    {type}
                  </span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white">
                    {freq.frequency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}