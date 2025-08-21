import { useCallback, useEffect, useState } from 'react'
import { ItineraryItem, CreateItineraryItemData, PatchItineraryItemData } from '@/types/itinerary'

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

// Updated hook to work with dayId instead of tripId + day number
export function useItinerary(tripId: string, dayNumber?: number) {
  const [items, setItems] = useState<ItineraryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dayId, setDayId] = useState<string | null>(null)

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
      // Need to fetch dayId first
      const foundDayId = await fetchDayId()
      if (foundDayId) {
        setDayId(foundDayId)
        return
      }
    }

    if (!dayId) {
      // Fetch all items for trip overview
      const res = await fetch(`/api/trips/${tripId}/itinerary-items`)
      const data = await json<ItineraryItem[]>(res)
      if (data.ok) {
        setItems(data.data)
      } else {
        setError(data.error.message)
      }
      return
    }

    setLoading(true)
    setError(null)
    const res = await fetch(`/api/days/${dayId}/itinerary-items`)
    const data = await json<ItineraryItem[]>(res)
    if (data.ok) {
      setItems(data.data)
    } else {
      setError(data.error.message)
    }
    setLoading(false)
  }, [dayId, dayNumber, tripId, fetchDayId])

  const createItem = async (data: CreateItineraryItemData) => {
    if (!dayId) return { success: false, error: 'No day selected' }

    const res = await fetch(`/api/days/${dayId}/itinerary-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const parsed = await json<{ created: ItineraryItem; items: ItineraryItem[] }>(res)
    if (parsed.ok) {
      setItems(parsed.data.items)
      return { success: true, data: parsed.data }
    }
    return { success: false, error: parsed.error.message }
  }

  const patchItem = async (id: string, patch: PatchItineraryItemData) => {
    const res = await fetch(`/api/itinerary-items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    })
    const parsed = await json<{ updated: ItineraryItem; days: Record<string, ItineraryItem[]> }>(res)
    if (parsed.ok) {
      if (dayId && parsed.data.days[dayId]) {
        setItems(parsed.data.days[dayId])
      }
      return { success: true, data: parsed.data }
    }
    return { success: false, error: parsed.error.message }
  }

  const deleteItem = async (id: string) => {
    const res = await fetch(`/api/itinerary-items/${id}`, { method: 'DELETE' })
    const parsed = await json<{ deletedId: string; dayId: string; items: ItineraryItem[] }>(res)
    if (parsed.ok) {
      if (dayId === parsed.data.dayId) setItems(parsed.data.items)
      return { success: true, data: parsed.data }
    }
    return { success: false, error: parsed.error.message }
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

  return { items, loading, error, refetch: fetchItems, createItem, patchItem, deleteItem }
}

// Legacy compatibility - will be removed once components are updated
export const useDayItinerary = useItinerary