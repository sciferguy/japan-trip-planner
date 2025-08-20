// types/itinerary.ts
export interface ItineraryItem {
  id: string
  tripId: string
  dayId: string | null
  title: string
  description: string | null
  startTime: string | null
  endTime: string | null
  locationId: string | null
  type: 'ACTIVITY' | 'TRANSPORT' | 'MEAL' | 'ACCOMMODATION' | 'MEETING' | 'FREE_TIME'
  createdBy: string
  createdAt: string | null
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