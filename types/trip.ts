import type { trips } from '@prisma/client'

export interface TripWithRelations extends trips {
  days?: Array<{
    id: string
    date: Date | string
    trip_id: string
    note: string | null
  }>
  itinerary_items?: Array<{
    id: string
    tripId: string
    dayId: string
    day: number
    title: string
    description: string | null
    startTime: string | null
    endTime: string | null
    locationId: string | null
    type: 'ACTIVITY' | 'TRANSPORT' | 'MEAL' | 'ACCOMMODATION' | 'MEETING' | 'FREE_TIME'
    createdBy: string
    createdAt: string
    overlap: boolean
  }>
}