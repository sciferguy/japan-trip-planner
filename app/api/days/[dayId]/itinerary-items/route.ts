import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { run, ok, fail } from '@/lib/api/response'
import { requireMembership, requireTripRole } from '@/lib/authz'
import { TripMemberRole } from '@prisma/client'
import { createItineraryItemSchema } from '@/lib/validation/itinerary'
import { getDayItemsWithOverlaps } from '@/lib/itinerary/overlaps'

// Transform function to convert database item to API format
function toApiItineraryItem(item: any) {
  return {
    id: item.id,
    tripId: item.tripsId || '', // Handle optional trip relation
    dayId: item.day_id,
    day: 1, // Default value, calculate properly if needed
    title: item.title,
    description: item.note,
    startTime: item.start_time?.toISOString() || null,
    endTime: item.end_time?.toISOString() || null,
    locationId: item.place_id,
    type: item.type,
    createdBy: item.created_by_user_id,
    createdAt: item.created_at.toISOString(),
    overlap: item.overlap || false
  }
}

export const GET = (req: Request, { params }: { params: { dayId: string } }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    // Verify day exists and get trip info
    const day = await prisma.days.findUnique({
      where: { id: params.dayId },
      include: { trip: true }
    })
    if (!day) return fail(404, 'NOT_FOUND', 'Day not found')

    await requireMembership(day.trip_id, session.user.id)

    const items = await getDayItemsWithOverlaps(params.dayId)
    return ok(items.map(i => toApiItineraryItem(i)))
  })

export const POST = (req: Request, { params }: { params: { dayId: string } }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    // Verify day exists and get trip info
    const day = await prisma.days.findUnique({
      where: { id: params.dayId },
      include: { trip: true }
    })
    if (!day) return fail(404, 'NOT_FOUND', 'Day not found')

    await requireTripRole(day.trip_id, session.user.id, TripMemberRole.EDITOR)

    const body = await req.json()
    const parsed = createItineraryItemSchema.safeParse(body)

    if (!parsed.success) {
      return fail(400, 'VALIDATION_ERROR', 'Invalid data', parsed.error.issues)
    }

    const data = parsed.data

    // Use dayId from request body if provided, otherwise use URL param
    const targetDayId = data.dayId || params.dayId

    // Verify target day exists and belongs to same trip
    const targetDay = await prisma.days.findUnique({
      where: { id: targetDayId }
    })

    if (!targetDay || targetDay.trip_id !== day.trip_id) {
      return fail(400, 'INVALID_DAY', 'Invalid day for this trip')
    }

    // Validate place belongs to trip if provided
    if (data.locationId) {
      const place = await prisma.places.findFirst({
        where: {
          id: data.locationId,
          trip_id: day.trip_id
        }
      })

      if (!place) {
        return fail(400, 'INVALID_LOCATION', 'Place does not belong to this trip')
      }
    }

    const created = await prisma.itinerary_items.create({
      data: {
        day_id: targetDayId, // Use direct field assignment
        title: data.title,
        note: data.description,
        type: data.type,
        start_time: data.startTime ? new Date(data.startTime) : null,
        end_time: data.endTime ? new Date(data.endTime) : null,
        place_id: data.locationId || null, // Use direct field assignment
        created_by_user_id: session.user.id // Use direct field assignment
      }
    })

    // Get updated items for the target day to return with overlaps calculated
    const items = await getDayItemsWithOverlaps(targetDayId)

    return ok({
      created: toApiItineraryItem({ ...created, overlap: false }), // Add overlap field
      items: items.map(i => toApiItineraryItem(i))
    })
  })