// lib/validation/places.ts
import { z } from 'zod'

export const createPlaceSchema = z.object({
  name: z.string().min(1).max(200),
  address: z.string().max(500).optional().or(z.literal('').transform(() => undefined)),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  source_url: z.string().url().optional().or(z.literal('').transform(() => undefined)), // Changed from sourceUrl
  category: z.string().max(50).optional().or(z.literal('').transform(() => undefined))
})

export const updatePlaceSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  address: z.string().max(500).optional().or(z.null()),
  lat: z.number().min(-90).max(90).optional().or(z.null()),
  lng: z.number().min(-180).max(180).optional().or(z.null()),
  source_url: z.string().url().optional().or(z.null()), // Changed from sourceUrl
  category: z.string().max(50).optional().or(z.null())
})

export const parseGoogleUrlSchema = z.object({
  url: z.string().url()
})

export type CreatePlaceInput = z.infer<typeof createPlaceSchema>
export type UpdatePlaceInput = z.infer<typeof updatePlaceSchema>
export type ParseGoogleUrlInput = z.infer<typeof parseGoogleUrlSchema>

export function ensurePlaceUpdateHasFields(parsed: UpdatePlaceInput) {
    if (Object.values(parsed).every(v => v === undefined)) {
        throw new Error('No updatable fields supplied')
    }
}