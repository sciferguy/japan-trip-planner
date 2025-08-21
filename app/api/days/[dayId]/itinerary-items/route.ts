import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { run, ok, fail } from '@/lib/api/response'
import { requireMembership, requireTripRole } from '@/lib/authz'
import { TripMemberRole } from '@prisma/client'
import { createItineraryItemSchema } from '@/lib/validation/itinerary'
import { getDayItemsWithOverlaps } from '@/lib/itinerary/overlaps'
import { toApiItineraryItem } from '@/lib/itinerary/transform'

export const GET = (req: Request, { params }: { params: { dayId: string } }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    // Extract tripId from URL searchParams
    const url = new URL(req.url)
    const tripId = url.searchParams.get('tripId')
    if (!tripId) return fail(400, 'BAD_REQUEST', 'tripId parameter required')

    // Verify trip exists and user has access
    const trip = await prisma.trips.findUnique({ where: { id: tripId } })
    if (!trip) return fail(404, 'NOT_FOUND', 'Trip not found')

    await requireMembership(tripId, session.user.id)

    // Convert dayId string to number for database query
    const dayNumber = parseInt(params.dayId)
    if (isNaN(dayNumber)) return fail(400, 'BAD_REQUEST', 'Invalid day number')

    const items = await getDayItemsWithOverlaps(dayNumber, tripId)
    return ok(items.map(i => toApiItineraryItem(i)))
  })

export const POST = (req: Request, { params }: { params: { dayId: string } }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    const url = new URL(req.url)
    const tripId = url.searchParams.get('tripId')
    if (!tripId) return fail(400, 'BAD_REQUEST', 'tripId parameter required')

    // Verify trip exists and user has access
    const trip = await prisma.trips.findUnique({ where: { id: tripId } })
    if (!trip) return fail(404, 'NOT_FOUND', 'Trip not found')

    await requireTripRole(tripId, session.user.id, TripMemberRole.EDITOR)

    const body = await req.json()
    const parsed = createItineraryItemSchema.safeParse(body)

    if (!parsed.success) {
      return fail(400, 'VALIDATION_ERROR', 'Invalid data', parsed.error.issues)
    }

    const data = parsed.data

    // Use dayId from request body if provided (for day choice modal), otherwise use URL param
    const targetDay = data.dayId ? parseInt(data.dayId) : parseInt(params.dayId)

    if (isNaN(targetDay)) {
      return fail(400, 'BAD_REQUEST', 'Invalid day number')
    }

    // Validate day is within trip duration
    const tripDuration = Math.ceil((trip.end_date.getTime() - trip.start_date.getTime()) / (1000 * 60 * 60 * 24)) + 1
    if (targetDay < 1 || targetDay > tripDuration) {
      return fail(400, 'INVALID_DAY', `Day must be between 1 and ${tripDuration}`)
    }

    // Validate location belongs to trip if provided
    if (data.locationId) {
      const location = await prisma.locations.findFirst({
        where: {
          id: data.locationId,
          trip_id: tripId
        }
      })

      if (!location) {
        return fail(400, 'INVALID_LOCATION', 'Location does not belong to this trip')
      }
    }

    const created = await prisma.itinerary_items.create({
      data: {
        trip_id: tripId,
        day: targetDay, // Use the calculated target day
        title: data.title,
        description: data.description,
        type: data.type,
        start_time: data.startTime ? new Date(data.startTime) : null,
        end_time: data.endTime ? new Date(data.endTime) : null,
        location_id: data.locationId,
        created_by: session.user.id
      }
    })

    // Get updated items for the target day to return with overlaps calculated
    const items = await getDayItemsWithOverlaps(targetDay, tripId)

    return ok({
      created: toApiItineraryItem(created),
      items: items.map(i => toApiItineraryItem(i))
    })
  })