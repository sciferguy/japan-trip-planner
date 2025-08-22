import { useEffect, useRef } from 'react'
import { useTripStore } from '@/store/trip-store'

export function useCurrentTrip() {
  const { currentTrip, trips, isLoading, setCurrentTrip, setTrips, setLoading } = useTripStore()
  const hasInitialized = useRef(false)

  useEffect(() => {
    const initializeTrip = async () => {
      if (hasInitialized.current) return
      hasInitialized.current = true

      setLoading(true)

      try {
        // Fetch user's trips
        const response = await fetch('/api/trips')
        const data = await response.json()

        if (data.ok && data.data.length > 0) {
          setTrips(data.data)

          // If no current trip, set the first one
          if (!currentTrip) {
            const storedTripId = localStorage.getItem('currentTripId')
            const trip = storedTripId
              ? data.data.find((t: any) => t.id === storedTripId)
              : data.data[0]

            if (trip) {
              setCurrentTrip(trip)
              localStorage.setItem('currentTripId', trip.id)
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch trips:', error)
      } finally {
        setLoading(false)
      }
    }

    // Only run once when the hook mounts
    if (!hasInitialized.current) {
      initializeTrip()
    }
  }, []) // Empty dependency array

  const switchTrip = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId)
    if (trip) {
      setCurrentTrip(trip)
      localStorage.setItem('currentTripId', tripId)
    }
  }

  return {
    tripId: currentTrip?.id || null,
    currentTrip,
    trips,
    loading: isLoading,
    switchTrip
  }
}