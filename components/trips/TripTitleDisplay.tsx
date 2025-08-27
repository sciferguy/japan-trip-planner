'use client'

import { useTripStore } from '@/store/trip-store'
import { useEffect } from 'react'

interface TripTitleDisplayProps {
  className?: string
}

export function TripTitleDisplay({ className = '' }: TripTitleDisplayProps) {
  const { currentTrip, getTripById } = useTripStore()
  
  useEffect(() => {
    // Ensure trip data is fresh when currentTrip changes
    if (currentTrip?.id) {
      const storedTrip = getTripById(currentTrip.id)
      if (storedTrip && storedTrip.title !== currentTrip.title) {
        // If there's a mismatch, trigger a refresh
        const refreshTrip = async () => {
          try {
            const response = await fetch(`/api/trips/${currentTrip.id}`)
            const data = await response.json()
            if (data.ok) {
              useTripStore.getState().updateTrip(currentTrip.id, data.data)
            }
          } catch (error) {
            console.error('Failed to refresh trip data:', error)
          }
        }
        refreshTrip()
      }
    }
  }, [currentTrip?.id])

  if (!currentTrip) {
    return null
  }

  return (
    <h1 className={className}>
      {currentTrip.title}
    </h1>
  )
}