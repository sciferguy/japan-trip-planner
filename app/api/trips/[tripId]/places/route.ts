// app/api/trips/[tripId]/places/route.ts
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { run, ok, fail } from '@/lib/api/response'
import { requireMembership, requireTripRole } from '@/lib/authz'
import { TripMemberRole } from '@prisma/client'
import { createPlaceSchema } from '@/lib/validation/places'

export const GET = (req: Request, { params }: { params: { tripId: string } }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    await requireMembership(params.tripId, session.user.id)

    const places = await prisma.places.findMany({
      where: { trip_id: params.tripId },
      orderBy: { created_at: 'desc' }
    })

    return ok(places.map(place => ({
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
    })))
  })

export const POST = (req: Request, { params }: { params: { tripId: string } }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    await requireTripRole(params.tripId, session.user.id, TripMemberRole.EDITOR)

    const body = await req.json().catch(() => null)
    if (!body) return fail(400, 'BAD_JSON', 'Invalid JSON')

    const parsed = createPlaceSchema.safeParse(body)
    if (!parsed.success) {
      return fail(400, 'VALIDATION', 'Validation failed', {
        fieldErrors: parsed.error.flatten().fieldErrors
      })
    }
    const data = parsed.data

      const created = await prisma.places.create({
          data: {
              trip_id: params.tripId,
              name: data.name,
              address: data.address || null,
              lat: data.lat || null,
              lng: data.lng || null,
              source_url: data.source_url || null, // Changed from sourceUrl
              category: data.category || null,
              created_by_user_id: session.user.id
          }
      })

    return ok(
      {
        id: created.id,
        tripId: created.trip_id,
        name: created.name,
        address: created.address,
        lat: created.lat,
        lng: created.lng,
        sourceUrl: created.source_url,
        category: created.category,
        createdBy: created.created_by_user_id,
        createdAt: created.created_at.toISOString()
      },
      { status: 201 }
    )
  })