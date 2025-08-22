// store/itinerary-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ItineraryItem } from '@/types/itinerary'

interface OptimisticOperation {
  type: 'create' | 'update' | 'delete' | 'move'
  previousState: {
    dayId: string
    items?: ItineraryItem[]
    item?: ItineraryItem
    index?: number
    fromDayId?: string
    toDayId?: string
    fromIndex?: number
  }
  timestamp: number
}

interface ItineraryState {
  itemsByDay: Record<string, ItineraryItem[]>
  selectedDayId: string | null
  viewMode: 'daily' | 'timeline'
  isLoading: boolean
  error: string | null
  optimisticOperations: Map<string, OptimisticOperation>
}

interface ItineraryActions {
  setDayItems: (dayId: string, items: ItineraryItem[]) => void
  setSelectedDayId: (dayId: string | null) => void
  setViewMode: (mode: 'daily' | 'timeline') => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  optimisticCreateItem: (tempId: string, dayId: string, item: Partial<ItineraryItem>) => void
  optimisticUpdateItem: (id: string, dayId: string, updates: Partial<ItineraryItem>) => void
  optimisticDeleteItem: (id: string, dayId: string) => void
  optimisticMoveItem: (id: string, fromDayId: string, toDayId: string, updates: Partial<ItineraryItem>) => void
  confirmOptimisticOperation: (operationId: string, serverData?: { dayId: string; items: ItineraryItem[] }) => void
  rollbackOptimisticOperation: (operationId: string) => void
  rollbackAllOptimistic: () => void
}

// Helper function to handle rollback logic
const rollbackOperation = (
  updatedItemsByDay: Record<string, ItineraryItem[]>,
  operation: OptimisticOperation
) => {
  switch (operation.type) {
    case 'create':
      if (operation.previousState.items) {
        updatedItemsByDay[operation.previousState.dayId] = operation.previousState.items
      }
      break

    case 'update':
      if (operation.previousState.item && typeof operation.previousState.index === 'number') {
        const items = [...(updatedItemsByDay[operation.previousState.dayId] || [])]
        items[operation.previousState.index] = operation.previousState.item
        updatedItemsByDay[operation.previousState.dayId] = items
      }
      break

    case 'delete':
      if (operation.previousState.item && typeof operation.previousState.index === 'number') {
        const restoreItems = [...(updatedItemsByDay[operation.previousState.dayId] || [])]
        restoreItems.splice(operation.previousState.index, 0, operation.previousState.item)
        updatedItemsByDay[operation.previousState.dayId] = restoreItems
      }
      break

    case 'move':
      if (operation.previousState.item && operation.previousState.fromDayId && operation.previousState.toDayId && typeof operation.previousState.fromIndex === 'number') {
        const fromItems = [...(updatedItemsByDay[operation.previousState.fromDayId] || [])]
        const toItems = (updatedItemsByDay[operation.previousState.toDayId] || []).filter(
          item => item.id !== operation.previousState.item!.id
        )
        fromItems.splice(operation.previousState.fromIndex, 0, operation.previousState.item)
        updatedItemsByDay[operation.previousState.fromDayId] = fromItems
        updatedItemsByDay[operation.previousState.toDayId] = toItems
      }
      break
  }
}

