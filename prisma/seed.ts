import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { run, ok, fail } from '@/lib/api/response'
import { requireMembership, requireTripRole } from '@/lib/authz'
import { TripMemberRole } from '@prisma/client'
import { createItineraryItemSchema } from '@/lib/validation/itinerary'
import { getDayItemsWithOverlaps } from '@/lib/itinerary/overlaps'

function toIso(d: Date | null | undefined) {
  return d ? d.toISOString() : null
}

interface DatabaseItem {
  id: string
  trip_id: string
  day: number
  title: string
  description: string | null
  start_time: Date | null
  end_time: Date | null
  location_id: string | null
  type: string
  created_by: string
  created_at: Date
}

function mapItem(db: DatabaseItem, overlap?: boolean) {
  return {
    id: db.id,
    tripId: db.trip_id,
    dayId: db.day.toString(), // Convert day number to string for dayId
    title: db.title,
    description: db.description ?? null,
    startTime: toIso(db.start_time),
    endTime: toIso(db.end_time),
    locationId: db.location_id ?? null,
    type: db.type,
    createdBy: db.created_by,
    createdAt: toIso(db.created_at),
    overlap: overlap ?? false
  }
}

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
    return ok(items.map(i => mapItem(i, i.overlap)))
  })

export const POST = (req: Request, { params }: { params: { dayId: string } }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    // Extract tripId from URL searchParams
    const url = new URL(req.url)
    const tripId = url.searchParams.get('tripId')
    if (!tripId) return fail(400, 'BAD_REQUEST', 'tripId parameter required')

    // Verify trip exists and user has access
    const trip = await prisma.trips.findUnique({
      where: { id: tripId },
      select: { id: true, start_date: true }
    })
    if (!trip) return fail(404, 'NOT_FOUND', 'Trip not found')

    await requireTripRole(tripId, session.user.id, TripMemberRole.EDITOR)

    // Convert dayId string to number
    const dayNumber = parseInt(params.dayId)
    if (isNaN(dayNumber)) return fail(400, 'BAD_REQUEST', 'Invalid day number')

    const body = await req.json().catch(() => null)
    if (!body) return fail(400, 'BAD_JSON', 'Invalid JSON')

    const parsed = createItineraryItemSchema.safeParse({
      ...body,
      dayId: params.dayId
    })
    if (!parsed.success) {
      return fail(400, 'VALIDATION', 'Validation failed', {
        fieldErrors: parsed.error.flatten().fieldErrors
      })
    }
    const data = parsed.data

    const created = await prisma.itinerary_items.create({
      data: {
        trip_id: tripId,
        day: dayNumber, // Use day number directly
        title: data.title,
        description: data.description || null,
        type: data.type,
        start_time: data.startTime ? new Date(data.startTime) : null,
        end_time: data.endTime ? new Date(data.endTime) : null,
        location_id: data.locationId || null,
        created_by: session.user.id
      }
    })

    const items = await getDayItemsWithOverlaps(dayNumber, tripId)
    const createdWithOverlap = items.find(i => i.id === created.id)

    return ok(
      {
        created: mapItem(created, createdWithOverlap?.overlap),
        items: items.map(i => mapItem(i, i.overlap))
      },
      { status: 201 }
    )
  })