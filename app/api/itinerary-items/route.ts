// app/api/itinerary-items/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// (Optional) simple runtime validation without extra deps
function toNumber(val: unknown, field: string): number {
  const n = Number(val)
  if (!Number.isFinite(n)) throw new Error(`Invalid ${field}`)
  return n
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId =
      // adjust according to your auth shape
      (session.user as any).id ||
      (session.user as any).sub ||
      session.user.email

    if (!userId) {
      return NextResponse.json({ error: 'Missing user id' }, { status: 400 })
    }

    const body = await request.json()

    const {
      title,
      description,
      day,
      start_time,
      end_time,
      type,
      trip_id,
      location_name,
      location_address
    } = body || {}

    if (!title || !type || !trip_id || day == null) {
      return NextResponse.json(
        { error: 'Missing required fields (title, type, trip_id, day)' },
        { status: 400 }
      )
    }

    const numericDay = toNumber(day, 'day')

    // Optional: enforce allowed enum values (adjust list to your schema)
    const allowedTypes = [
      'ACTIVITY',
      'TRANSPORT',
      'MEAL',
      'ACCOMMODATION',
      'MEETING',
      'FREE_TIME'
    ]
    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    let locationId: string | null = null
    if (location_name) {
      const location = await prisma.locations.create({
        data: {
          id: `loc-${Date.now()}`,
            // If your schema requires created_by for locations add it here similarly
          name: location_name,
          address: location_address || '',
          lat: 0,
          lng: 0,
          pin_type: 'CUSTOM',
          trips: {} // adjust/remove if schema differs
        }
      })
      locationId = location.id
    }

    const item = await prisma.itinerary_items.create({
      data: {
        title,
        description: description ? String(description) : null,
        day: numericDay,
        start_time: start_time ? new Date(start_time) : null,
        end_time: end_time ? new Date(end_time) : null,
        type,
        trip_id: String(trip_id),
        location_id: locationId,
        created_by: userId
      },
      include: {
        locations: true
      }
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error: any) {
    console.error('Error creating itinerary item:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to create itinerary item'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}