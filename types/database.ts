// types/database.ts
import type { trips, days, places, itinerary_items, User } from '@prisma/client'

// Enhanced types with relations
export type TripWithDetails = trips & {
  days?: days[]
  places?: places[]
  itinerary_items?: itinerary_items[]
  users?: User
}

export type DayWithItems = days & {
  itinerary_items?: itinerary_items[]
}

// Re-export for consistency
export type { trips, days, places, itinerary_items, User }