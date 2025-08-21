// lib/itinerary/transform.ts
import { itinerary_items, ItineraryItemType } from '@prisma/client'
import { ItineraryItem } from '@/types/itinerary'

type Row = itinerary_items & { overlap?: boolean }

// Add this type for data coming from getDayItemsWithOverlaps
type ItineraryWithOverlap = {
  id: string
  trip_id: string
  day: number
  title: string
  description: string | null
  start_time: Date | null
  end_time: Date | null
  location_id: string | null
  type: string  // This comes as string from the overlap function
  created_by: string
  created_at: Date
  overlap?: boolean
}

export function toApiItineraryItem(r: Row | ItineraryWithOverlap): ItineraryItem {
    return {
        id: r.id,
        tripId: r.trip_id,
        dayId: r.day.toString(),
        day: r.day,
        title: r.title,
        description: r.description ?? null,
        startTime: r.start_time ? r.start_time.toISOString() : null,
        endTime: r.end_time ? r.end_time.toISOString() : null,
        locationId: r.location_id ?? null,
        type: r.type as ItineraryItemType, // Cast string to enum
        createdBy: r.created_by,
        createdAt: r.created_at?.toISOString() ?? null,
        overlap: !!r.overlap
    }
}

export function toApiItineraryItems(rows: (Row | ItineraryWithOverlap)[]) {
    return rows.map(toApiItineraryItem)
}