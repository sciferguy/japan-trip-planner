export interface ItineraryItem {
  id: string
  tripId: string
  dayId: string | null
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

export interface CreateItineraryItemData {
  dayId: string
  title: string
  description?: string
  startTime?: string
  endTime?: string
  locationId?: string
  type: ItineraryItem['type']
}

export interface PatchItineraryItemData {
  title?: string
  description?: string
  startTime?: string
  endTime?: string
  locationId?: string | null
  type?: ItineraryItem['type']
  dayId?: string
}

export interface UpdateItineraryItemData {
  title: string
  description?: string | null
  type: ItineraryItem['type']
  startTime?: string | null
  endTime?: string | null
  locationId?: string | null
  dayId?: string // For day changes
}

// Type alias for prisma enum
export type ItineraryItemType = 'ACTIVITY' | 'TRANSPORT' | 'MEAL' | 'ACCOMMODATION' | 'MEETING' | 'FREE_TIME'