import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { run, ok, fail } from '@/lib/api/response'
import { requireTripRole } from '@/lib/authz'
import { TripMemberRole } from '@prisma/client'
import {
  updateItineraryItemSchema,
  ensureUpdateHasFields
} from '@/lib/validation/itinerary'
import { getDayItemsWithOverlaps } from '@/lib/itinerary/overlaps'

function mapItem(db: any, overlap?: boolean) {
  return {
    id: db.id,
    tripId: db.trip_id,
    dayId: db.day_id,
    placeId: db.place_id,
    title: db.title,
    description: db.note ?? null,
    startTime: db.start_time?.toISOString() || null,
    endTime: db.end_time?.toISOString() || null,
    type: db.type,
    createdBy: db.created_by_user_id,
    createdAt: db.created_at?.toISOString(),
    overlap: overlap ?? false
  }
}

export const PATCH = async (req: Request, { params }: { params: Promise<{ id: string }> }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    const { id } = await params  // Await params per Next.js 15 requirements
    
    const item = await prisma.itinerary_items.findUnique({ where: { id } })
    if (!item) return fail(404, 'NOT_FOUND', 'Item not found')

    await requireTripRole(item.trip_id, session.user.id, TripMemberRole.EDITOR)

    const body = await req.json().catch(() => null)
    if (!body) return fail(400, 'BAD_JSON', 'Invalid JSON')

    const parsed = updateItineraryItemSchema.safeParse(body)
    if (!parsed.success) {
      return fail(400, 'VALIDATION', 'Validation failed', {
        fieldErrors: parsed.error.flatten().fieldErrors
      })
    }

    const data = parsed.data
    try {
      ensureUpdateHasFields(data)
    } catch {
      return fail(400, 'NO_FIELDS', 'No updatable fields provided')
    }

    // Validate move across days
    if (data.dayId) {
      const targetDay = await prisma.days.findUnique({ where: { id: data.dayId } })
      if (!targetDay) return fail(404, 'DAY_NOT_FOUND', 'Target day not found')

      // Ensure day belongs to same trip
      if (targetDay.trip_id !== item.trip_id) {
        return fail(400, 'CROSS_TRIP_MOVE', 'Cannot move item across trips')
      }
    }

    const updated = await prisma.itinerary_items.update({
      where: { id },
      data: {
        // Use snake_case for database fields per your schema
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { note: data.description }),
        ...(data.type && { type: data.type }),
        ...(data.startTime !== undefined && {
          start_time: data.startTime ? new Date(data.startTime) : null
        }),
        ...(data.endTime !== undefined && {
          end_time: data.endTime ? new Date(data.endTime) : null
        }),
        ...(data.locationId !== undefined && { place_id: data.locationId }),
        ...(data.dayId && { day_id: data.dayId })
      }
    })

    const affectedDayIds = new Set<string>()
    if (item.day_id) affectedDayIds.add(item.day_id)
    if (updated.day_id) affectedDayIds.add(updated.day_id)

    const dayLists: Record<string, any[]> = {}
    for (const dId of affectedDayIds) {
      const dayItems = await getDayItemsWithOverlaps(dId)
      dayLists[dId] = dayItems.map(item => mapItem(item, item.overlap))
    }

    return ok({
      updated: mapItem(updated),
      days: dayLists  // Rename to match what the frontend expects
    })
  })

export const DELETE = async (_req: Request, { params }: { params: Promise<{ id: string }> }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    const { id } = await params  // Await params per Next.js 15 requirements
    
    const item = await prisma.itinerary_items.findUnique({ where: { id } })
    if (!item) return fail(404, 'NOT_FOUND', 'Item not found')

    await requireTripRole(item.trip_id, session.user.id, TripMemberRole.EDITOR)

    const dayId = item.day_id
    await prisma.itinerary_items.delete({ where: { id: item.id } })

    let items: any[] = []
    if (dayId) {
      const dayItems = await getDayItemsWithOverlaps(dayId)
      items = dayItems.map(item => mapItem(item, item.overlap))
    }

    return ok({
      deletedId: item.id,
      dayId,
      items
    })
  })