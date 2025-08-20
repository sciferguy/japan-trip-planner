// hooks/useItinerary.ts
import { useState, useEffect } from 'react'
import { ItineraryItem, CreateItineraryItemData } from '@/types/itinerary'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: any
  overlaps?: any[]
}

export function useItinerary(tripId: string, day?: number) {
  const [items, setItems] = useState<ItineraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ trip_id: tripId })
      if (day) params.append('day', day.toString())

      const response = await fetch(`/api/itinerary?${params}`)
      const result: ApiResponse<ItineraryItem[]> = await response.json()

      if (result.success && result.data) {
        setItems(result.data)
        setError(null)
      } else {
        setError(result.error || 'Failed to fetch items')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const createItem = async (data: CreateItineraryItemData) => {
    try {
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result: ApiResponse<ItineraryItem> = await response.json()

      if (result.success && result.data) {
        setItems(prev => [...prev, result.data!])
        return { success: true, data: result.data }
      } else {
        return {
          success: false,
          error: result.error,
          overlaps: result.overlaps
        }
      }
    } catch (err) {
      return { success: false, error: 'Network error' }
    }
  }

  useEffect(() => {
    fetchItems()
  }, [tripId, day])

  return {
    items,
    loading,
    error,
    createItem,
    refetch: fetchItems
  }
}