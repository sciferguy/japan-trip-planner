import { useCallback, useEffect, useRef, useState } from 'react'
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

  const items = dayId 
  ? (itemsByDay[dayId] || []) 
  : (itemsByDay['trip'] || [])

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

  const logged403Ref = useRef(false)

  const fetchItems = useCallback(async () => {
    if (dayNumber && !dayId) {
      const foundDayId = await fetchDayId()
      if (foundDayId) {
        setDayId(foundDayId)
        return
      }
    }
  
    setLoading(true)
    setError(null)
    setStoreError(null)
  
    const endpoint = dayId 
      ? `/api/days/${dayId}/itinerary-items`
      : `/api/trips/${tripId}/itinerary-items`

    try {
      const res = await fetch(endpoint)
      if (res.status === 403) {
        setError('forbidden')
        setStoreError('forbidden')
        if (!logged403Ref.current) {
          logged403Ref.current = true
          console.error('[useItinerary.403]', {
            component: 'useItinerary',
            status: 403,
            endpoint,
            tripId,
          })
        }
        return
      }
      if (!res.ok) {
        let body = ''
        try { body = await res.clone().text() } catch {}
        console.error('[useItinerary.fetchItems]', { endpoint, status: res.status, statusText: res.statusText, bodyPreview: body.slice(0, 500) })
      }
      const data = await json<ItineraryItem[]>(res)

      if (data.ok) {
        const storeKey = dayId || 'trip'
        setDayItems(storeKey, data.data)
      } else {
        setError(data.error.message)
        setStoreError(data.error.message)
      }
    } catch (e: any) {
      console.error('[useItinerary.fetchItems:error]', { endpoint, error: e?.message || e })
      setError(e?.message || 'Fetch failed')
      setStoreError(e?.message || 'Fetch failed')
    } finally {
      setLoading(false)
    }
  }, [dayId, dayNumber, tripId, fetchDayId, setDayItems, setStoreError])

    const createItem = async (data: CreateItineraryItemData) => {
      if (!data.dayId) return { success: false, error: 'No day selected' }
    
      const tempId = generateTempId()
    const targetDayId = data.dayId
      optimisticCreateItem(tempId, targetDayId, {
        title: data.title,
        description: data.description,
        type: data.type,
        startTime: data.startTime,
        endTime: data.endTime,
        locationId: data.locationId
      })
  
    try {
      const endpoint = `/api/days/${targetDayId}/itinerary-items`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) {
        let body = ''
        try { body = await res.clone().text() } catch {}
        console.error('[useItinerary.createItem]', { endpoint, status: res.status, statusText: res.statusText, bodyPreview: body.slice(0, 500), payload: data })
      }

      const parsed = await json<{ created: ItineraryItem; items: ItineraryItem[] }>(res)

      if (parsed.ok) {
        confirmOptimisticOperation(tempId, {
          dayId: targetDayId,
          items: parsed.data.items
        })
        return { success: true, data: parsed.data }
      } else {
        rollbackOptimisticOperation(tempId)
        setError(parsed.error.message)
        setStoreError(parsed.error.message)
        return { success: false, error: parsed.error.message }
      }
    } catch (err: any) {
      rollbackOptimisticOperation(tempId)
      const errorMsg = err?.message || 'Network error occurred'
      setError(errorMsg)
      setStoreError(errorMsg)
      console.error('[useItinerary.createItem:network]', { tripId, targetDayId, error: errorMsg })
      return { success: false, error: errorMsg }
    }
  }

  const patchItem = async (id: string, patch: UpdateItineraryItemData) => {
    const targetDayId = patch.dayId || dayId
    const isMoving = !!(patch.dayId && patch.dayId !== dayId)

    if (!targetDayId) {
      const msg = 'No day selected'
      setError(msg)
      setStoreError(msg)
      return { success: false, error: msg }
    }

    if (isMoving && dayId) {
      optimisticMoveItem(id, dayId, targetDayId, patch)
    } else if (targetDayId) {
      optimisticUpdateItem(id, targetDayId, patch)
    }

    const findLatestOperationId = () => {
      const state: any = (useItineraryStore as any).getState?.() || {}
      const ops: Map<string, any> = state.optimisticOperations || new Map()
      let latest: { id: string; ts: number } | null = null
      for (const [opId, op] of ops.entries()) {
        if (
          op?.type === (isMoving ? 'move' : 'update') &&
          op?.previousState?.dayId === (isMoving ? dayId : targetDayId) &&
          op?.previousState?.item?.id === id
        ) {
          const ts = op?.timestamp || 0
          if (!latest || ts > latest.ts) latest = { id: opId, ts }
        }
      }
      return latest?.id || null
    }

    const operationId = findLatestOperationId()

    try {
      const endpoint = `/api/itinerary-items/${id}`
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      })
      if (!res.ok) {
        let body = ''
        try { body = await res.clone().text() } catch {}
        console.error('[useItinerary.patchItem]', { endpoint, status: res.status, statusText: res.statusText, bodyPreview: body.slice(0, 500), payload: patch })
      }

      const parsed = await json<{ updated: ItineraryItem; days: Record<string, ItineraryItem[]> }>(res)

      if (parsed.ok) {
        if (operationId) confirmOptimisticOperation(operationId)
        Object.entries(parsed.data.days).forEach(([dayKey, items]) => {
          setDayItems(dayKey, items)
        })
        return { success: true, data: parsed.data }
      } else {
        if (operationId) rollbackOptimisticOperation(operationId)
        setError(parsed.error.message)
        setStoreError(parsed.error.message)
        return { success: false, error: parsed.error.message }
      }
    } catch (err: any) {
      if (operationId) rollbackOptimisticOperation(operationId)
      const errorMsg = err?.message || 'Network error occurred'
      setError(errorMsg)
      setStoreError(errorMsg)
      console.error('[useItinerary.patchItem:network]', { tripId, id, error: errorMsg })
      return { success: false, error: errorMsg }
    }
  }

  const deleteItem = async (id: string) => {
    let targetDayId = dayId
    
    if (!targetDayId) {
      console.log('Looking for item in store:', { id, itemsByDay: Object.keys(itemsByDay) })
      for (const [key, items] of Object.entries(itemsByDay)) {
        console.log(`Checking ${key}:`, items.map(i => i.id))
        if (items.some(item => item.id === id)) {
          targetDayId = key
          console.log('Found item in day:', targetDayId)
          break
        }
      }
    }
    
    if (!targetDayId || targetDayId === 'trip') {
      console.warn('Could not find item in store, attempting delete anyway')
      
      try {
        const endpoint = `/api/itinerary-items/${id}`
        const res = await fetch(endpoint, { method: 'DELETE' })
        const parsed = await json<{ deletedId: string; dayId: string; items: ItineraryItem[] }>(res)
        
        if (parsed.ok) {
          const deletedDayId = parsed.data.dayId
          if (deletedDayId) {
            setDayItems(deletedDayId, parsed.data.items)
          }
          return { success: true, data: parsed.data }
        } else {
          setError(parsed.error.message)
          setStoreError(parsed.error.message)
          return { success: false, error: parsed.error.message }
        }
      } catch (err: any) {
        const errorMsg = err?.message || 'Network error occurred'
        setError(errorMsg)
        setStoreError(errorMsg)
        return { success: false, error: errorMsg }
      }
    }
    
    optimisticDeleteItem(id, targetDayId)

    const findLatestDeleteOperationId = () => {
      const state: any = (useItineraryStore as any).getState?.() || {}
      const ops: Map<string, any> = state.optimisticOperations || new Map()
      let latest: { id: string; ts: number } | null = null
      for (const [opId, op] of ops.entries()) {
        if (op?.type === 'delete' && op?.previousState?.dayId === targetDayId && op?.previousState?.item?.id === id) {
          const ts = op?.timestamp || 0
          if (!latest || ts > latest.ts) latest = { id: opId, ts }
        }
      }
      return latest?.id || null
    }

    const operationId = findLatestDeleteOperationId()

    try {
      const endpoint = `/api/itinerary-items/${id}`
      const res = await fetch(endpoint, { method: 'DELETE' })
      if (!res.ok) {
        let body = ''
        try { body = await res.clone().text() } catch {}
        console.error('[useItinerary.deleteItem]', { endpoint, status: res.status, statusText: res.statusText, bodyPreview: body.slice(0, 500) })
      }
      const parsed = await json<{ deletedId: string; dayId: string; items: ItineraryItem[] }>(res)

      if (parsed.ok) {
        if (operationId) {
          confirmOptimisticOperation(operationId, {
            dayId: parsed.data.dayId,
            items: parsed.data.items
          })
        }
        return { success: true, data: parsed.data }
      } else {
        if (operationId) rollbackOptimisticOperation(operationId)
        setError(parsed.error.message)
        setStoreError(parsed.error.message)
        return { success: false, error: parsed.error.message }
      }
    } catch (err: any) {
      if (operationId) rollbackOptimisticOperation(operationId)
      const errorMsg = err?.message || 'Network error occurred'
      setError(errorMsg)
      setStoreError(errorMsg)
      console.error('[useItinerary.deleteItem:network]', { tripId, id, error: errorMsg })
      return { success: false, error: errorMsg }
    }
  }

  const reorderItems = async (dayNumber: number, itemIds: string[]) => {
    let targetDayId = dayId
    if (!targetDayId && dayNumber) {
      const endpoint = `/api/trips/${tripId}/days`
      const res = await fetch(endpoint)
      if (!res.ok) {
        let body = ''
        try { body = await res.clone().text() } catch {}
        console.error('[useItinerary.reorderItems:days]', { endpoint, status: res.status, statusText: res.statusText, bodyPreview: body.slice(0, 500) })
      }
      const data = await json<Array<{ id: string; date: string; number: number }>>(res)
      if (data.ok) {
        const day = data.data.find(d => d.number === dayNumber)
        targetDayId = day?.id || null
      }
    }
    if (!targetDayId) throw new Error('Day not found')

    const endpoint = `/api/days/${targetDayId}/itinerary-items/reorder`
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds })
      })
      if (!res.ok) {
        let body = ''
        try { body = await res.clone().text() } catch {}
        console.error('[useItinerary.reorderItems]', { endpoint, status: res.status, statusText: res.statusText, bodyPreview: body.slice(0, 500), itemIds })
      }
      const result = await json<{ items: ItineraryItem[] }>(res)
      if (!result.ok) throw new Error(result.error.message)
      setDayItems(targetDayId, result.data.items)
    } catch (e: any) {
      console.error('[useItinerary.reorderItems:network]', { endpoint, error: e?.message || e })
      throw e
    }
  }

  const invokedRef = useRef(false)
  useEffect(() => {
    if (invokedRef.current) return
    invokedRef.current = true
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
    deleteItem,
    reorderItems
  }
}

export const useDayItinerary = useItinerary