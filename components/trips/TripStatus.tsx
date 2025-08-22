// components/trips/TripStatus.tsx
'use client'

import React from 'react'
import { useCurrentTrip } from '@/hooks/useCurrentTrip'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin } from 'lucide-react'

export function TripStatus() {
  const { currentTrip, loading } = useCurrentTrip()

  if (loading) {
    return <div className="animate-pulse bg-gray-200 rounded h-6 w-32" />
  }

  if (!currentTrip) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        No trip selected
      </Badge>
    )
  }

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Badge variant="outline" className="flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        {currentTrip.title || 'Current Trip'}
      </Badge>
      {currentTrip.start_date && currentTrip.end_date && (
        <span className="text-xs text-gray-600">
          {formatDate(currentTrip.start_date)} - {formatDate(currentTrip.end_date)}
        </span>
      )}
    </div>
  )
}