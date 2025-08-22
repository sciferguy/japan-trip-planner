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
  day_id: string
  title: string
  note: string | null
  start_time: Date | null
  end_time: Date | null
  place_id: string | null
  type: string
  created_by_user_id: string
  created_at: Date
  overlap: boolean
}

function mapItem(db: DatabaseItem) {
  return {
    id: db.id,
    tripId: '', // Will need to be populated from day relation
    dayId: db.day_id,
    title: db.title,
    description: db.note ?? null,
    startTime: toIso(db.start_time),
    endTime: toIso(db.end_time),
    locationId: db.place_id ?? null,
    type: db.type,
    createdBy: db.created_by_user_id,
    createdAt: toIso(db.created_at),
    overlap: db.overlap
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
    return ok(items.map(i => mapItem(i)))
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
        day_id: params.dayId,
        title: data.title,
        note: data.description || null,
        type: data.type,
        start_time: data.startTime ? new Date(data.startTime) : null,
        end_time: data.endTime ? new Date(data.endTime) : null,
        place_id: data.locationId || null,
        created_by_user_id: session.user.id
      }
    })

    const items = await getDayItemsWithOverlaps(params.dayId)

    return ok(
      {
        created: mapItem({ ...created, overlap: false }),
        items: items.map(i => mapItem(i))
      },
      { status: 201 }
    )
  })