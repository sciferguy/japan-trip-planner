// app/api/itinerary-items/[id]/route.ts
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

function toIso(d: Date | null | undefined) {
  return d ? d.toISOString() : null
}

function mapItem(db: any, overlap?: boolean) {
  return {
    id: db.id,
    tripId: db.trip_id,
    dayId: db.day_id,
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

export const PATCH = (req: Request, { params }: { params: { id: string } }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    const item = await prisma.itinerary_items.findUnique({ where: { id: params.id } })
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
      return fail(400, 'NO_FIELDS', 'No fields to update')
    }

    if (data.dayId) {
      const newDay = await prisma.days.findUnique({ where: { id: data.dayId } })
      if (!newDay) return fail(404, 'DAY_NOT_FOUND', 'dayId not found')
      if (newDay.trip_id !== item.trip_id) {
        return fail(400, 'CROSS_TRIP', 'Cannot move item to day of different trip')
      }
    }

    const updated = await prisma.itinerary_items.update({
      where: { id: item.id },
      data: {
        title: data.title ?? undefined,
        description: data.description !== undefined ? data.description : undefined,
        type: data.type ?? undefined,
        start_time: data.startTime
          ? new Date(data.startTime)
          : (data.startTime === null ? null : undefined),
        end_time: data.endTime
          ? new Date(data.endTime)
          : (data.endTime === null ? null : undefined),
        location_id: data.locationId !== undefined ? (data.locationId || null) : undefined,
        day_id: data.dayId ?? undefined
      }
    })

    const affectedDayIds = new Set<string>()
    if (item.day_id) affectedDayIds.add(item.day_id)
    if (updated.day_id) affectedDayIds.add(updated.day_id)

    const dayLists: Record<string, any[]> = {}
    for (const dId of affectedDayIds) {
      const list = await getDayItemsWithOverlaps(dId)
      dayLists[dId] = list.map(i => mapItem(i, i.overlap))
    }

    // Overlap flag for updated
    const updatedOverlap = updated.day_id
      ? (dayLists[updated.day_id].find(i => i.id === updated.id)?.overlap ?? false)
      : false

    return ok({
      updated: mapItem(updated, updatedOverlap),
      days: dayLists
    })
  })

export const DELETE = (_req: Request, { params }: { params: { id: string } }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    const item = await prisma.itinerary_items.findUnique({ where: { id: params.id } })
    if (!item) return fail(404, 'NOT_FOUND', 'Item not found')

    await requireTripRole(item.trip_id, session.user.id, TripMemberRole.EDITOR)

    const dayId = item.day_id
    await prisma.itinerary_items.delete({ where: { id: item.id } })

    let items: any[] = []
    if (dayId) {
      const list = await getDayItemsWithOverlaps(dayId)
      items = list.map(i => mapItem(i, i.overlap))
    }

    return ok({
      deletedId: item.id,
      dayId,
      items
    })
  })