import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
    } = body

    // Create location if provided
    let locationId = null
    if (location_name) {
      const location = await prisma.locations.create({
        data: {
          id: `loc-${Date.now()}`, // Generate unique ID
          name: location_name,
          address: location_address || '',
          lat: 0, // Default values - you can update these later
          lng: 0,
          pin_type: 'CUSTOM', // Assuming this is an enum value
          trips: {} // Default empty JSON object
        }
      })
      locationId = location.id
    }

    // Create itinerary item
    const item = await prisma.itinerary_items.create({
      data: {
        title,
        description: description || null,
        day: parseInt(day),
        start_time: start_time ? new Date(start_time) : null,
        end_time: end_time ? new Date(end_time) : null,
        type,
        trip_id,
        location_id: locationId
      },
      include: {
        locations: true
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating itinerary item:', error)
    return NextResponse.json(
      { error: 'Failed to create itinerary item' },
      { status: 500 }
    )
  }
}