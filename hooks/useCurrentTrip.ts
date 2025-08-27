// hooks/useCurrentTrip.ts
import { useEffect, useRef, useCallback } from 'react'
import { useTripStore } from '@/store/trip-store'
import type { TripWithRelations } from '@/types/trip'

// Define explicit return type
interface UseCurrentTripReturn {
  tripId: string | null
  trips: any[]
  currentTrip: TripWithRelations | null
  switchTrip: (tripId: string) => void
  loading: boolean
}

export const useCurrentTrip = (): UseCurrentTripReturn => {
  const {
    trips,
    currentTrip,
    setTrips,
    setCurrentTrip,
    isLoading: loading,
    setLoading
  } = useTripStore()
  
  const hasInitialized = useRef(false)
  
  const switchTrip = useCallback((tripId: string) => {
    const trip = trips.find(t => t.id === tripId)
    if (trip) {
      console.log('[useCurrentTrip] Switching to trip:', trip.title)
      setCurrentTrip(trip)
      localStorage.setItem('currentTripId', tripId)
    }
  }, [trips, setCurrentTrip])
  
  useEffect(() => {
    const initializeTrip = async () => {
      if (hasInitialized.current) return
      hasInitialized.current = true
      
      setLoading(true)
      
      try {
        const response = await fetch('/api/trips')
        const data = await response.json()
        
        if (data.ok && data.data.length > 0) {
          setTrips(data.data)
          
          const storedTripId = localStorage.getItem('currentTripId')
          let selectedTrip = null
          
          if (storedTripId) {
            selectedTrip = data.data.find((t: any) => t.id === storedTripId)
          }
          
          if (!selectedTrip) {
            selectedTrip = data.data[0]
          }
          
          if (selectedTrip) {
            setCurrentTrip(selectedTrip)
            localStorage.setItem('currentTripId', selectedTrip.id)
          }
        }
      } catch (error) {
        console.error('Failed to fetch trips:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (!hasInitialized.current) {
      initializeTrip()
    }
  }, [setTrips, setCurrentTrip, setLoading])
  
  return {
    tripId: currentTrip?.id || null,  // ADD THIS LINE
    trips,
    currentTrip,
    switchTrip,
    loading
  }
}