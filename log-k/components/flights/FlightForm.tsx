'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, Calendar, Clock, Plane, Users } from 'lucide-react'
import DayNightSlider from './DayNightSlider'
import CrewSelector, { CrewAssignment } from './CrewSelector'
import AircraftSelector from './AircraftSelector'

const flightSchema = z.object({
  flight_date: z.string().min(1, 'Date is required'),
  departure_airport: z.string().min(3, 'Departure airport is required').max(4),
  arrival_airport: z.string().min(3, 'Arrival airport is required').max(4),
  off_block: z.string().min(1, 'Off Block time is required'),
  on_block: z.string().min(1, 'On Block time is required'),
  takeoff: z.string().optional(),
  landing: z.string().optional(),
  aircraft_id: z.string().nullable(),
  registration: z.string().min(1, 'Registration is required'),
  aircraft_type: z.string().min(1, 'Aircraft type is required'),
  flight_number: z.string().optional(),
  block_time: z.number().min(0).optional(),
  pic_time: z.number().min(0).optional(),
  sic_time: z.number().min(0).optional(),
  night_time: z.number().min(0).optional(),
  ifr_time: z.number().min(0).optional(),
  vfr_time: z.number().min(0).optional(),
  multi_pilot_time: z.number().min(0).optional(),
  cross_country_time: z.number().min(0).optional(),
  dual_given_time: z.number().min(0).optional(),
  dual_received_time: z.number().min(0).optional(),
  landings_day: z.number().min(0).optional(),
  landings_night: z.number().min(0).optional(),
  remarks: z.string().optional()
})

type FlightFormData = z.infer<typeof flightSchema>

interface FlightFormProps {
  onSubmit: (data: FlightFormData & { crew_assignments: CrewAssignment[] }) => void
  loading?: boolean
  defaultValues?: Partial<FlightFormData>
}

