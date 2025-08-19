'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface AircraftFormProps {
  aircraft?: any
  mode: 'create' | 'edit'
}

export default function AircraftForm({ aircraft, mode }: AircraftFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    registration: aircraft?.registration || '',
    aircraft_type: aircraft?.aircraft_type || '',
    manufacturer: aircraft?.manufacturer || '',
    model: aircraft?.model || '',
    year: aircraft?.year || '',
    engine_type: aircraft?.engine_type || '',
    complex_aircraft: aircraft?.complex_aircraft || false,
    high_performance: aircraft?.high_performance || false,
    tailwheel: aircraft?.tailwheel || false,
    glass_panel: aircraft?.glass_panel || false,
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

      const aircraftData = {
        ...formData,
        user_id: user.id,
        year: formData.year ? parseInt(formData.year) : null,
        deleted: false,
      }

      if (mode === 'edit' && aircraft?.id) {
        const { error } = await supabase
          .from('aircrafts')
          .update(aircraftData)
          .eq('id', aircraft.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('aircrafts')
          .insert([aircraftData])
        
        if (error) throw error
      }

      router.push('/fleet')
      router.refresh()
    } catch (err: any) {
      console.error('Error saving aircraft:', err)
      setError(err.message || 'Failed to save aircraft')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this aircraft?')) return
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from('aircrafts')
        .update({ deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', aircraft.id)
      
      if (error) throw error
      
      router.push('/fleet')
      router.refresh()
    } catch (err: any) {
      console.error('Error deleting aircraft:', err)
      setError(err.message || 'Failed to delete aircraft')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/fleet" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Fleet
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {mode === 'create' ? 'Add New Aircraft' : 'Edit Aircraft'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="registration">Registration *</Label>
              <Input
                id="registration"
                value={formData.registration}
                onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                required
                placeholder="D-ABCD"
              />
            </div>

            <div>
              <Label htmlFor="aircraft_type">Aircraft Type *</Label>
              <Input
                id="aircraft_type"
                value={formData.aircraft_type}
                onChange={(e) => setFormData({ ...formData, aircraft_type: e.target.value })}
                required
                placeholder="Cessna 172"
              />
            </div>

            <div>
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                placeholder="Cessna"
              />
            </div>

            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="172S"
              />
            </div>

            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2020"
              />
            </div>

            <div>
              <Label htmlFor="engine_type">Engine Type</Label>
              <Input
                id="engine_type"
                value={formData.engine_type}
                onChange={(e) => setFormData({ ...formData, engine_type: e.target.value })}
                placeholder="Piston"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">Aircraft Characteristics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.complex_aircraft}
                  onChange={(e) => setFormData({ ...formData, complex_aircraft: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Complex</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.high_performance}
                  onChange={(e) => setFormData({ ...formData, high_performance: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">High Performance</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.tailwheel}
                  onChange={(e) => setFormData({ ...formData, tailwheel: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Tailwheel</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.glass_panel}
                  onChange={(e) => setFormData({ ...formData, glass_panel: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Glass Panel</span>
              </label>
            </div>
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
                  Delete Aircraft
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
                {loading ? 'Saving...' : 'Save Aircraft'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}