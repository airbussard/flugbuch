'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Plane } from 'lucide-react'
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
    serial_number: aircraft?.serial_number || '',
    engine_type: aircraft?.engine_type || '',
    first_flight: aircraft?.first_flight || '',
    aircraft_class: aircraft?.aircraft_class || '',
    default_condition: aircraft?.default_condition || 'VFR',
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
        setError('Sie müssen angemeldet sein')
        return
      }

      const aircraftData = {
        ...formData,
        user_id: user.id,
        aircraft_class: formData.aircraft_class || null,
        first_flight: formData.first_flight || null,
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
      setError(err.message || 'Fehler beim Speichern des Flugzeugs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Sind Sie sicher, dass Sie dieses Flugzeug löschen möchten?')) return
    
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
      setError(err.message || 'Fehler beim Löschen des Flugzeugs')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/fleet" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zur Flotte
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <Plane className="h-6 w-6 text-violet-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Neues Flugzeug hinzufügen' : 'Flugzeug bearbeiten'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Grundinformationen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="registration">Kennzeichen *</Label>
                <Input
                  id="registration"
                  value={formData.registration}
                  onChange={(e) => setFormData({ ...formData, registration: e.target.value.toUpperCase() })}
                  required
                  placeholder="D-ABCD"
                  className="uppercase"
                />
              </div>

              <div>
                <Label htmlFor="aircraft_type">Flugzeugtyp *</Label>
                <Input
                  id="aircraft_type"
                  value={formData.aircraft_type}
                  onChange={(e) => setFormData({ ...formData, aircraft_type: e.target.value })}
                  required
                  placeholder="Cessna 172"
                />
              </div>

              <div>
                <Label htmlFor="serial_number">Seriennummer</Label>
                <Input
                  id="serial_number"
                  value={formData.serial_number}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                  placeholder="17281234"
                />
              </div>

              <div>
                <Label htmlFor="engine_type">Triebwerkstyp</Label>
                <Input
                  id="engine_type"
                  value={formData.engine_type}
                  onChange={(e) => setFormData({ ...formData, engine_type: e.target.value })}
                  placeholder="Piston"
                />
              </div>

              <div>
                <Label htmlFor="first_flight">Erstflug</Label>
                <Input
                  id="first_flight"
                  type="date"
                  value={formData.first_flight}
                  onChange={(e) => setFormData({ ...formData, first_flight: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Aircraft Classification */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Flugzeugklassifizierung</h3>
            
            <div>
              <Label htmlFor="aircraft_class">Flugzeugklasse</Label>
              <select
                id="aircraft_class"
                value={formData.aircraft_class}
                onChange={(e) => setFormData({ ...formData, aircraft_class: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              >
                <option value="">Nicht spezifiziert</option>
                <option value="SEP">SEP - Single Engine Piston</option>
                <option value="MEP">MEP - Multi Engine Piston</option>
                <option value="SET">SET - Single Engine Turbine</option>
                <option value="MET">MET - Multi Engine Turbine</option>
              </select>
            </div>

            <div>
              <Label>Standard Flugregeln</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Diese werden bei Flügen mit diesem Flugzeug vorausgewählt
              </p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="VFR"
                    checked={formData.default_condition === 'VFR'}
                    onChange={() => setFormData({ ...formData, default_condition: 'VFR' })}
                    className="mr-2"
                  />
                  VFR - Visual Flight Rules
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="IFR"
                    checked={formData.default_condition === 'IFR'}
                    onChange={() => setFormData({ ...formData, default_condition: 'IFR' })}
                    className="mr-2"
                  />
                  IFR - Instrument Flight Rules
                </label>
              </div>
            </div>
          </div>

          {/* Aircraft Characteristics */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Flugzeugeigenschaften</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Wählen Sie zutreffende Eigenschaften für die regulatorische Compliance
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.complex_aircraft}
                  onChange={(e) => setFormData({ ...formData, complex_aircraft: e.target.checked })}
                  className="rounded text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm">Complex</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.high_performance}
                  onChange={(e) => setFormData({ ...formData, high_performance: e.target.checked })}
                  className="rounded text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm">High Performance</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.tailwheel}
                  onChange={(e) => setFormData({ ...formData, tailwheel: e.target.checked })}
                  className="rounded text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm">Spornrad</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.glass_panel}
                  onChange={(e) => setFormData({ ...formData, glass_panel: e.target.checked })}
                  className="rounded text-violet-600 focus:ring-violet-500"
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
                  Flugzeug löschen
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
                Abbrechen
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Speichern...' : 'Flugzeug speichern'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}