export default function FlightForm({ onSubmit, loading = false, defaultValues }: FlightFormProps) {
  const [blockTime, setBlockTime] = useState(0)
  const [flightTime, setFlightTime] = useState(0)
  const [dayMinutes, setDayMinutes] = useState(0)
  const [nightMinutes, setNightMinutes] = useState(0)
  const [crewAssignments, setCrewAssignments] = useState<CrewAssignment[]>([])
  const [selectedCondition, setSelectedCondition] = useState<'IFR' | 'VFR'>('VFR')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      ...defaultValues,
      landings_day: 1,
      landings_night: 0
    }
  })

  const offBlock = watch('off_block')
  const onBlock = watch('on_block')
  const takeoffTime = watch('takeoff')
  const landingTime = watch('landing')
  const departureAirport = watch('departure_airport')
  const arrivalAirport = watch('arrival_airport')

  // Calculate block time
  useEffect(() => {
    if (offBlock && onBlock) {
      const off = new Date(`2000-01-01T${offBlock}`)
      const on = new Date(`2000-01-01T${onBlock}`)
      let diff = (on.getTime() - off.getTime()) / 1000 / 60
      
      // Handle overnight flights
      if (diff < 0) {
        diff += 24 * 60
      }
      
      setBlockTime(Math.round(diff))
      
      // Initialize day time to full block time if not set
      if (dayMinutes === 0 && nightMinutes === 0) {
        setDayMinutes(Math.round(diff))
      }
    } else {
      setBlockTime(0)
    }
  }, [offBlock, onBlock])

  // Calculate flight time
  useEffect(() => {
    if (takeoffTime && landingTime) {
      const takeoff = new Date(`2000-01-01T${takeoffTime}`)
      const landing = new Date(`2000-01-01T${landingTime}`)
      let diff = (landing.getTime() - takeoff.getTime()) / 1000 / 60
      
      // Handle overnight flights
      if (diff < 0) {
        diff += 24 * 60
      }
      
      setFlightTime(Math.round(diff))
    } else {
      setFlightTime(0)
    }
  }, [takeoffTime, landingTime])

  // Update form values based on calculations
  useEffect(() => {
    // Set block_time in hours
    setValue('block_time', blockTime / 60)
    
    // Set night_time in hours
    setValue('night_time', nightMinutes / 60)
    
    // Calculate PIC/SIC time based on crew assignments
    const hasPIC = crewAssignments.some(a => a.role_name === 'PIC')
    const hasSIC = crewAssignments.some(a => a.role_name === 'SIC')
    
    if (hasPIC) {
      setValue('pic_time', blockTime / 60)
      setValue('sic_time', 0)
    } else if (hasSIC) {
      setValue('sic_time', blockTime / 60)
      setValue('pic_time', 0)
    }
    
    // Set multi-pilot time if more than one crew member
    if (crewAssignments.length > 1) {
      setValue('multi_pilot_time', blockTime / 60)
    } else {
      setValue('multi_pilot_time', 0)
    }
    
    // Set cross-country time if departure != arrival
    if (departureAirport && arrivalAirport && departureAirport !== arrivalAirport) {
      setValue('cross_country_time', blockTime / 60)
    } else {
      setValue('cross_country_time', 0)
    }
    
    // Set IFR/VFR time based on selected condition
    if (selectedCondition === 'IFR') {
      setValue('ifr_time', blockTime / 60)
      setValue('vfr_time', 0)
    } else {
      setValue('ifr_time', 0)
      setValue('vfr_time', blockTime / 60)
    }
  }, [blockTime, nightMinutes, crewAssignments, departureAirport, arrivalAirport, selectedCondition, setValue])

  const handleDayNightChange = (day: number, night: number) => {
    setDayMinutes(day)
    setNightMinutes(night)
  }

  const handleAircraftSelect = (aircraftId: string | null, registration: string, aircraftType: string) => {
    setValue('aircraft_id', aircraftId)
    setValue('registration', registration)
    setValue('aircraft_type', aircraftType)
  }

  const handleFormSubmit = (data: FlightFormData) => {
    onSubmit({
      ...data,
      crew_assignments: crewAssignments
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Date and Route Section */}
      <div className="space-y-4">
        <div className="flex items-center mb-2">
          <Calendar className="h-5 w-5 text-violet-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Date & Route</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="flight_date">Date *</Label>
            <Input
              id="flight_date"
              type="date"
              {...register('flight_date')}
              className={errors.flight_date ? 'border-red-500' : ''}
            />
            {errors.flight_date && <p className="text-red-500 text-sm mt-1">{errors.flight_date.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="departure_airport">Departure Airport (ICAO) *</Label>
            <Input
              id="departure_airport"
              placeholder="EDDF"
              {...register('departure_airport')}
              className={errors.departure_airport ? 'border-red-500' : ''}
              maxLength={4}
              style={{ textTransform: 'uppercase' }}
            />
            {errors.departure_airport && <p className="text-red-500 text-sm mt-1">{errors.departure_airport.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="arrival_airport">Arrival Airport (ICAO) *</Label>
            <Input
              id="arrival_airport"
              placeholder="EDDM"
              {...register('arrival_airport')}
              className={errors.arrival_airport ? 'border-red-500' : ''}
              maxLength={4}
              style={{ textTransform: 'uppercase' }}
            />
            {errors.arrival_airport && <p className="text-red-500 text-sm mt-1">{errors.arrival_airport.message}</p>}
          </div>
        </div>
      </div>

      {/* Times Section */}
      <div className="space-y-4">
        <div className="flex items-center mb-2">
          <Clock className="h-5 w-5 text-violet-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Times</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="off_block">Off Block *</Label>
            <Input
              id="off_block"
              type="time"
              {...register('off_block')}
              className={errors.off_block ? 'border-red-500' : ''}
            />
            {errors.off_block && <p className="text-red-500 text-sm mt-1">{errors.off_block.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="on_block">On Block *</Label>
            <Input
              id="on_block"
              type="time"
              {...register('on_block')}
              className={errors.on_block ? 'border-red-500' : ''}
            />
            {errors.on_block && <p className="text-red-500 text-sm mt-1">{errors.on_block.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="takeoff">Takeoff</Label>
            <Input
              id="takeoff"
              type="time"
              {...register('takeoff')}
            />
          </div>
          
          <div>
            <Label htmlFor="landing">Landing</Label>
            <Input
              id="landing"
              type="time"
              {...register('landing')}
            />
          </div>
        </div>

        {/* Block and Flight Time Display */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Block Time</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.floor(blockTime / 60)}:{(blockTime % 60).toString().padStart(2, '0')}
            </p>
          </div>
          {flightTime > 0 && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Flight Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.floor(flightTime / 60)}:{(flightTime % 60).toString().padStart(2, '0')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Day/Night Time Distribution */}
      <div className="space-y-4">
        <DayNightSlider
          totalMinutes={blockTime}
          dayMinutes={dayMinutes}
          nightMinutes={nightMinutes}
          onChange={handleDayNightChange}
        />
      </div>

      {/* Aircraft Section */}
      <div className="space-y-4">
        <div className="flex items-center mb-2">
          <Plane className="h-5 w-5 text-violet-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aircraft</h3>
        </div>
        
        <AircraftSelector
          value={watch('aircraft_id')}
          onChange={handleAircraftSelect}
        />
        
        <div>
          <Label htmlFor="flight_number">Flight Number</Label>
          <Input
            id="flight_number"
            placeholder="LH123"
            {...register('flight_number')}
          />
        </div>
      </div>

      {/* Crew Section */}
      <div className="space-y-4">
        <div className="flex items-center mb-2">
          <Users className="h-5 w-5 text-violet-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Crew</h3>
        </div>
        
        <CrewSelector
          assignments={crewAssignments}
          onChange={setCrewAssignments}
        />
      </div>

      {/* Flight Conditions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Flight Conditions</h3>
        
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="VFR"
              checked={selectedCondition === 'VFR'}
              onChange={() => setSelectedCondition('VFR')}
              className="mr-2"
            />
            VFR
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="IFR"
              checked={selectedCondition === 'IFR'}
              onChange={() => setSelectedCondition('IFR')}
              className="mr-2"
            />
            IFR
          </label>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          
          <div>
            <Label htmlFor="dual_given_time">Dual Given</Label>
            <Input
              id="dual_given_time"
              type="number"
              step="0.1"
              placeholder="Hours"
              {...register('dual_given_time', { valueAsNumber: true })}
            />
          </div>
          
          <div>
            <Label htmlFor="dual_received_time">Dual Received</Label>
            <Input
              id="dual_received_time"
              type="number"
              step="0.1"
              placeholder="Hours"
              {...register('dual_received_time', { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      {/* Remarks */}
      <div>
        <Label htmlFor="remarks">Remarks</Label>
        <textarea
          id="remarks"
          {...register('remarks')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-violet-500"
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