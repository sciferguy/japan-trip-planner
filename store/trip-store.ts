import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { trips } from '@prisma/client'

interface TripState {
  currentTrip: trips | null
  trips: trips[]
  isLoading: boolean
  error: string | null
}

interface TripActions {
  setCurrentTrip: (trip: trips | null) => void
  setTrips: (trips: trips[]) => void
  addTrip: (trip: trips) => void
  updateTrip: (id: string, data: Partial<trips>) => void
  deleteTrip: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useTripStore = create<TripState & TripActions>()(
    devtools(
        (set) => ({
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