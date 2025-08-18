'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

const flightSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  departure_airport: z.string().min(3, 'Departure airport is required').max(4),
  arrival_airport: z.string().min(3, 'Arrival airport is required').max(4),
  departure_time: z.string().optional(),
  arrival_time: z.string().optional(),
  aircraft_registration: z.string().min(1, 'Aircraft registration is required'),
  aircraft_type: z.string().optional(),
  pic_name: z.string().optional(),
  flight_time: z.number().min(0).optional(),
  block_time: z.number().min(0).optional(),
  night_time: z.number().min(0).optional(),
  ifr_time: z.number().min(0).optional(),
  vfr_time: z.number().min(0).optional(),
  landings_day: z.number().min(0).optional(),
  landings_night: z.number().min(0).optional(),
  remarks: z.string().optional()
})

type FlightFormData = z.infer<typeof flightSchema>

interface FlightFormProps {
  onSubmit: (data: FlightFormData) => void
  loading?: boolean
  defaultValues?: Partial<FlightFormData>
}

export default function FlightForm({ onSubmit, loading = false, defaultValues }: FlightFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
    defaultValues
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Date and Route */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            {...register('date')}
            className={errors.date ? 'border-red-500' : ''}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="departure_airport">Departure Airport *</Label>
          <Input
            id="departure_airport"
            placeholder="ICAO"
            {...register('departure_airport')}
            className={errors.departure_airport ? 'border-red-500' : ''}
            maxLength={4}
            style={{ textTransform: 'uppercase' }}
          />
          {errors.departure_airport && <p className="text-red-500 text-sm mt-1">{errors.departure_airport.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="arrival_airport">Arrival Airport *</Label>
          <Input
            id="arrival_airport"
            placeholder="ICAO"
            {...register('arrival_airport')}
            className={errors.arrival_airport ? 'border-red-500' : ''}
            maxLength={4}
            style={{ textTransform: 'uppercase' }}
          />
          {errors.arrival_airport && <p className="text-red-500 text-sm mt-1">{errors.arrival_airport.message}</p>}
        </div>
      </div>

      {/* Times */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="departure_time">Departure Time</Label>
          <Input
            id="departure_time"
            type="time"
            {...register('departure_time')}
          />
        </div>
        
        <div>
          <Label htmlFor="arrival_time">Arrival Time</Label>
          <Input
            id="arrival_time"
            type="time"
            {...register('arrival_time')}
          />
        </div>
        
        <div>
          <Label htmlFor="flight_time">Flight Time</Label>
          <Input
            id="flight_time"
            type="number"
            step="0.1"
            placeholder="Hours"
            {...register('flight_time', { valueAsNumber: true })}
          />
        </div>
        
        <div>
          <Label htmlFor="block_time">Block Time</Label>
          <Input
            id="block_time"
            type="number"
            step="0.1"
            placeholder="Hours"
            {...register('block_time', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Aircraft */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="aircraft_registration">Aircraft Registration *</Label>
          <Input
            id="aircraft_registration"
            placeholder="D-ABCD"
            {...register('aircraft_registration')}
            className={errors.aircraft_registration ? 'border-red-500' : ''}
            style={{ textTransform: 'uppercase' }}
          />
          {errors.aircraft_registration && <p className="text-red-500 text-sm mt-1">{errors.aircraft_registration.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="aircraft_type">Aircraft Type</Label>
          <Input
            id="aircraft_type"
            placeholder="C172"
            {...register('aircraft_type')}
          />
        </div>
        
        <div>
          <Label htmlFor="pic_name">PIC Name</Label>
          <Input
            id="pic_name"
            placeholder="Self or name"
            {...register('pic_name')}
          />
        </div>
      </div>

      {/* Flight Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="night_time">Night Time</Label>
          <Input
            id="night_time"
            type="number"
            step="0.1"
            placeholder="Hours"
            {...register('night_time', { valueAsNumber: true })}
          />
        </div>
        
        <div>
          <Label htmlFor="ifr_time">IFR Time</Label>
          <Input
            id="ifr_time"
            type="number"
            step="0.1"
            placeholder="Hours"
            {...register('ifr_time', { valueAsNumber: true })}
          />
        </div>
        
        <div>
          <Label htmlFor="landings_day">Day Landings</Label>
          <Input
            id="landings_day"
            type="number"
            min="0"
            {...register('landings_day', { valueAsNumber: true })}
          />
        </div>
        
        <div>
          <Label htmlFor="landings_night">Night Landings</Label>
          <Input
            id="landings_night"
            type="number"
            min="0"
            {...register('landings_night', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Remarks */}
      <div>
        <Label htmlFor="remarks">Remarks</Label>
        <textarea
          id="remarks"
          {...register('remarks')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
          placeholder="Additional notes..."
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Saving...' : 'Save Flight'}
        </Button>
      </div>
    </form>
  )
}