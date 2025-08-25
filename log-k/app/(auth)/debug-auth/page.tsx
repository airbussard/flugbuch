'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DebugAuthPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [testData, setTestData] = useState({
    email: `test${Date.now()}@example.com`,
    password: 'testpass123',
    firstName: 'Test',
    lastName: 'User',
    username: `testuser${Date.now()}`
  })

  const enableDebugMode = () => {
    localStorage.setItem('debug_auth', 'true')
    alert('Debug mode enabled! Check browser console for detailed logs.')
  }

  const disableDebugMode = () => {
    localStorage.removeItem('debug_auth')
    alert('Debug mode disabled.')
  }

  const testRegistration = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/debug-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      const data = await response.json()
      setResults(data)
    } catch (error: any) {
      setResults({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const checkAuthStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/debug-register')
      const data = await response.json()
      setResults(data)
    } catch (error: any) {
      setResults({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testDirectSignup = async () => {
    setLoading(true)
    const supabase = createClient()
    
    try {
      // Test direct signup
      const { data, error } = await supabase.auth.signUp({
        email: testData.email,
        password: testData.password,
        options: {
          data: {
            first_name: testData.firstName,
            last_name: testData.lastName,
          }
        }
      })

      if (error) {
        setResults({ 
          step: 'Direct signup failed',
          error: error.message,
          details: error 
        })
      } else {
        // Try to create profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            id: data.user!.id,
            first_name: testData.firstName,
            last_name: testData.lastName,
            email: testData.email,
            username: testData.username.toLowerCase(),
            compliance_mode: 'EASA',
          }])

        setResults({
          step: 'Direct signup test',
          signupSuccess: !!data.user,
          userId: data.user?.id,
          profileError: profileError?.message,
          profileErrorDetails: profileError
        })
      }
    } catch (error: any) {
      setResults({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testEnsureProfile = async () => {
    setLoading(true)
    const supabase = createClient()
    
    try {
      // Call the ensure_user_profile function
      const { data, error } = await supabase.rpc('ensure_user_profile')
      
      setResults({
        step: 'Ensure profile function',
        success: !error,
        error: error?.message,
        data
      })
    } catch (error: any) {
      setResults({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Auth Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Debug Mode</h2>
          <div className="flex gap-4">
            <button
              onClick={enableDebugMode}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Enable Debug Mode
            </button>
            <button
              onClick={disableDebugMode}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Disable Debug Mode
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Debug mode will show detailed logs in the browser console
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Data</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email"
              value={testData.email}
              onChange={(e) => setTestData({...testData, email: e.target.value})}
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Username"
              value={testData.username}
              onChange={(e) => setTestData({...testData, username: e.target.value})}
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="First Name"
              value={testData.firstName}
              onChange={(e) => setTestData({...testData, firstName: e.target.value})}
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={testData.lastName}
              onChange={(e) => setTestData({...testData, lastName: e.target.value})}
              className="px-3 py-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={testData.password}
              onChange={(e) => setTestData({...testData, password: e.target.value})}
              className="px-3 py-2 border rounded"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={checkAuthStatus}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Check Auth Status
            </button>
            <button
              onClick={testRegistration}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Test Debug Registration API
            </button>
            <button
              onClick={testDirectSignup}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Test Direct Signup
            </button>
            <button
              onClick={testEnsureProfile}
              disabled={loading}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
            >
              Test Ensure Profile Function
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">Loading...</p>
          </div>
        )}

        {results && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}