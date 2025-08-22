'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/hooks'

interface AirportPageHeaderProps {
  icao: string
  isAdmin: boolean
}

export default function AirportPageHeader({ icao, isAdmin }: AirportPageHeaderProps) {
  const { t } = useTranslation()
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/airports">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('airports.backToAirports')}
          </Button>
        </Link>
      </div>
      {isAdmin && (
        <Link href={`/airports/admin/editor?icao=${icao}`}>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            {t('airports.editAirport')}
          </Button>
        </Link>
      )}
    </div>
  )
}