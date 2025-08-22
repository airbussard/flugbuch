'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { User, Bell, Shield, Palette, Download, Globe, AtSign, Loader2, CheckCircle, AlertCircle, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { MAJOR_AIRPORTS } from '@/lib/data/major-airports'

interface SettingsFormProps {
  initialData: {
    firstName: string
    lastName: string
    email: string
    username: string
    licenseNumber: string
    complianceMode: string
    homebase: string
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
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<{
    available?: boolean
    error?: string
    suggestions?: string[]
  }>({})
  const [usernameDebounce, setUsernameDebounce] = useState<NodeJS.Timeout | null>(null)
  const [tempUsername, setTempUsername] = useState(initialData.username)
  const [showUsernameAlert, setShowUsernameAlert] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  // Check if we were redirected here because username is required
  useEffect(() => {
    if (searchParams.get('message') === 'username_required' && !initialData.username) {
      setShowUsernameAlert(true)
    }
  }, [searchParams, initialData.username])
  
  // Check username availability with debounce (only if user doesn't have one yet)
  useEffect(() => {
    // If user already has a username, don't check
    if (initialData.username) return
    
    if (tempUsername.length < 3) {
      setUsernameStatus({})
      return
    }
    
    // Don't check if it's the same as initial (shouldn't happen but just in case)
    if (tempUsername === initialData.username) {
      setUsernameStatus({ available: true })
      return
    }
    
    // Clear previous timeout
    if (usernameDebounce) {
      clearTimeout(usernameDebounce)
    }
    
    // Set new timeout
    const timeout = setTimeout(async () => {
      setCheckingUsername(true)
      try {
        const response = await fetch(`/api/users/check-username?username=${encodeURIComponent(tempUsername)}`)
        const data = await response.json()
        setUsernameStatus(data)
      } catch (error) {
        console.error('Error checking username:', error)
      } finally {
        setCheckingUsername(false)
      }
    }, 500) // 500ms debounce
    
    setUsernameDebounce(timeout)
    
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [tempUsername, initialData.username])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('')
    
    // Validate username if it's being set for the first time
    if (!initialData.username && tempUsername) {
      if (tempUsername.length < 3) {
        setSaveMessage('Username must be at least 3 characters long')
        setIsSaving(false)
        return
      }
      
      if (usernameStatus.available === false) {
        setSaveMessage('Username is not available. Please choose another one.')
        setIsSaving(false)
        return
      }
    }
    
    try {
      // Prepare update data
      const updateData: any = {
        id: userId, // Primary key is 'id', not 'user_id'
        first_name: settings.firstName,
        last_name: settings.lastName,
        email: settings.email,
        license_number: settings.licenseNumber,
        compliance_mode: settings.complianceMode,
        homebase: settings.homebase,
        updated_at: new Date().toISOString()
      }
      
      // Only add username if it's being set for the first time
      if (!initialData.username && tempUsername) {
        updateData.username = tempUsername.toLowerCase()
      }
      
      // Update user profile
      const { error } = await supabase
        .from('user_profiles')
        .upsert(updateData)
      
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
          saveMessage.includes('Error') || saveMessage.includes('not available')
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {saveMessage}
        </div>
      )}
      
      {/* Username Required Alert */}
      {showUsernameAlert && !initialData.username && (
        <div className="p-4 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <div>
              <p className="font-semibold">Username Required</p>
              <p className="text-sm mt-1">You must set a username before you can submit pilot reports (PIREPs). Please choose a unique username below.</p>
            </div>
          </div>
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
            <Label htmlFor="username">
              Username {!initialData.username && <span className="text-red-500">*</span>}
              {!initialData.username && (
                <span className="text-xs text-gray-500 ml-2">(Required for PIREPs)</span>
              )}
            </Label>
            {initialData.username ? (
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  value={initialData.username}
                  disabled
                  className="bg-gray-50 pl-10"
                />
                <p className="text-xs text-gray-500 mt-1">Username cannot be changed once set</p>
              </div>
            ) : (
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  minLength={3}
                  maxLength={30}
                  className={`pl-10 pr-10 ${
                    usernameStatus.available === false ? 'border-red-300' : 
                    usernameStatus.available === true ? 'border-green-300' : ''
                  }`}
                  placeholder="Choose a unique username"
                />
                {checkingUsername && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                )}
                {!checkingUsername && usernameStatus.available === true && tempUsername.length >= 3 && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {!checkingUsername && usernameStatus.available === false && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
                {tempUsername.length > 0 && tempUsername.length < 3 && (
                  <p className="text-xs text-red-600 mt-1">Username must be at least 3 characters</p>
                )}
                {usernameStatus.error && (
                  <p className="text-xs text-red-600 mt-1">{usernameStatus.error}</p>
                )}
                {usernameStatus.available === true && tempUsername.length >= 3 && (
                  <p className="text-xs text-green-600 mt-1">Username is available!</p>
                )}
                {usernameStatus.suggestions && usernameStatus.suggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600">Try one of these:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {usernameStatus.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setTempUsername(suggestion)}
                          className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
                        >
                          @{suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input
              id="licenseNumber"
              value={settings.licenseNumber}
              onChange={(e) => setSettings({ ...settings, licenseNumber: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="homebase">
              <MapPin className="inline-block h-3 w-3 mr-1" />
              Homebase Airport
            </Label>
            <Select
              id="homebase"
              value={settings.homebase}
              onChange={(e) => setSettings({ ...settings, homebase: e.target.value })}
              className="w-full"
            >
              <option value="">Select your homebase airport</option>
              <optgroup label="Europe">
                {MAJOR_AIRPORTS.filter(a => ['Germany', 'France', 'UK', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Poland', 'Denmark', 'Norway', 'Sweden', 'Finland', 'Czech Republic', 'Greece', 'Portugal', 'Ireland', 'Hungary', 'Romania'].includes(a.country))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(airport => (
                    <option key={airport.icao} value={airport.icao}>
                      {airport.icao} - {airport.name}, {airport.city}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="North America">
                {MAJOR_AIRPORTS.filter(a => ['USA', 'Canada'].includes(a.country))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(airport => (
                    <option key={airport.icao} value={airport.icao}>
                      {airport.icao} - {airport.name}, {airport.city}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Asia">
                {MAJOR_AIRPORTS.filter(a => ['Japan', 'China', 'India', 'South Korea', 'Thailand', 'Singapore', 'Malaysia', 'Indonesia', 'Hong Kong'].includes(a.country))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(airport => (
                    <option key={airport.icao} value={airport.icao}>
                      {airport.icao} - {airport.name}, {airport.city}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Middle East">
                {MAJOR_AIRPORTS.filter(a => ['UAE', 'Saudi Arabia', 'Qatar', 'Israel', 'Jordan', 'Turkey'].includes(a.country))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(airport => (
                    <option key={airport.icao} value={airport.icao}>
                      {airport.icao} - {airport.name}, {airport.city}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Oceania">
                {MAJOR_AIRPORTS.filter(a => ['Australia', 'New Zealand'].includes(a.country))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(airport => (
                    <option key={airport.icao} value={airport.icao}>
                      {airport.icao} - {airport.name}, {airport.city}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="South America">
                {MAJOR_AIRPORTS.filter(a => ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru'].includes(a.country))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(airport => (
                    <option key={airport.icao} value={airport.icao}>
                      {airport.icao} - {airport.name}, {airport.city}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Africa">
                {MAJOR_AIRPORTS.filter(a => ['South Africa', 'Egypt', 'Morocco', 'Ethiopia', 'Kenya'].includes(a.country))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(airport => (
                    <option key={airport.icao} value={airport.icao}>
                      {airport.icao} - {airport.name}, {airport.city}
                    </option>
                  ))}
              </optgroup>
            </Select>
            <p className="text-xs text-gray-500 mt-1">This will be used to center the weather map on your dashboard</p>
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
          
          {/* Dark Mode temporarily hidden
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
          */}
          
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