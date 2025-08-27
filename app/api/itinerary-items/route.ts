import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { run, ok, fail } from '@/lib/api/response'
import { requireTripRole } from '@/lib/authz'
import { TripMemberRole } from '@prisma/client'
import { createItineraryItemSchema } from '@/lib/validation/itinerary'
import { getDayItemsWithOverlaps } from '@/lib/itinerary/overlaps'

function mapItem(db: any, overlap?: boolean) {
  return {
    id: db.id,
    tripId: db.tripsId,                    // ✅ Use Prisma-generated field name
    dayId: db.daysId,                      // ✅ Use Prisma-generated field name
    placeId: db.placesId,                  // ✅ Use Prisma-generated field name
    title: db.title,
    description: db.description,
    startTime: db.startTime?.toISOString() || null,
    endTime: db.endTime?.toISOString() || null,
    type: db.type,
    createdBy: db.createdByUserId,
    createdAt: db.createdAt?.toISOString(),
    overlap: overlap ?? false
  }
}

export const POST = (req: NextRequest) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    const body = await req.json().catch(() => null)
    if (!body) return fail(400, 'BAD_JSON', 'Invalid JSON')

    const parsed = createItineraryItemSchema.safeParse(body)
    if (!parsed.success) {
      return fail(400, 'VALIDATION', 'Validation failed', {
        fieldErrors: parsed.error.flatten().fieldErrors
      })
    }

    const data = parsed.data

    // Ensure dayId is provided
    if (!data.dayId) return fail(400, 'MISSING_DAY', 'dayId is required')

    // Verify day exists and get trip context
    const day = await prisma.days.findUnique({ where: { id: data.dayId } })
    if (!day) return fail(404, 'DAY_NOT_FOUND', 'Day not found')

    // Check trip permissions
    await requireTripRole(day.trip_id, session.user.id, TripMemberRole.EDITOR)

    // Create the new itinerary item using camelCase field names (Prisma Client interface)
    const created = await prisma.itinerary_items.create({
      data: {
        trip_id: day.trip_id,                    // camelCase for Prisma Client
        day_id: data.dayId,                      // camelCase for Prisma Client
        place_id: data.locationId || null,       // camelCase for Prisma Client
        title: data.title,
        description: data.description || null,
        start_time: data.startTime ? new Date(data.startTime) : null,     // camelCase
        end_time: data.endTime ? new Date(data.endTime) : null,           // camelCase
        type: data.type,
        created_by_user_id: session.user.id        // camelCase for Prisma Client
      }
    })

    // Recompute overlaps for the day
    const dayItems = await getDayItemsWithOverlaps(data.dayId)
    const items = dayItems.map(item => mapItem(item, item.overlap))

    return ok({
      created: mapItem(created),
      dayId: data.dayId,
      items
    })
  })

export const GET = (req: NextRequest) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    const url = new URL(req.url)
    const dayId = url.searchParams.get('dayId')

    if (!dayId) return fail(400, 'MISSING_DAY', 'dayId parameter required')

    // Verify day exists and check permissions
    const day = await prisma.days.findUnique({ where: { id: dayId } })
    if (!day) return fail(404, 'DAY_NOT_FOUND', 'Day not found')

    await requireTripRole(day.trip_id, session.user.id, TripMemberRole.VIEWER)

    const dayItems = await getDayItemsWithOverlaps(dayId)
    const items = dayItems.map(item => mapItem(item, item.overlap))

    return ok({ items })
  })