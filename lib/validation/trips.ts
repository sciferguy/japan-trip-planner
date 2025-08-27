import { z } from 'zod'

export const createTripSchema = z.object({
  title: z.string().min(1, 'Trip title is required').max(100, 'Title too long'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid start date format'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid end date format')
}).refine((data) => {
  const start = new Date(data.start_date)
  const end = new Date(data.end_date)
  return end >= start
}, {
  message: 'End date must be after or equal to start date',
  path: ['end_date']
}).refine((data) => {
  const start = new Date(data.start_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return start >= today
}, {
  message: 'Start date cannot be in the past',
  path: ['start_date']
})

export const updateTripSchema = createTripSchema.partial()

export type CreateTripInput = z.infer<typeof createTripSchema>
export type UpdateTripInput = z.infer<typeof updateTripSchema>