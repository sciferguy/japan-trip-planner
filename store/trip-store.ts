import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Trip } from '@/types'

interface TripState {
  currentTrip: Trip | null
  trips: Trip[]
  isLoading: boolean
  error: string | null
}

interface TripActions {
  setCurrentTrip: (trip: Trip | null) => void
  setTrips: (trips: Trip[]) => void
  addTrip: (trip: Trip) => void
  updateTrip: (id: string, data: Partial<Trip>) => void
  deleteTrip: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useTripStore = create<TripState & TripActions>()(
  devtools(
    (set, get) => ({
      // State
      currentTrip: null,
      trips: [],
      isLoading: false,
      error: null,

      // Actions
      setCurrentTrip: (trip) => set({ currentTrip: trip }),
      setTrips: (trips) => set({ trips }),
      addTrip: (trip) => {
        set((state) => ({
          trips: [...state.trips, trip]
        }))
      },
      updateTrip: (id, data) => {
        set((state) => ({
          trips: state.trips.map(trip => 
            trip.id === id ? { ...trip, ...data } : trip
          ),
          currentTrip: state.currentTrip?.id === id 
            ? { ...state.currentTrip, ...data }
            : state.currentTrip
        }))
      },
      deleteTrip: (id) => {
        set((state) => ({
          trips: state.trips.filter(trip => trip.id !== id),
          currentTrip: state.currentTrip?.id === id ? null : state.currentTrip
        }))
      },
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'trip-store'
    }
  )
)