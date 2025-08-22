import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { run, ok, fail } from '@/lib/api/response'
import { requireTripRole } from '@/lib/authz'
import { TripMemberRole } from '@prisma/client'
import { updatePlaceSchema, ensurePlaceUpdateHasFields } from '@/lib/validation/places'

// GET endpoint
export const GET = (req: Request, { params }: { params: { id: string } }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    const place = await prisma.places.findUnique({
      where: { id: params.id }
    })
    if (!place) return fail(404, 'NOT_FOUND', 'Place not found')

    await requireTripRole(place.trip_id, session.user.id, TripMemberRole.VIEWER)

    return ok({
      id: place.id,
      tripId: place.trip_id,
      name: place.name,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      sourceUrl: place.source_url,
      category: place.category,
      createdBy: place.created_by_user_id,
      createdAt: place.created_at.toISOString()
    })
  })

// PATCH endpoint
export const PATCH = (req: Request, { params }: { params: { id: string } }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    const place = await prisma.places.findUnique({
      where: { id: params.id }
    })
    if (!place) return fail(404, 'NOT_FOUND', 'Place not found')

    await requireTripRole(place.trip_id, session.user.id, TripMemberRole.EDITOR)

    const body = await req.json().catch(() => null)
    if (!body) return fail(400, 'BAD_JSON', 'Invalid JSON')

    const parsed = updatePlaceSchema.safeParse(body)
    if (!parsed.success) {
      return fail(400, 'VALIDATION', 'Validation failed', {
        fieldErrors: parsed.error.flatten().fieldErrors
      })
    }

    try {
      ensurePlaceUpdateHasFields(parsed.data)
    } catch (e: any) {
      return fail(400, 'NO_FIELDS', e.message)
    }

    const data = parsed.data
    const updated = await prisma.places.update({
      where: { id: params.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.lat !== undefined && { lat: data.lat }),
        ...(data.lng !== undefined && { lng: data.lng }),
        ...(data.source_url !== undefined && { source_url: data.source_url }),
        ...(data.category !== undefined && { category: data.category })
      }
    })

    return ok({
      id: updated.id,
      tripId: updated.trip_id,
      name: updated.name,
      address: updated.address,
      lat: updated.lat,
      lng: updated.lng,
      sourceUrl: updated.source_url,
      category: updated.category,
      createdBy: updated.created_by_user_id,
      createdAt: updated.created_at.toISOString()
    })
  })

// DELETE endpoint
export const DELETE = (req: Request, { params }: { params: { id: string } }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    const place = await prisma.places.findUnique({
      where: { id: params.id }
    })
    if (!place) return fail(404, 'NOT_FOUND', 'Place not found')

    await requireTripRole(place.trip_id, session.user.id, TripMemberRole.EDITOR)

    // Check itinerary references
    const referencedBy = await prisma.itinerary_items.count({
      where: { place_id: params.id }
    })

    if (referencedBy > 0) {
      return fail(409, 'CONFLICT', 'Cannot delete place referenced by itinerary items')
    }

    await prisma.places.delete({
      where: { id: params.id }
    })

    return ok({ deleted: true })
  })