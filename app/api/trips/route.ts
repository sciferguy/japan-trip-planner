import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createTripSchema } from '@/lib/validation/trips'
import { addDays } from 'date-fns'
import { TripMemberRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    console.log('Getting session...')
    const session = await auth()
    console.log('Session:', session)

    if (!session?.user?.id) {
      console.log('No session or user ID')
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const trips = await prisma.trips.findMany({  // Fixed: trips (plural)
      where: {
        created_by: session.user.id
      },
      orderBy: {
        start_date: 'asc'
      }
    })

    return NextResponse.json({
      ok: true,  // Fixed: changed back to 'ok' for consistency with your frontend
      data: trips  // Fixed: return trips (not trip)
    })

  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch trips' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Getting request body...')
    const body = await request.json().catch(() => null)
    console.log('Body:', body)
    if (!body) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
    }

    const parsed = createTripSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        ok: false,
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors
      }, { status: 400 })
    }

    const { title, start_date, end_date } = parsed.data

    console.log('Session user ID:', session?.user?.id)

    // Create trip
    const trip = await prisma.trips.create({
      data: {
        title,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        created_by: session.user.id
      }
    })

    // Auto-generate days for the trip
    const days = [] as Array<{ trip_id: string; date: Date }>
    const startDate = new Date(start_date)
    const endDate = new Date(end_date)

    let currentDate = startDate
    while (currentDate <= endDate) {
      days.push({
        trip_id: trip.id,
        date: new Date(currentDate),
      })
      currentDate = addDays(currentDate, 1)
    }

    if (days.length > 0) {
      await prisma.days.createMany({
        data: days
      })
    }

    // Ensure creator is a member of the trip (prevents 403 on access)
    await prisma.trip_members.create({
      data: {
        trip_id: trip.id,
        user_id: session.user.id,
        role: TripMemberRole.OWNER
      }
    })

    return NextResponse.json({
      ok: true,
      data: trip
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating trip:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to create trip' },
      { status: 500 }
    )
  }
}