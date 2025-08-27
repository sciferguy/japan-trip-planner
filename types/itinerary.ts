// types/itinerary.ts - Simplified to use generated types
// Re-export generated types only after they exist
export * from '../lib/validation/itinerary'

// Keep only legacy types for backward compatibility
export interface ItineraryItem {
  id: string
  tripId: string
  dayId: string
  day: number // legacy field for backward compatibility
  title: string
  description: string | null
  startTime: string | null
  endTime: string | null
  locationId: string | null
  type: 'ACTIVITY' | 'TRANSPORT' | 'MEAL' | 'ACCOMMODATION' | 'MEETING' | 'FREE_TIME'
  createdBy: string
  createdAt: string
  overlap: boolean
}

// Type aliases for easier migration
export type CreateItineraryItemData = import('../lib/validation/itinerary').CreateItineraryItemInput
export type UpdateItineraryItemData = import('../lib/validation/itinerary').UpdateItineraryItemInput

// Legacy type alias
export type ItineraryItemType = import('@prisma/client').ItineraryItemType