// hooks/usePlaces.ts
import { useState, useEffect } from 'react'
import { useCurrentTrip } from './useCurrentTrip'

interface Place {
  id: string
  name: string
  address?: string
  lat?: number
  lng?: number
  source_url?: string
  category?: string
  created_at: string
}

interface CreatePlaceData {
  name: string
  address?: string
  lat?: number | null
  lng?: number | null
  source_url?: string
  category?: string
}

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { tripId } = useCurrentTrip()

  const fetchPlaces = async () => {
    if (!tripId) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/places?tripId=${tripId}`)
      const data = await response.json()
      if (data.ok) {
        setPlaces(data.data)
      } else {
        setError(data.error?.message || 'Failed to fetch places')
      }
    } catch (error) {
      console.error('Failed to fetch places:', error)
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createPlace = async (placeData: CreatePlaceData): Promise<Place> => {
    if (!tripId) throw new Error('No trip selected')

    const response = await fetch(`/api/places?tripId=${tripId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(placeData)
    })

    const result = await response.json()
    if (!result.ok) {
      throw new Error(result.error?.message || 'Failed to create place')
    }

    const newPlace = result.data
    setPlaces(prev => [newPlace, ...prev])
    return newPlace
  }

  useEffect(() => {
    if (tripId) {
      fetchPlaces()
    }
  }, [tripId])

  return { places, loading, error, refetch: fetchPlaces, createPlace }
}