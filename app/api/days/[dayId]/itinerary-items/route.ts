// File: app/api/days/[dayId]/itinerary-items/route.ts
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { run, ok, fail } from '@/lib/api/response'
import { requireMembership, requireTripRole } from '@/lib/authz'
import { TripMemberRole } from '@prisma/client'
import { createItineraryItemSchema } from '@/lib/validation/itinerary'
import { getDayItemsWithOverlaps } from '@/lib/itinerary/overlaps'

function mapItem(db: any, overlap?: boolean) {
  return {
    id: db.id,
    tripId: db.trip_id,
    dayId: db.day_id,
    title: db.title,
    description: db.description,
    startTime: db.start_time,
    endTime: db.end_time,
    locationId: db.location_id,
    type: db.type,
    createdBy: db.created_by,
    createdAt: db.created_at,
    overlap: overlap ?? false
  }
}

export const GET = (_req: Request, { params }: { params: { dayId: string } }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')
    const day = await prisma.days.findUnique({ where: { id: params.dayId } })
    if (!day) return fail(404, 'NOT_FOUND', 'Day not found')
    await requireMembership(day.trip_id, session.user.id)

    const items = await getDayItemsWithOverlaps(params.dayId)
    return ok(items.map(i => mapItem(i, i.overlap)))
  })

export const POST = (req: Request, { params }: { params: { dayId: string } }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')
    const day = await prisma.days.findUnique({ where: { id: params.dayId } })
    if (!day) return fail(404, 'NOT_FOUND', 'Day not found')
    await requireTripRole(day.trip_id, session.user.id, TripMemberRole.EDITOR)

    const body = await req.json().catch(() => null)
    if (!body) return fail(400, 'BAD_JSON', 'Invalid JSON')

    const parsed = createItineraryItemSchema.safeParse({ ...body, dayId: params.dayId })
    if (!parsed.success) {
      return fail(400, 'VALIDATION', 'Validation failed', {
        fieldErrors: parsed.error.flatten().fieldErrors
      })
    }
    const data = parsed.data

    const created = await prisma.itinerary_items.create({
      data: {
        id: crypto.randomUUID(),
        trip_id: day.trip_id,
        day_id: data.dayId,
        title: data.title,
        description: data.description,
        type: data.type,
        start_time: data.startTime ? new Date(data.startTime) : null,
        end_time: data.endTime ? new Date(data.endTime) : null,
        location_id: data.locationId || null,
        created_by: session.user.id
      }
    })

    // Recompute full day (single source of truth for overlap flags)
    const items = await getDayItemsWithOverlaps(data.dayId)
    // Find created overlap flag
    const createdWithOverlap = items.find(i => i.id === created.id)
    return ok({
      created: mapItem(created, createdWithOverlap?.overlap),
      items: items.map(i => mapItem(i, i.overlap))
    }, { status: 201 })
  })