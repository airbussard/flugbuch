'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, User, AlertCircle, CheckCircle, AtSign, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<{
    available?: boolean
    error?: string
    suggestions?: string[]
  }>({})
  const [usernameDebounce, setUsernameDebounce] = useState<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const supabase = createClient()
  
  // Check username availability with debounce
  useEffect(() => {
    if (formData.username.length < 3) {
      setUsernameStatus({})
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
        const response = await fetch(`/api/users/check-username?username=${encodeURIComponent(formData.username)}`)
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
  }, [formData.username])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    
    // Validate username
    if (!formData.username || formData.username.length < 3) {
      setError('Username must be at least 3 characters long')
      setLoading(false)
      return
    }
    
    if (usernameStatus.available === false) {
      setError('Username is not available. Please choose another one.')
      setLoading(false)
      return
    }

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      })

      if (authError) {
        // Spezifische Fehlerbehandlung für verschiedene Fehlertypen
        if (authError.message.includes('already registered') || 
            authError.message.includes('already exists')) {
          setError('Diese E-Mail-Adresse ist bereits registriert. Bitte melden Sie sich an.')
        } else if (authError.message.includes('weak') || 
                   authError.message.includes('at least 6 characters')) {
          setError('Das Passwort muss mindestens 6 Zeichen lang sein.')
        } else if (authError.message.includes('invalid')) {
          setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.')
        } else {
          setError(authError.message || 'Ein Fehler ist bei der Registrierung aufgetreten.')
        }
        setLoading(false)
        return
      }

      // Create user profile with username
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: authData.user.id, // Using 'id' as primary key, not 'user_id'
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              username: formData.username.toLowerCase(), // Store in lowercase for consistency
              compliance_mode: 'EASA',
            }
          ])

        if (profileError) console.error('Profile creation error:', profileError)
      }

      setSuccess(true)
      // Kurze Verzögerung für Session-Etablierung
      setTimeout(() => {
        router.refresh()
        router.push('/dashboard')
      }, 1500)
    } catch (error: any) {
      setError(error.message || 'Ein Fehler ist bei der Registrierung aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4">
          <Image 
            src="/logo.png" 
            alt="Log-K Logo" 
            width={80} 
            height={80}
            className="rounded-lg"
          />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Create Account</h1>
        <p className="text-gray-600 mt-2">Start your 4-week free trial</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">Registrierung erfolgreich! Sie werden weitergeleitet...</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="John"
              />
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Doe"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="pilot@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username <span className="text-xs text-gray-500">(for PIREPs and public display)</span>
          </label>
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
              required
              minLength={3}
              maxLength={30}
              className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                usernameStatus.available === false ? 'border-red-300' : 
                usernameStatus.available === true ? 'border-green-300' : 'border-gray-300'
              }`}
              placeholder="pilot123"
            />
            {checkingUsername && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
            )}
            {!checkingUsername && usernameStatus.available === true && formData.username.length >= 3 && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
            {!checkingUsername && usernameStatus.available === false && (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
            )}
          </div>
          {formData.username.length > 0 && formData.username.length < 3 && (
            <p className="text-xs text-red-600 mt-1">Username must be at least 3 characters</p>
          )}
          {usernameStatus.error && (
            <p className="text-xs text-red-600 mt-1">{usernameStatus.error}</p>
          )}
          {usernameStatus.available === true && formData.username.length >= 3 && (
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
                    onClick={() => setFormData({ ...formData, username: suggestion })}
                    className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
                  >
                    @{suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              minLength={6}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            required
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label className="ml-2 text-sm text-gray-600">
            I agree to the{' '}
            <Link href="/terms" className="text-purple-600 hover:text-purple-500">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-purple-600 hover:text-purple-500">
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-600 hover:text-purple-500 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}