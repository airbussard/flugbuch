'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import FlightForm from '@/components/flights/FlightForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewFlightPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (data: any) => {
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('flights')
      .insert([{
        ...data,
        user_id: user?.id,
        deleted: false
      }])

    if (!error) {
      router.push('/flights')
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/flights" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Flights
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Flight</h1>
        <FlightForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}