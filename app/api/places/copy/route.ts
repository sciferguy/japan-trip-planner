import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { run, ok, fail } from '@/lib/api/response'
import { requireTripRole } from '@/lib/authz'
import { TripMemberRole } from '@prisma/client'

export const POST = (req: Request) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    const body = await req.json().catch(() => null)
    if (!body) return fail(400, 'BAD_JSON', 'Invalid JSON')

    const { sourcePlaceId, targetTripId } = body
    if (!sourcePlaceId || !targetTripId) {
      return fail(400, 'MISSING_FIELDS', 'sourcePlaceId and targetTripId are required')
    }

    await requireTripRole(targetTripId, session.user.id, TripMemberRole.EDITOR)

    const source = await prisma.places.findUnique({ where: { id: sourcePlaceId } })
    if (!source) return fail(404, 'NOT_FOUND', 'Source place not found')

    if (source.trip_id === targetTripId) {
      return ok({ newPlaceId: source.id })
    }

    const existing = await prisma.places.findFirst({
      where: { trip_id: targetTripId, name: source.name },
      select: { id: true }
    })
    if (existing) {
      return ok({ newPlaceId: existing.id })
    }

    const created = await prisma.places.create({
      data: {
        trip_id: targetTripId,
        name: source.name,
        address: source.address,
        lat: source.lat,
        lng: source.lng,
        source_url: source.source_url,
        category: source.category,
        created_by_user_id: session.user.id
      },
      select: { id: true }
    })

    return ok({ newPlaceId: created.id })
  })