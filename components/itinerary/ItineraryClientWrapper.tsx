'use client'

import { useEffect } from 'react'
import { useItineraryStore } from '@/store/itinerary-store'
import type { ItineraryItem as ApiItem } from '@/types/itinerary'

interface RawApiItem {
  id: string
  trip_id: string
  day: number  // Changed from dayId to day (matches schema)
  title: string
  description: string | null
  start_time: string | null
  end_time: string | null
  location_id: string | null
  type: ApiItem['type']
  created_by: string
  created_at: string | null
  overlap: boolean
}

function toCamel(r: RawApiItem): ApiItem {
  return {
    id: r.id,
    tripId: r.trip_id,
    day: r.day,
    dayId: r.day.toString(),
    title: r.title,
    description: r.description,
    startTime: r.start_time,
    endTime: r.end_time,
    locationId: r.location_id,
    type: r.type,
    createdBy: r.created_by,
    createdAt: r.created_at || new Date().toISOString(), // Fallback if somehow null
    overlap: r.overlap
  }
}

interface Props {
  dayId: string
  items: RawApiItem[]
  children: React.ReactNode
}

export function ItineraryClientWrapper({ dayId, items, children }: Props) {
  const setDayItems = useItineraryStore(s => s.setDayItems)

  useEffect(() => {
    setDayItems(dayId, items.map(toCamel))
  }, [dayId, items, setDayItems])

  return <>{children}</>
}