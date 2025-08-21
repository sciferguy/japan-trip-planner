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
  dayId: z.string().min(1).optional()
})
    .refine(d => !!d.dayId, { path: ['dayId'], message: 'dayId required' })
    .superRefine((data, ctx) => {
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
  title: baseFields.title.optional(),
  description: baseFields.description,
  type: baseFields.type.optional(),
  startTime: baseFields.startTime.or(z.null()).optional(),
  endTime: baseFields.endTime.or(z.null()).optional(),
  locationId: baseFields.locationId.or(z.null()),
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