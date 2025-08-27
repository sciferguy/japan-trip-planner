import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { trips } from '@prisma/client'
import type { TripWithRelations } from '@/types/trip'

interface TripState {
  currentTrip: TripWithRelations | null  // Changed from trips to TripWithRelations
  trips: trips[]
  isLoading: boolean
  error: string | null
}

interface TripActions {
  setCurrentTrip: (trip: TripWithRelations | null) => void
  setTrips: (trips: trips[]) => void
  addTrip: (trip: trips) => void
  updateTrip: (id: string, data: Partial<TripWithRelations>) => void
  deleteTrip: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  getTripById: (id: string) => trips | undefined
  resetState: () => void
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
      clearError: () => set({ error: null }),
      
      getTripById: (id) => {
        const state = get()
        return state.trips.find(trip => trip.id === id)
      },
      
      resetState: () => set({
        currentTrip: null,
        trips: [],
        isLoading: false,
        error: null
      })
    }),
    {
      name: 'trip-store'
    }
  )
)