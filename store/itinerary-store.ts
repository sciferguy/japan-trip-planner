import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ItineraryItem } from '@/types'

interface ItineraryState {
  items: ItineraryItem[]
  selectedDay: number | null
  viewMode: 'daily' | 'timeline'
  isLoading: boolean
  error: string | null
}

interface ItineraryActions {
  setItems: (items: ItineraryItem[]) => void
  addItem: (item: ItineraryItem) => void
  updateItem: (id: string, data: Partial<ItineraryItem>) => void
  deleteItem: (id: string) => void
  reorderItems: (items: ItineraryItem[]) => void
  setSelectedDay: (day: number | null) => void
  setViewMode: (mode: 'daily' | 'timeline') => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useItineraryStore = create<ItineraryState & ItineraryActions>()(
  devtools(
    (set, get) => ({
      // State
      items: [],
      selectedDay: null,
      viewMode: 'daily',
      isLoading: false,
      error: null,

      // Actions
      setItems: (items) => set({ items }),
      addItem: (item) => {
        set((state) => ({
          items: [...state.items, item]
        }))
      },
      updateItem: (id, data) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, ...data } : item
          )
        }))
      },
      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },
      reorderItems: (items) => set({ items }),
      setSelectedDay: (day) => set({ selectedDay: day }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'itinerary-store'
    }
  )
)