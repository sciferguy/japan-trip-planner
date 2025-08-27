import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { run, ok, fail } from '@/lib/api/response'

export const GET = (req: Request) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    const url = new URL(req.url)
    const q = (url.searchParams.get('q') || '').trim()
    const tripId = url.searchParams.get('tripId')
    const group = url.searchParams.get('group') === '1'

    if (!q) {
      return ok(group ? { thisTrip: [], otherTrips: [] } : [])
    }

    const results = await prisma.places.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { address: { contains: q, mode: 'insensitive' as const } }
        ]
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        address: true,
        lat: true,
        lng: true,
        source_url: true,
        category: true,
        trip_id: true,
        created_at: true
      },
      take: 50
    })

    if (!tripId) {
      return ok(results)
    }

    if (!group) {
      return ok(results.filter(r => r.trip_id === tripId))
    }

    const thisTrip = results.filter(r => r.trip_id === tripId)
    const otherTrips = results.filter(r => r.trip_id !== tripId)
    return ok({ thisTrip, otherTrips })
  })

