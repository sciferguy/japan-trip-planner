import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { run, ok, fail } from '@/lib/api/response'
import { requireMembership } from '@/lib/authz'

export const PUT = async (req: Request, { params }: { params: Promise<{ dayId: string }> }) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) return fail(401, 'UNAUTH', 'Unauthorized')
    
    const { dayId } = await params
    const body = await req.json().catch(() => null)
    if (!body?.itemIds) return fail(400, 'BAD_REQUEST', 'Item IDs required')
    
    const day = await prisma.days.findUnique({
      where: { id: dayId },
      select: { trip_id: true }
    })
    
    if (!day) return fail(404, 'NOT_FOUND', 'Day not found')
    await requireMembership(day.trip_id, session.user.id)
    
    const updates = body.itemIds.map((id: string, index: number) => 
      prisma.itinerary_items.update({
        where: { id },
        data: { sort_order: index } as any
      })
    )
    
    await prisma.$transaction(updates)
    
    const items = await prisma.itinerary_items.findMany({
      where: { day_id: dayId },
      orderBy: { sort_order: 'asc' } as any
    })
    
    const transformed = items.map((item: any) => ({
      id: item.id,
      dayId: item.day_id,
      title: item.title,
      description: item.note,
      startTime: item.start_time?.toISOString() || null,
      endTime: item.end_time?.toISOString() || null,
      type: item.type,
      locationId: item.place_id
    }))
    
    return ok({ items: transformed })
  })