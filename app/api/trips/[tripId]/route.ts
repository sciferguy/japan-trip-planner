import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const resolvedParams = await params
  const { tripId } = resolvedParams
  
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const trip = await prisma.trips.findFirst({
      where: {
        id: tripId,
        OR: [
          { created_by: session.user.id },
          { trip_members: { some: { user_id: session.user.id } } }
        ]
      },
      include: {
        days: true,
        itinerary_items: {
          include: {
            day: true,
            place: true
          },
          orderBy: [
            { day: { date: 'asc' } },
            { start_time: 'asc' },
            { created_at: 'asc' }
          ]
        }
      }
    })
    
    if (!trip) {
      return NextResponse.json({ ok: false, error: 'Trip not found' }, { status: 404 })
    }
    
    // Transform the trip data to match frontend expectations
    const transformedTrip = {
      ...trip,
      itinerary_items: trip.itinerary_items.map((item) => {
        const tripStart = new Date(trip.start_date)
        const itemDate = new Date(item.day.date)
        const dayNumber = Math.ceil((itemDate.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
        
        return {
          id: item.id,
          tripId: trip.id,
          dayId: item.day_id,
          day: dayNumber,
          title: item.title,
          description: item.note,
          startTime: item.start_time ? item.start_time.toISOString() : null,
          endTime: item.end_time ? item.end_time.toISOString() : null,
          locationId: item.place_id,
          type: item.type,
          createdBy: item.created_by_user_id,
          createdAt: item.created_at.toISOString(),
          overlap: false
        }
      })
    }
    
    return NextResponse.json({ ok: true, data: transformedTrip })
  } catch (error) {
    console.error('Failed to fetch trip:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch trip' },
      { status: 500 }
    )
  }
}