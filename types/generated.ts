// Generated types from Zod schemas - DO NOT EDIT MANUALLY
// Run 'npm run generate-types' to regenerate

// Re-export validation schemas and their inferred types
export {
  createItineraryItemSchema,
  updateItineraryItemSchema,
  type CreateItineraryItemInput,
  type UpdateItineraryItemInput
} from '../lib/validation/itinerary'

export {
  createPlaceSchema,
  updatePlaceSchema,
  parseGoogleUrlSchema,
  type CreatePlaceInput,
  type UpdatePlaceInput,
  type ParseGoogleUrlInput
} from '../lib/validation/places'

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
