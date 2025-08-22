import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { run, ok, fail } from '@/lib/api/response'
import { requireTripRole } from '@/lib/authz'
import { TripMemberRole } from '@prisma/client'
import { updateItineraryItemSchema, ensureUpdateHasFields } from '@/lib/validation/itinerary'

export const PATCH = (req: Request, { params }: { params: { dayId: string; itemId: string } }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    // Verify item exists and get trip info
    const item = await prisma.itinerary_items.findUnique({
      where: { id: params.itemId },
      include: { day: { include: { trip: true } } }
    })
    if (!item) return fail(404, 'NOT_FOUND', 'Item not found')

    await requireTripRole(item.day.trip_id, session.user.id, TripMemberRole.EDITOR)

    const body = await req.json()
    const parsed = updateItineraryItemSchema.safeParse(body)

    if (!parsed.success) {
      return fail(400, 'VALIDATION_ERROR', 'Invalid data', parsed.error.issues)
    }

    const data = parsed.data
    ensureUpdateHasFields(data)

    // Handle day change if provided
    if (data.dayId && data.dayId !== item.day_id) {
      const targetDay = await prisma.days.findUnique({
        where: { id: data.dayId }
      })
      if (!targetDay || targetDay.trip_id !== item.day.trip_id) {
        return fail(400, 'INVALID_DAY', 'Invalid day for this trip')
      }
    }

    // Validate place belongs to trip if provided
    if (data.locationId) {
      const place = await prisma.places.findFirst({
        where: {
          id: data.locationId,
          trip_id: item.day.trip_id
        }
      })
      if (!place) {
        return fail(400, 'INVALID_LOCATION', 'Place does not belong to this trip')
      }
    }

    const updated = await prisma.itinerary_items.update({
      where: { id: params.itemId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { note: data.description }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.startTime !== undefined && { start_time: data.startTime ? new Date(data.startTime) : null }),
        ...(data.endTime !== undefined && { end_time: data.endTime ? new Date(data.endTime) : null }),
        ...(data.locationId !== undefined && { place_id: data.locationId }),
        ...(data.dayId !== undefined && { day_id: data.dayId })
      }
    })

    return ok({ id: updated.id, message: 'Item updated successfully' })
  })