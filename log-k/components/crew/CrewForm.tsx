'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface CrewFormProps {
  crewMember?: any
  mode: 'create' | 'edit'
}

export default function CrewForm({ crewMember, mode }: CrewFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: crewMember?.name || '',
    first_name: crewMember?.first_name || '',
    last_name: crewMember?.last_name || '',
    email: crewMember?.email || '',
    license_number: crewMember?.license_number || '',
    airline: crewMember?.airline || '',
    homebase: crewMember?.homebase || '',
    rank: crewMember?.rank || '',
    notes: crewMember?.notes || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('You must be logged in')
        return
      }

      // Generate full name if not provided
      const fullName = formData.name || `${formData.first_name} ${formData.last_name}`.trim()
      
      const crewData = {
        ...formData,
        name: fullName,
        user_id: user.id,
        deleted: false,
      }

      if (mode === 'edit' && crewMember?.id) {
        const { error } = await supabase
          .from('crew_members')
          .update(crewData)
          .eq('id', crewMember.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('crew_members')
          .insert([crewData])
        
        if (error) throw error
      }

      router.push('/crew')
      router.refresh()
    } catch (err: any) {
      console.error('Error saving crew member:', err)
      setError(err.message || 'Failed to save crew member')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this crew member?')) return
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from('crew_members')
        .update({ deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', crewMember.id)
      
      if (error) throw error
      
      router.push('/crew')
      router.refresh()
    } catch (err: any) {
      console.error('Error deleting crew member:', err)
      setError(err.message || 'Failed to delete crew member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/crew" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Crew
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {mode === 'create' ? 'Add New Crew Member' : 'Edit Crew Member'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
                placeholder="John"
              />
            </div>

            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
                placeholder="Doe"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@airline.com"
              />
            </div>

            <div>
              <Label htmlFor="license_number">License Number</Label>
              <Input
                id="license_number"
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                placeholder="ATPL-12345"
              />
            </div>

            <div>
              <Label htmlFor="rank">Rank/Position</Label>
              <Input
                id="rank"
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                placeholder="Captain"
              />
            </div>

            <div>
              <Label htmlFor="airline">Airline</Label>
              <Input
                id="airline"
                value={formData.airline}
                onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                placeholder="Lufthansa"
              />
            </div>

            <div>
              <Label htmlFor="homebase">Home Base</Label>
              <Input
                id="homebase"
                value={formData.homebase}
                onChange={(e) => setFormData({ ...formData, homebase: e.target.value })}
                placeholder="FRA"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {mode === 'edit' && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete Crew Member
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Crew Member'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}