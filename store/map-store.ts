import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { MapPin, MapViewport } from '@/types'

interface MapState {
  viewport: MapViewport
  pins: MapPin[]
  selectedPin: MapPin | null
  isLoading: boolean
  error: string | null
}

interface MapActions {
  setViewport: (viewport: MapViewport) => void
  setPins: (pins: MapPin[]) => void
  addPin: (pin: MapPin) => void
  updatePin: (id: string, data: Partial<MapPin>) => void
  deletePin: (id: string) => void
  selectPin: (pin: MapPin | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

// Default viewport centered on Japan
const defaultViewport: MapViewport = {
  latitude: 36.2048,
  longitude: 138.2529,
  zoom: 6
}

export const useMapStore = create<MapState & MapActions>()(
  devtools(
    (set, get) => ({
      // State
      viewport: defaultViewport,
      pins: [],
      selectedPin: null,
      isLoading: false,
      error: null,

      // Actions
      setViewport: (viewport) => set({ viewport }),
      setPins: (pins) => set({ pins }),
      addPin: (pin) => {
        set((state) => ({
          pins: [...state.pins, pin]
        }))
      },
      updatePin: (id, data) => {
        set((state) => ({
          pins: state.pins.map(pin =>
            pin.id === id ? { ...pin, ...data } : pin
          ),
          selectedPin: state.selectedPin?.id === id
            ? { ...state.selectedPin, ...data }
            : state.selectedPin
        }))
      },
      deletePin: (id) => {
        set((state) => ({
          pins: state.pins.filter(pin => pin.id !== id),
          selectedPin: state.selectedPin?.id === id ? null : state.selectedPin
        }))
      },
      selectPin: (pin) => set({ selectedPin: pin }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'map-store'
    }
  )
)