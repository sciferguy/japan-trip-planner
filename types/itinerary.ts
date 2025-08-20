// types/itinerary.ts
export interface ItineraryItem {
  id: string
  trip_id: string
  day: number
  title: string
  description?: string
  start_time?: string
  end_time?: string
  location_id?: string
  type: 'ACTIVITY' | 'TRANSPORT' | 'MEAL' | 'ACCOMMODATION' | 'MEETING' | 'FREE_TIME'
  created_by: string
  created_at: string
  locations?: {
    id: string
    name: string
    address: string
    lat: number
    lng: number
  } | null
}

export interface CreateItineraryItemData {
  trip_id: string
  day: number
  title: string
  description?: string
  start_time?: string
  end_time?: string
  location_id?: string
  type: ItineraryItem['type']
  created_by: string
}