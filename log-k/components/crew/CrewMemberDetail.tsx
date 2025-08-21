'use client'

import { User, Mail, Phone, Award, Clock, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface CrewMember {
  id: string
  name: string
  email: string | null
  phone: string | null
  license_number: string | null
  role: string | null
}

interface Stats {
  totalFlights: number
  totalBlockTime: number
  asPIC: number
  asSIC: number
  asInstructor: number
  asStudent: number
}

export default function CrewMemberDetail({ 
  crewMember, 
  stats 
}: { 
  crewMember: CrewMember
  stats: Stats 
}) {
  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}:${mins.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <div className="p-3 bg-violet-100 dark:bg-violet-900 rounded-lg">
            <User className="h-8 w-8 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {crewMember.name}
            </h1>
            {crewMember.role && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {crewMember.role}
              </span>
            )}
          </div>
        </div>
        
        <Link href={`/crew/${crewMember.id}/edit`}>
          <Button variant="outline">
            Edit Profile
          </Button>
        </Link>
      </div>
      
      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {crewMember.email && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Mail className="h-4 w-4 mr-2" />
            <a href={`mailto:${crewMember.email}`} className="hover:text-violet-600">
              {crewMember.email}
            </a>
          </div>
        )}
        
        {crewMember.phone && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Phone className="h-4 w-4 mr-2" />
            <a href={`tel:${crewMember.phone}`} className="hover:text-violet-600">
              {crewMember.phone}
            </a>
          </div>
        )}
        
        {crewMember.license_number && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Award className="h-4 w-4 mr-2" />
            License: {crewMember.license_number}
          </div>
        )}
      </div>
      
      {/* Statistics */}
      <div className="border-t dark:border-gray-700 pt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Flight Statistics
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalFlights}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Total Flights
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatHours(stats.totalBlockTime)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Block Time
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.asPIC}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              As PIC
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.asSIC}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              As SIC
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.asInstructor}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              As Instructor
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.asStudent}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              As Student
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}