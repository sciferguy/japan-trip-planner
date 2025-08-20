// hooks/useItinerary.ts
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

export function useDayItinerary(dayId: string | null) {
  const [items, setItems] = useState<ItineraryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    if (!dayId) {
      setItems([])
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
  }, [dayId])

  const createItem = async (data: CreateItineraryItemData) => {
    if (!dayId) return { ok: false as const, error: 'No day selected' }
    const res = await fetch(`/api/days/${dayId}/itinerary-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const parsed = await json<{ created: ItineraryItem; items: ItineraryItem[] }>(res)
    if (parsed.ok) {
      setItems(parsed.data.items)
    }
    return parsed
  }

  const patchItem = async (id: string, patch: PatchItineraryItemData) => {
    const res = await fetch(`/api/itinerary-items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    })
    const parsed = await json<{ updated: ItineraryItem; days: Record<string, ItineraryItem[]> }>(res)
    if (parsed.ok) {
      // If current day present update list
      if (dayId && parsed.data.days[dayId]) {
        setItems(parsed.data.days[dayId])
      }
    }
    return parsed
  }

  const deleteItem = async (id: string) => {
    const res = await fetch(`/api/itinerary-items/${id}`, { method: 'DELETE' })
    const parsed = await json<{ deletedId: string; dayId: string; items: ItineraryItem[] }>(res)
    if (parsed.ok) {
      if (dayId === parsed.data.dayId) setItems(parsed.data.items)
    }
    return parsed
  }

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return { items, loading, error, refetch: fetchItems, createItem, patchItem, deleteItem }
}