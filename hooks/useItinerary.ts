// hooks/useItinerary.ts
import { useCallback, useEffect, useState } from 'react'
import { ItineraryItem, CreateItineraryItemData, UpdateItineraryItemData } from '@/types/itinerary'
import { useItineraryStore } from '@/store/itinerary-store'

interface ApiOk<T> { ok: true; data: T }
interface ApiErr { ok: false; error: { code: string; message: string } }
type ApiResp<T> = ApiOk<T> | ApiErr

async function json<T>(res: Response): Promise<ApiResp<T>> {
  try {
    return await res.json()
  } catch {
    return { ok: false, error: { code: 'BAD_JSON', message: 'Invalid JSON' } }
  }
}

function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function useItinerary(tripId: string, dayNumber?: number) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dayId, setDayId] = useState<string | null>(null)

  const {
    itemsByDay,
    setDayItems,
    optimisticCreateItem,
    optimisticUpdateItem,
    optimisticDeleteItem,
    optimisticMoveItem,
    confirmOptimisticOperation,
    rollbackOptimisticOperation,
    setError: setStoreError
  } = useItineraryStore()

  // Get items from store
  const items = dayId ? (itemsByDay[dayId] || []) : []

  // Fetch dayId from day number if provided
  const fetchDayId = useCallback(async () => {
    if (!dayNumber) return null

    const res = await fetch(`/api/trips/${tripId}/days`)
    const data = await json<Array<{ id: string; date: string; number: number }>>(res)

    if (data.ok) {
      const day = data.data.find(d => d.number === dayNumber)
      return day?.id || null
    }
    return null
  }, [tripId, dayNumber])

  const fetchItems = useCallback(async () => {
    if (dayNumber && !dayId) {
      const foundDayId = await fetchDayId()
      if (foundDayId) {
        setDayId(foundDayId)
        return
      }
    }

    if (!dayId) {
      const res = await fetch(`/api/trips/${tripId}/itinerary-items`)
      const data = await json<ItineraryItem[]>(res)
      if (data.ok) {
        // Handle trip-level items if needed
        setDayItems('all', data.data)
      } else {
        setError(data.error.message)
        setStoreError(data.error.message)
      }
      return
    }

    setLoading(true)
    setError(null)
    setStoreError(null)

    const res = await fetch(`/api/days/${dayId}/itinerary-items`)
    const data = await json<ItineraryItem[]>(res)

    if (data.ok) {
      setDayItems(dayId, data.data)
    } else {
      setError(data.error.message)
      setStoreError(data.error.message)
    }
    setLoading(false)
  }, [dayId, dayNumber, tripId, fetchDayId, setDayItems, setStoreError])

  const createItem = async (data: CreateItineraryItemData) => {
    if (!dayId) return { success: false, error: 'No day selected' }

    const tempId = generateTempId()
    const targetDayId = data.dayId || dayId

    // Optimistic update
    optimisticCreateItem(tempId, targetDayId, {
      title: data.title,
      description: data.description,
      type: data.type,
      startTime: data.startTime,
      endTime: data.endTime,
      locationId: data.locationId
    })

    try {
      const res = await fetch(`/api/days/${dayId}/itinerary-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const parsed = await json<{ created: ItineraryItem; items: ItineraryItem[] }>(res)

      if (parsed.ok) {
        // Confirm optimistic update with server data
        confirmOptimisticOperation(tempId, {
          dayId: targetDayId,
          items: parsed.data.items
        })
        return { success: true, data: parsed.data }
      } else {
        // Rollback optimistic update
        rollbackOptimisticOperation(tempId)
        setError(parsed.error.message)
        setStoreError(parsed.error.message)
        return { success: false, error: parsed.error.message }
      }
    } catch (err) {
      // Rollback on network error
      rollbackOptimisticOperation(tempId)
      const errorMsg = 'Network error occurred'
      setError(errorMsg)
      setStoreError(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  const patchItem = async (id: string, patch: UpdateItineraryItemData) => {
    if (!dayId) return { success: false, error: 'No day selected' }

    const operationId = `update-${id}-${Date.now()}`

    // Handle day move case
    const targetDayId = patch.dayId || dayId
    const isMoving = patch.dayId && patch.dayId !== dayId

    // Optimistic update
    if (isMoving) {
      optimisticMoveItem(id, dayId, targetDayId, patch)
    } else {
      optimisticUpdateItem(id, dayId, patch)
    }

    try {
      const res = await fetch(`/api/itinerary-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      })

      const parsed = await json<{ updated: ItineraryItem; days: Record<string, ItineraryItem[]> }>(res)

      if (parsed.ok) {
        // Confirm optimistic update with server data
        confirmOptimisticOperation(operationId)

        // Update affected days with server data
        Object.entries(parsed.data.days).forEach(([dayKey, items]) => {
          setDayItems(dayKey, items)
        })

        return { success: true, data: parsed.data }
      } else {
        // Rollback optimistic update
        rollbackOptimisticOperation(operationId)
        setError(parsed.error.message)
        setStoreError(parsed.error.message)
        return { success: false, error: parsed.error.message }
      }
    } catch (err) {
      // Rollback on network error
      rollbackOptimisticOperation(operationId)
      const errorMsg = 'Network error occurred'
      setError(errorMsg)
      setStoreError(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  const deleteItem = async (id: string) => {
    if (!dayId) return { success: false, error: 'No day selected' }

    const operationId = `delete-${id}-${Date.now()}`

    // Optimistic update
    optimisticDeleteItem(id, dayId)

    try {
      const res = await fetch(`/api/itinerary-items/${id}`, { method: 'DELETE' })
      const parsed = await json<{ deletedId: string; dayId: string; items: ItineraryItem[] }>(res)

      if (parsed.ok) {
        // Confirm optimistic update with server data
        confirmOptimisticOperation(operationId, {
          dayId: parsed.data.dayId,
          items: parsed.data.items
        })
        return { success: true, data: parsed.data }
      } else {
        // Rollback optimistic update
        rollbackOptimisticOperation(operationId)
        setError(parsed.error.message)
        setStoreError(parsed.error.message)
        return { success: false, error: parsed.error.message }
      }
    } catch (err) {
      // Rollback on network error
      rollbackOptimisticOperation(operationId)
      const errorMsg = 'Network error occurred'
      setError(errorMsg)
      setStoreError(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    if (dayNumber && !dayId) {
      fetchDayId().then(id => {
        if (id) setDayId(id)
      })
    }
  }, [dayNumber, dayId, fetchDayId])

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
    createItem,
    patchItem,
    deleteItem
  }
}

// Legacy compatibility
export const useDayItinerary = useItinerary