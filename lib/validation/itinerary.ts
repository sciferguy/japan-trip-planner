// lib/validation/itinerary.ts
import { z } from 'zod'
import { ItineraryItemType } from '@prisma/client'

const isoDate = () => z.string().datetime({ offset: true })

// Common base (client sends ISO strings; route layer will convert to Date before DB write)
const baseFields = {
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().or(z.literal('').transform(() => undefined)),
  type: z.nativeEnum(ItineraryItemType),
  startTime: isoDate().optional(),
  endTime: isoDate().optional(),
  locationId: z.string().min(1).optional(),
  dayId: z.string().min(1).optional() // may come from path instead
}

export const createItineraryItemSchema = z.object({
  ...baseFields,
  dayId: z.string().min(1) // required for creation (will usually be injected from route param)
}).superRefine((data, ctx) => {
  if (data.startTime && data.endTime) {
    if (new Date(data.startTime) >= new Date(data.endTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'endTime must be after startTime'
      })
    }
  }
})

export const updateItineraryItemSchema = z.object({
  // All optional; at least one key must be present (enforced manually)
  title: baseFields.title.optional(),
  description: baseFields.description,
  type: baseFields.type.optional(),
  startTime: baseFields.startTime,
  endTime: baseFields.endTime,
  locationId: baseFields.locationId,
  dayId: baseFields.dayId
}).superRefine((data, ctx) => {
  if (data.startTime && data.endTime) {
    if (new Date(data.startTime) >= new Date(data.endTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'endTime must be after startTime'
      })
    }
  }
})

export type CreateItineraryItemInput = z.infer<typeof createItineraryItemSchema>
export type UpdateItineraryItemInput = z.infer<typeof updateItineraryItemSchema>

export function ensureUpdateHasFields(parsed: UpdateItineraryItemInput) {
  if (Object.values(parsed).every(v => v === undefined)) {
    throw new Error('No updatable fields supplied')
  }
}