export const useItineraryStore = create<ItineraryState & ItineraryActions>()(
  devtools(
    (set) => ({
      itemsByDay: {},
      selectedDayId: null,
      viewMode: 'daily',
      isLoading: false,
      error: null,
      optimisticOperations: new Map(),

      setDayItems: (dayId, items) =>
        set(state => ({
          itemsByDay: { ...state.itemsByDay, [dayId]: items }
        })),

      setSelectedDayId: dayId => set({ selectedDayId: dayId }),
      setViewMode: mode => set({ viewMode: mode }),
      setLoading: loading => set({ isLoading: loading }),
      setError: error => set({ error }),
      clearError: () => set({ error: null }),

      optimisticCreateItem: (tempId, dayId, item) =>
        set(state => {
          const currentItems = state.itemsByDay[dayId] || []
          const optimisticItem: ItineraryItem = {
            id: tempId,
            tripId: '',
            dayId,
            day: 1,
            title: item.title || '',
            description: item.description || null,
            startTime: item.startTime || null,
            endTime: item.endTime || null,
            locationId: item.locationId || null,
            type: item.type || 'ACTIVITY',
            createdBy: '',
            createdAt: new Date().toISOString(),
            overlap: false
          }

          const newOperations = new Map(state.optimisticOperations)
          newOperations.set(tempId, {
            type: 'create',
            previousState: {
              dayId,
              items: currentItems
            },
            timestamp: Date.now()
          })

          return {
            itemsByDay: { ...state.itemsByDay, [dayId]: [...currentItems, optimisticItem] },
            optimisticOperations: newOperations
          }
        }),

      optimisticUpdateItem: (id, dayId, updates) =>
        set(state => {
          const currentItems = state.itemsByDay[dayId] || []
          const itemIndex = currentItems.findIndex(item => item.id === id)

          if (itemIndex === -1) return state

          const previousItem = currentItems[itemIndex]
          const updatedItems = [...currentItems]
          updatedItems[itemIndex] = { ...previousItem, ...updates }

          const operationId = `update-${id}-${Date.now()}`
          const newOperations = new Map(state.optimisticOperations)
          newOperations.set(operationId, {
            type: 'update',
            previousState: {
              dayId,
              item: previousItem,
              index: itemIndex
            },
            timestamp: Date.now()
          })

          return {
            itemsByDay: { ...state.itemsByDay, [dayId]: updatedItems },
            optimisticOperations: newOperations
          }
        }),

      optimisticDeleteItem: (id, dayId) =>
        set(state => {
          const currentItems = state.itemsByDay[dayId] || []
          const itemIndex = currentItems.findIndex(item => item.id === id)

          if (itemIndex === -1) return state

          const deletedItem = currentItems[itemIndex]
          const updatedItems = currentItems.filter(item => item.id !== id)

          const operationId = `delete-${id}-${Date.now()}`
          const newOperations = new Map(state.optimisticOperations)
          newOperations.set(operationId, {
            type: 'delete',
            previousState: {
              dayId,
              item: deletedItem,
              index: itemIndex
            },
            timestamp: Date.now()
          })

          return {
            itemsByDay: { ...state.itemsByDay, [dayId]: updatedItems },
            optimisticOperations: newOperations
          }
        }),

      optimisticMoveItem: (id, fromDayId, toDayId, updates) =>
        set(state => {
          const fromItems = state.itemsByDay[fromDayId] || []
          const toItems = state.itemsByDay[toDayId] || []
          const itemIndex = fromItems.findIndex(item => item.id === id)

          if (itemIndex === -1) return state

          const movedItem = { ...fromItems[itemIndex], dayId: toDayId, ...updates }
          const updatedFromItems = fromItems.filter(item => item.id !== id)
          const updatedToItems = [...toItems, movedItem]

          const operationId = `move-${id}-${Date.now()}`
          const newOperations = new Map(state.optimisticOperations)
          newOperations.set(operationId, {
            type: 'move',
            previousState: {
              dayId: fromDayId,
              item: fromItems[itemIndex],
              fromDayId,
              toDayId,
              fromIndex: itemIndex
            },
            timestamp: Date.now()
          })

          return {
            itemsByDay: {
              ...state.itemsByDay,
              [fromDayId]: updatedFromItems,
              [toDayId]: updatedToItems
            },
            optimisticOperations: newOperations
          }
        }),

      confirmOptimisticOperation: (operationId, serverData) =>
        set(state => {
          const newOperations = new Map(state.optimisticOperations)
          newOperations.delete(operationId)

          if (serverData?.items && serverData?.dayId) {
            return {
              itemsByDay: { ...state.itemsByDay, [serverData.dayId]: serverData.items },
              optimisticOperations: newOperations
            }
          }

          return { optimisticOperations: newOperations }
        }),

      rollbackOptimisticOperation: (operationId) =>
        set(state => {
          const operation = state.optimisticOperations.get(operationId)
          if (!operation) return state

          const newOperations = new Map(state.optimisticOperations)
          newOperations.delete(operationId)

          const updatedItemsByDay = { ...state.itemsByDay }
          rollbackOperation(updatedItemsByDay, operation)

          return {
            itemsByDay: updatedItemsByDay,
            optimisticOperations: newOperations
          }
        }),

      rollbackAllOptimistic: () =>
        set(state => {
          const operations = Array.from(state.optimisticOperations.entries())
            .sort(([,a], [,b]) => b.timestamp - a.timestamp)

          const updatedItemsByDay = { ...state.itemsByDay }

          for (const [, operation] of operations) {
            rollbackOperation(updatedItemsByDay, operation)
          }

          return {
            itemsByDay: updatedItemsByDay,
            optimisticOperations: new Map()
          }
        })
    }),
    { name: 'itinerary-store' }
  )
)