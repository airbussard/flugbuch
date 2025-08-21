'use client'

import { useState, useEffect } from 'react'
import { X, UserPlus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export interface CrewAssignment {
  crew_member_id: string
  role_name: string
  name: string
  email?: string
}

interface CrewSelectorProps {
  assignments: CrewAssignment[]
  onChange: (assignments: CrewAssignment[]) => void
  disabled?: boolean
}

interface CrewMember {
  id: string
  name: string
  email: string | null
  license_number: string | null
  rank: string | null
  airline: string | null
}

const FLIGHT_ROLES = ['PIC', 'SIC', 'Student', 'FI', 'Safety Pilot']

export default function CrewSelector({ 
  assignments, 
  onChange,
  disabled = false 
}: CrewSelectorProps) {
  const [availableCrew, setAvailableCrew] = useState<CrewMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showSelector, setShowSelector] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState('PIC')

  useEffect(() => {
    loadCrewMembers()
  }, [])

  const loadCrewMembers = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const { data, error } = await supabase
      .from('crew_members')
      .select('*')
      .eq('user_id', user.id)
      .eq('deleted', false)
      .order('name')

    if (!error && data) {
      setAvailableCrew(data)
    }
    setLoading(false)
  }

  const filteredCrew = availableCrew.filter(member => {
    // Filter out already assigned crew
    if (assignments.some(a => a.crew_member_id === member.id)) {
      return false
    }
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        member.name.toLowerCase().includes(search) ||
        member.email?.toLowerCase().includes(search) ||
        member.rank?.toLowerCase().includes(search) ||
        member.airline?.toLowerCase().includes(search)
      )
    }
    
    return true
  })

  const handleAddCrew = () => {
    if (selectedCrewId) {
      const crew = availableCrew.find(c => c.id === selectedCrewId)
      if (crew) {
        const newAssignment: CrewAssignment = {
          crew_member_id: crew.id,
          role_name: selectedRole,
          name: crew.name,
          email: crew.email || undefined
        }
        onChange([...assignments, newAssignment])
        setSelectedCrewId(null)
        setSelectedRole('PIC')
        setSearchTerm('')
        setShowSelector(false)
      }
    }
  }

  const handleRemoveCrew = (crewId: string) => {
    onChange(assignments.filter(a => a.crew_member_id !== crewId))
  }

  const handleRoleChange = (crewId: string, newRole: string) => {
    onChange(
      assignments.map(a => 
        a.crew_member_id === crewId 
          ? { ...a, role_name: newRole }
          : a
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Crew Mitglieder
        </label>
        {!disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowSelector(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Crew hinzufügen
          </Button>
        )}
      </div>

      {/* Assigned Crew List */}
      {assignments.length > 0 ? (
        <div className="space-y-2">
          {assignments.map((assignment) => (
            <div
              key={assignment.crew_member_id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-violet-600 dark:text-violet-300">
                    {assignment.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {assignment.name}
                  </p>
                  {assignment.email && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {assignment.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={assignment.role_name}
                  onChange={(e) => handleRoleChange(assignment.crew_member_id, e.target.value)}
                  disabled={disabled}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-violet-500 focus:border-violet-500
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {FLIGHT_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCrew(assignment.crew_member_id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <UserPlus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Keine Crew zugewiesen
          </p>
        </div>
      )}

      {/* Crew Selector Modal */}
      {showSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Crew Mitglied hinzufügen
                </h3>
                <button
                  onClick={() => setShowSelector(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Suche nach Name, Rang oder Airline..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              {/* Crew List */}
              <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                {loading ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    Lade Crew...
                  </p>
                ) : filteredCrew.length > 0 ? (
                  filteredCrew.map(member => (
                    <label
                      key={member.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors
                                ${selectedCrewId === member.id 
                                  ? 'bg-violet-50 dark:bg-violet-900/20 border-2 border-violet-500' 
                                  : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent'}`}
                    >
                      <input
                        type="radio"
                        name="crew"
                        value={member.id}
                        checked={selectedCrewId === member.id}
                        onChange={() => setSelectedCrewId(member.id)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {[member.rank, member.airline].filter(Boolean).join(' • ')}
                        </p>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    {searchTerm ? 'Keine Crew gefunden' : 'Keine Crew verfügbar'}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              {selectedCrewId && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rolle
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  >
                    {FLIGHT_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSelector(false)}
              >
                Abbrechen
              </Button>
              <Button
                type="button"
                onClick={handleAddCrew}
                disabled={!selectedCrewId}
              >
                Hinzufügen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}