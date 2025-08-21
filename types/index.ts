// types/index.ts
// Central type barrel. Keep this file type-only (no runtime imports/functions).

// Re-export Prisma generated types & enums.
export * from '@prisma/client'

// Domain / API facing itinerary item (camelCase) if you map DB snake_case externally.
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

// Map / location related lightweight view model (separate from Prisma `locations`).
export interface MapPin {
  id: string
  name: string
  lat: number
  lng: number
  type: string
  color?: string
  icon?: string
}

// Generic API envelopes.
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

// App state fragments (example usage in stores/UI).
export interface AppState {
  pins: MapPin[]
  itineraryItemsByDay: Record<string, ApiItineraryItem[]>
}

// Form payload examples (adjust as needed).
export interface TripFormData {
  title: string
  startDate: Date
  endDate: Date
}

export interface ItineraryItemFormData {
  day: number
  title: string
  description?: string
  startTime?: Date
  endTime?: Date
  locationId?: string
  type: string
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

// Unified create request for itinerary items (new relational dayId or legacy day).
export interface CreateItineraryItemRequest {
  title: string
  description?: string | null
  type: string
  locationId?: string | null
  // One of the following (prefer dayId):
  dayId?: string | null
  day?: number
  // Optional ISO timestamps (or null)
  startTime?: string | null
  endTime?: string | null
}

// Basic session user projection.
export interface SessionUser {
  id: string
  email: string
  name?: string
  role: string
  avatarUrl?: string
}

// Store interface examples (lightweight).
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

// NOTE:
// Overlap calculation & DB queries were moved to `lib/itinerary/overlaps.ts`.
// Do not import `prisma` or place runtime logic here to keep compilation fast.