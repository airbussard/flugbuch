'use client'

import { SNOWTAMData, RunwayCondition } from '@/lib/weather/snowtam-decoder'
import { AlertTriangle, Snowflake, Info, CheckCircle, XCircle } from 'lucide-react'

interface SNOWTAMDisplayProps {
  data: SNOWTAMData
}

export default function SNOWTAMDisplay({ data }: SNOWTAMDisplayProps) {
  const getContaminationIcon = (type: RunwayCondition['contaminationType']) => {
    switch (type) {
      case 'SNOW':
      case 'COMPACTED_SNOW':
        return <Snowflake className="h-5 w-5 text-blue-500" />
      case 'ICE':
      case 'FROZEN_RUTS':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'WET':
      case 'WATER':
      case 'SLUSH':
        return <Info className="h-5 w-5 text-yellow-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getBrakingActionColor = (action?: RunwayCondition['brakingAction']) => {
    switch (action) {
      case 'GOOD':
        return 'text-green-600 bg-green-100'
      case 'GOOD_TO_MEDIUM':
        return 'text-blue-600 bg-blue-100'
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100'
      case 'MEDIUM_TO_POOR':
        return 'text-orange-600 bg-orange-100'
      case 'POOR':
        return 'text-red-600 bg-red-100'
      case 'UNRELIABLE':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  const formatObservationTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short'
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {data.stationCode} SNOWTAM
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatObservationTime(data.observationTime)}
          </span>
        </div>
      </div>

      {/* Runway Conditions */}
      <div className="space-y-4">
        {data.runways.map((runway, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getContaminationIcon(runway.contaminationType)}
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  Runway {runway.runway}
                </h4>
              </div>
              {runway.brakingAction && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBrakingActionColor(runway.brakingAction)}`}>
                  {runway.brakingAction.replace(/_/g, ' ')}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Contamination Type */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Contamination</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {runway.contamination.replace(/_/g, ' ')}
                </p>
              </div>

              {/* Coverage */}
              {runway.coverage !== undefined && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Coverage</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {runway.coverage}%
                  </p>
                </div>
              )}

              {/* Depth */}
              {runway.depth !== undefined && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Depth</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {runway.depth} mm
                  </p>
                </div>
              )}

              {/* Friction */}
              {runway.friction !== undefined && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Friction</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {runway.friction.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Remarks */}
      {data.remarks && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Remarks</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 whitespace-pre-wrap">
                {data.remarks}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Raw SNOWTAM */}
      <details className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          View Raw SNOWTAM
        </summary>
        <pre className="mt-3 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono">
          {data.raw}
        </pre>
      </details>
    </div>
  )
}