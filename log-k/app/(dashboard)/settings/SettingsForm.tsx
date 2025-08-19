'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { User, Bell, Shield, Palette, Download, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface SettingsFormProps {
  initialData: {
    firstName: string
    lastName: string
    email: string
    licenseNumber: string
    complianceMode: string
    notifications: boolean
    darkMode: boolean
    language: string
    isAdmin: boolean
  }
  userId: string
}

export default function SettingsForm({ initialData, userId }: SettingsFormProps) {
  const [settings, setSettings] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      // Update user profile
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          first_name: settings.firstName,
          last_name: settings.lastName,
          license_number: settings.licenseNumber,
          compliance_mode: settings.complianceMode,
          email_notifications: settings.notifications,
          dark_mode: settings.darkMode,
          language: settings.language,
          updated_at: new Date().toISOString()
        })
      
      if (error) throw error
      
      setSaveMessage('Settings saved successfully!')
      router.refresh()
      
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveMessage('Error saving settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const exportCSV = async () => {
    try {
      const { data: flights } = await supabase
        .from('flights')
        .select('*')
        .eq('user_id', userId)
        .eq('deleted', false)
        .order('flight_date', { ascending: false })
      
      if (!flights || flights.length === 0) {
        alert('No flights to export')
        return
      }
      
      // Convert to CSV
      const headers = Object.keys(flights[0]).join(',')
      const rows = flights.map(flight => 
        Object.values(flight).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        ).join(',')
      )
      const csv = [headers, ...rows].join('\n')
      
      // Download
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `flights_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting flights:', error)
      alert('Error exporting flights')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg ${
          saveMessage.includes('Error') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {saveMessage}
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <User className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={settings.firstName}
              onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={settings.lastName}
              onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              disabled
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input
              id="licenseNumber"
              value={settings.licenseNumber}
              onChange={(e) => setSettings({ ...settings, licenseNumber: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Compliance Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <Shield className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Compliance</h2>
        </div>
        
        <div>
          <Label htmlFor="complianceMode">Regulatory Mode</Label>
          <Select
            id="complianceMode"
            value={settings.complianceMode}
            onChange={(e) => setSettings({ ...settings, complianceMode: e.target.value })}
            className="w-full"
          >
            <option value="EASA">EASA</option>
            <option value="FAA">FAA</option>
            <option value="BOTH">Both EASA & FAA</option>
          </Select>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <Palette className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive updates about your flights</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark Mode</Label>
              <p className="text-sm text-gray-600">Use dark theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div>
            <Label htmlFor="language">Language</Label>
            <Select
              id="language"
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full"
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <Download className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Data Export</h2>
        </div>
        
        <div className="space-y-4">
          <Button variant="outline" className="w-full" onClick={exportCSV}>
            Export Flight Data (CSV)
          </Button>
          <Button variant="outline" className="w-full" disabled>
            Export Logbook (PDF) - Coming Soon
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          size="lg" 
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}