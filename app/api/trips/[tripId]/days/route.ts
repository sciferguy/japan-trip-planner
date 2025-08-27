import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { run, ok, fail } from '@/lib/api/response'
import { requireMembership } from '@/lib/authz'

export const GET = async (_req: Request, { params }: { params: Promise<{ tripId: string }> }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')

    const { tripId } = await params
    await requireMembership(tripId, session.user.id)

    const trip = await prisma.trips.findUnique({
      where: { id: tripId },
      select: { start_date: true }
    })
    if (!trip) return fail(404, 'NOT_FOUND', 'Trip not found')

    const days = await prisma.days.findMany({
      where: { trip_id: tripId },
      orderBy: { date: 'asc' as any },
      select: { id: true, date: true }
    })

    const start = new Date(trip.start_date).getTime()
    const data = days.map((d, idx) => ({
      id: d.id,
      date: d.date.toISOString().split('T')[0],
      number: idx + 1
    }))

    return ok(data)
  })
