// store/itinerary-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ItineraryItem } from '@/types/itinerary'

interface ItineraryState {
  itemsByDay: Record<string, ItineraryItem[]>
  selectedDayId: string | null
  viewMode: 'daily' | 'timeline'
  isLoading: boolean
  error: string | null
}

interface ItineraryActions {
  setDayItems: (dayId: string, items: ItineraryItem[]) => void
  addItem: (item: ItineraryItem) => void
  updateItem: (id: string, data: Partial<ItineraryItem>) => void
  deleteItem: (id: string, dayId: string) => void
  moveItem: (id: string, fromDayId: string, toDayId: string, item: ItineraryItem) => void
  setSelectedDayId: (dayId: string | null) => void
  setViewMode: (mode: 'daily' | 'timeline') => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useItineraryStore = create<ItineraryState & ItineraryActions>()(
  devtools(
    (set, get) => ({
      itemsByDay: {},
      selectedDayId: null,
      viewMode: 'daily',
      isLoading: false,
      error: null,

      setDayItems: (dayId, items) =>
        set(state => ({
          itemsByDay: { ...state.itemsByDay, [dayId]: items }
        })),

      addItem: item =>
        set(state => {
          const list = state.itemsByDay[item.dayId || ''] || []
            return {
              itemsByDay: {
                ...state.itemsByDay,
                [item.dayId || '']: [...list, item]
              }
            }
        }),

      updateItem: (id, data) =>
        set(state => {
          const updated: Record<string, ItineraryItem[]> = {}
          for (const [d, arr] of Object.entries(state.itemsByDay)) {
            updated[d] = arr.map(it => (it.id === id ? { ...it, ...data } : it))
          }
          return { itemsByDay: updated }
        }),

      deleteItem: (id, dayId) =>
        set(state => ({
          itemsByDay: {
            ...state.itemsByDay,
            [dayId]: (state.itemsByDay[dayId] || []).filter(i => i.id !== id)
          }
        })),

      moveItem: (id, fromDayId, toDayId, item) =>
        set(state => {
          const from = (state.itemsByDay[fromDayId] || []).filter(i => i.id !== id)
          const to = [...(state.itemsByDay[toDayId] || []), item]
          return {
            itemsByDay: {
              ...state.itemsByDay,
              [fromDayId]: from,
              [toDayId]: to
            }
          }
        }),

      setSelectedDayId: dayId => set({ selectedDayId: dayId }),
      setViewMode: mode => set({ viewMode: mode }),
      setLoading: loading => set({ isLoading: loading }),
      setError: error => set({ error }),
      clearError: () => set({ error: null })
    }),
    { name: 'itinerary-store' }
  )
)