// types/index.ts - Updated to use generated types
// Re-export Prisma generated types & enums
export * from '@prisma/client'

// Re-export validation types directly from source
export * from '../lib/validation/itinerary'
export * from '../lib/validation/places'

// Keep only types that aren't covered by Zod schemas
export interface ApiItineraryItem {
  id: string
  tripId: string
  dayId: string | null
  title: string
  description: string | null
  startTime: string | null
  endTime: string | null
  locationId: string | null
  type: string
  createdBy: string
  createdAt: string
  overlap: boolean
}

export interface MapPin {
  id: string
  name: string
  lat: number
  lng: number
  type: string
  color?: string
  icon?: string
}

export interface SessionUser {
  id: string
  email: string
  name?: string
  role: string
  avatarUrl?: string
}

export interface TripFormData {
  title: string
  startDate: Date
  endDate: Date
}

export interface ExpenseFormData {
  amount: number
  category: string
  description: string
  date: Date
  reservationId?: string
  locationId?: string
}

export interface ReservationFormData {
  type: string
  title: string
  confirmationCode?: string
  dateTime: Date
  locationId?: string
  cost?: number
  notes?: string
}

// Store interfaces
export interface MapStore {
  pins: MapPin[]
  selectedPin: MapPin | null
  addPin: (pin: MapPin) => void
  updatePin: (id: string, data: Partial<MapPin>) => void
  deletePin: (id: string) => void
  selectPin: (pin: MapPin | null) => void
}

export interface ItineraryStore {
  items: ApiItineraryItem[]
  addItem: (item: ApiItineraryItem) => void
  updateItem: (id: string, data: Partial<ApiItineraryItem>) => void
  deleteItem: (id: string) => void
  reorderItems: (items: ApiItineraryItem[]) => void
}

export interface AppState {
  pins: MapPin[]
  itineraryItemsByDay: Record<string, ApiItineraryItem[]>
}

// Common API envelope types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasNext: boolean
  hasPrev: boolean
}