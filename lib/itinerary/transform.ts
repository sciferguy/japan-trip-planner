// lib/itinerary/transform.ts
import { itinerary_items, ItineraryItemType } from '@prisma/client'
import { ItineraryItem } from '@/types/itinerary'
import { ItineraryWithOverlap } from './overlaps'

type Row = itinerary_items & { overlap?: boolean }

export function toApiItineraryItem(r: Row | ItineraryWithOverlap): ItineraryItem {
    return {
        id: r.id,
        tripId: '', // Will need to be set elsewhere since it's not directly on the item
        dayId: r.day_id, // Use day_id from schema
        day: 1, // Default value - calculate from day relation if needed
        title: r.title,
        description: r.note ?? null, // Use 'note' field from schema
        startTime: r.start_time ? r.start_time.toISOString() : null,
        endTime: r.end_time ? r.end_time.toISOString() : null,
        locationId: r.place_id ?? null, // Use 'place_id' from schema
        type: r.type as ItineraryItemType,
        createdBy: r.created_by_user_id, // Use 'created_by_user_id' from schema
        createdAt: r.created_at.toISOString(),
        overlap: !!r.overlap
    }
}

export function toApiItineraryItems(rows: (Row | ItineraryWithOverlap)[]) {
    return rows.map(toApiItineraryItem)
}