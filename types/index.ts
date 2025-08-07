// Re-export Prisma generated types
export * from '@prisma/client'

// Additional custom types
export interface Location {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  googlePlaceId?: string
  customNotes?: string
  pinType: PinType
}

export interface MapPin extends Location {
  color?: string
  icon?: string
}

export interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  icon: string
}

export interface CurrencyRate {
  from: string
  to: string
  rate: number
  lastUpdated: Date
}

export interface NotificationPreferences {
  reservationReminders: boolean
  checkInReminders: boolean
  weatherAlerts: boolean
  collaboratorUpdates: boolean
}

// Prisma model types (need to be defined since we can't generate client yet)
export interface Trip {
  id: string
  title: string
  startDate: Date
  endDate: Date
  createdBy: string
  createdAt: Date
}

export interface ItineraryItem {
  id: string
  tripId: string
  day: number
  title: string
  description?: string
  startTime?: Date
  endTime?: Date
  locationId?: string
  type: ItineraryItemType
  createdBy: string
  createdAt: Date
}

export enum ItineraryItemType {
  ACTIVITY = 'ACTIVITY',
  TRANSPORT = 'TRANSPORT',
  MEAL = 'MEAL',
  ACCOMMODATION = 'ACCOMMODATION',
  MEETING = 'MEETING',
  FREE_TIME = 'FREE_TIME'
}

export enum PinType {
  HOTEL = 'HOTEL',
  RESTAURANT = 'RESTAURANT',
  ATTRACTION = 'ATTRACTION',
  TRAIN_STATION = 'TRAIN_STATION',
  AIRPORT = 'AIRPORT',
  SHOPPING = 'SHOPPING',
  CUSTOM = 'CUSTOM'
}

export enum ReservationType {
  FLIGHT = 'FLIGHT',
  HOTEL = 'HOTEL',
  TRAIN = 'TRAIN',
  RESTAURANT = 'RESTAURANT',
  ACTIVITY = 'ACTIVITY',
  TRANSPORT = 'TRANSPORT'
}

export enum UserRole {
  SUPER_USER = 'SUPER_USER',
  COLLABORATOR = 'COLLABORATOR',
  VIEWER = 'VIEWER'
}

export enum ExpenseCategory {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  SHOPPING = 'SHOPPING',
  ACTIVITIES = 'ACTIVITIES',
  ACCOMMODATION = 'ACCOMMODATION',
  OTHER = 'OTHER'
}

// Form types
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
  type: ItineraryItemType
}

export interface ReservationFormData {
  type: ReservationType
  title: string
  confirmationCode?: string
  dateTime: Date
  locationId?: string
  cost?: number
  notes?: string
}

export interface ExpenseFormData {
  amount: number
  category: ExpenseCategory
  description: string
  date: Date
  reservationId?: string
  locationId?: string
}

// API Response types
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

// Dashboard types
export interface DashboardStats {
  totalTrips: number
  upcomingReservations: number
  completedActivities: number
  totalExpenses: number
}

export interface UpcomingReservation {
  id: string
  title: string
  type: ReservationType
  dateTime: Date
  location?: string
}

// Map types
export interface MapViewport {
  latitude: number
  longitude: number
  zoom: number
}

export interface RouteData {
  origin: Location
  destination: Location
  waypoints?: Location[]
  duration: number
  distance: number
}

// Auth types
export interface SessionUser {
  id: string
  email: string
  name?: string
  role: UserRole
  avatarUrl?: string
}

// Store types
export interface TripStore {
  currentTrip: Trip | null
  trips: Trip[]
  setCurrentTrip: (trip: Trip | null) => void
  addTrip: (trip: Trip) => void
  updateTrip: (id: string, data: Partial<Trip>) => void
  deleteTrip: (id: string) => void
}

export interface ItineraryStore {
  items: ItineraryItem[]
  addItem: (item: ItineraryItem) => void
  updateItem: (id: string, data: Partial<ItineraryItem>) => void
  deleteItem: (id: string) => void
  reorderItems: (items: ItineraryItem[]) => void
}

export interface MapStore {
  viewport: MapViewport
  pins: MapPin[]
  selectedPin: MapPin | null
  setViewport: (viewport: MapViewport) => void
  addPin: (pin: MapPin) => void
  updatePin: (id: string, data: Partial<MapPin>) => void
  deletePin: (id: string) => void
  selectPin: (pin: MapPin | null) => void
}