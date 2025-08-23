'use client'

export default function IOSSyncButton() {
  const handleSync = () => {
    window.location.href = '/api/subscription/sync-ios'
  }

  return (
    <button
      className="text-blue-600 hover:text-blue-800 font-medium underline"
      onClick={handleSync}
    >
      Sync iOS Subscription
    </button>
  )
}