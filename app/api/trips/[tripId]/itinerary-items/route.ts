import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { run, ok, fail } from '@/lib/api/response'
import { requireMembership } from '@/lib/authz'

export const GET = async (req: Request, { params }: { params: Promise<{ tripId: string }> }) =>
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
    
    const items = await prisma.itinerary_items.findMany({
      where: { trip_id: tripId },
      include: {
        day: true,
        place: true
      },
      orderBy: [
        { day: { date: 'asc' } },
        { start_time: 'asc' }
      ]
    })
    
    // Transform items to match frontend expectations
    const transformed = items.map(item => {
      const dayNumber = Math.ceil(
        (new Date(item.day.date).getTime() - new Date(trip.start_date).getTime()) / 
        (1000 * 60 * 60 * 24)
      ) + 1
      
      return {
        id: item.id,
        tripId: item.trip_id,
        dayId: item.day_id,
        day: dayNumber,
        title: item.title,
        description: item.note,
        startTime: item.start_time?.toISOString() || null,
        endTime: item.end_time?.toISOString() || null,
        locationId: item.place_id,
        type: item.type,
        createdBy: item.created_by_user_id,
        createdAt: item.created_at.toISOString()
      }
    })
    
    return ok(transformed)
  })