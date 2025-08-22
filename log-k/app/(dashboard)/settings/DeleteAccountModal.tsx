'use client'

import { useState } from 'react'
import { AlertTriangle, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  hasActiveSubscription: boolean
  subscriptionSource?: string | null
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  userId,
  hasActiveSubscription,
  subscriptionSource
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  if (!isOpen) return null

  const handleDelete = async () => {
    // Validate inputs
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }

    if (!password) {
      setError('Please enter your password')
      return
    }

    setIsDeleting(true)
    setError('')

    try {
      // Verify password by attempting to sign in
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || '',
        password
      })

      if (authError) {
        setError('Incorrect password')
        setIsDeleting(false)
        return
      }

      // Call delete account API
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, password })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete account')
      }

      // Sign out and redirect
      await supabase.auth.signOut()
      router.push('/login?message=account_deleted')
    } catch (err) {
      console.error('Error deleting account:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete account')
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Delete Account</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Warning Messages */}
        <div className="space-y-4 mb-6">
          {hasActiveSubscription && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Active Subscription Detected!</strong>
                {subscriptionSource === 'apple' && (
                  <> You have an active iOS subscription. Please cancel it in the App Store first to avoid continued charges.</>
                )}
                {subscriptionSource === 'stripe' && (
                  <> Your web subscription will be automatically cancelled when you delete your account.</>
                )}
                {subscriptionSource === 'trial' && (
                  <> Your trial will end when you delete your account.</>
                )}
              </p>
            </div>
          )}

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-semibold mb-2">
              This action is permanent and cannot be undone!
            </p>
            <p className="text-sm text-red-700">
              Deleting your account will permanently remove:
            </p>
            <ul className="text-sm text-red-700 mt-2 space-y-1">
              <li>• All your flight records</li>
              <li>• All aircraft data</li>
              <li>• All crew member information</li>
              <li>• Your user profile and settings</li>
              <li>• All synced data across devices</li>
            </ul>
          </div>
        </div>

        {/* Confirmation Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter your password to continue
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Your password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="font-bold">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Type DELETE"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || confirmText !== 'DELETE' || !password}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Account'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}