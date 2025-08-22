// app/api/places/route.ts
import { run, ok, fail } from '@/lib/api/response'
import { getSessionUser, requireTripRole } from '@/lib/authz'
import { createPlaceSchema } from '@/lib/validation/places'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'

export const GET = (req: Request) =>
  run(async () => {
    const user = await getCurrentUser()
    const url = new URL(req.url)
    const tripId = url.searchParams.get('tripId')

    if (!tripId) {
      return fail(400, 'MISSING_TRIP_ID', 'tripId query parameter is required')
    }

    await requireTripRole(user.id, tripId, 'VIEWER')

    const places = await prisma.places.findMany({
      where: { trip_id: tripId },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        name: true,
        address: true,
        lat: true,
        lng: true,
        source_url: true,
        category: true,
        created_at: true,
        created_by_user_id: true
      }
    })

    return ok(places)
  })

export const POST = (req: Request) =>
  run(async () => {
    const user = await getCurrentUser()
    const url = new URL(req.url)
    const tripId = url.searchParams.get('tripId')

    if (!tripId) {
      return fail(400, 'MISSING_TRIP_ID', 'tripId query parameter is required')
    }

    await requireTripRole(user.id, tripId, 'EDITOR')

    const body = await req.json().catch(() => null)
    if (!body) return fail(400, 'BAD_JSON', 'Invalid JSON')

    const parsed = createPlaceSchema.safeParse(body)
    if (!parsed.success) {
      return fail(400, 'VALIDATION', 'Validation failed', {
        fieldErrors: parsed.error.flatten().fieldErrors
      })
    }

    const place = await prisma.places.create({
      data: {
        ...parsed.data,
        trip_id: tripId,
        created_by_user_id: user.id
      },
      select: {
        id: true,
        name: true,
        address: true,
        lat: true,
        lng: true,
        source_url: true,
        category: true,
        created_at: true,
        created_by_user_id: true
      }
    })

    return ok(place)
  })