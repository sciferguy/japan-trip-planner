// components/trips/TripSelector.tsx
'use client'

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCurrentTrip } from '@/hooks/useCurrentTrip'
import { Calendar } from 'lucide-react'

export function TripSelector() {
  const { currentTrip, trips, loading, switchTrip } = useCurrentTrip()

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded h-10 w-48" />
    )
  }

  if (trips.length === 0) {
    return (
      <div className="text-sm text-gray-500 px-3 py-2">
        No trips found
      </div>
    )
  }

  const formatTripLabel = (trip: any) => {
    if (!trip.title && !trip.start_date) return 'Untitled Trip'
    if (!trip.title) return `Trip ${new Date(trip.start_date).getFullYear()}`
    return trip.title
  }

  return (
    <Select
      value={currentTrip?.id || ''}
      onValueChange={switchTrip}
    >
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a trip...">
          {currentTrip && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="truncate">{formatTripLabel(currentTrip)}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {trips.map((trip) => (
          <SelectItem key={trip.id} value={trip.id}>
            <div className="flex items-center gap-2 w-full">
              <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-medium truncate">
                  {formatTripLabel(trip)}
                </span>
                {trip.start_date && trip.end_date && (
                  <span className="text-xs text-gray-500">
                    {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}