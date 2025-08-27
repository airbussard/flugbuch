'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { getAppUrl } from '@/lib/utils/app-url'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getAppUrl()}/reset-password`,
      })

      if (error) {
        setError(error.message || 'Ein Fehler ist aufgetreten.')
      } else {
        setSuccess(true)
      }
    } catch (error: any) {
      setError(error.message || 'Ein Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
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
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          Passwort zurücksetzen
        </h1>
        <p className="text-gray-600 mt-2">
          Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen.
        </p>
      </div>

      {!success ? (
        <form onSubmit={handleResetPassword} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-Mail-Adresse
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="pilot@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Sende...' : 'Link senden'}
          </button>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-lg">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">E-Mail gesendet!</h3>
            <p className="text-sm">
              Wir haben Ihnen einen Link zum Zurücksetzen Ihres Passworts an <strong>{email}</strong> gesendet.
            </p>
            <p className="text-xs mt-2 text-green-600">
              Bitte überprüfen Sie auch Ihren Spam-Ordner.
            </p>
          </div>

          <button
            onClick={() => {
              setSuccess(false)
              setEmail('')
            }}
            className="text-purple-600 hover:text-purple-500 text-sm font-medium"
          >
            Andere E-Mail-Adresse verwenden
          </button>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <Link 
          href="/login" 
          className="flex items-center justify-center text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zum Login
        </Link>
      </div>
    </div>
  )
}