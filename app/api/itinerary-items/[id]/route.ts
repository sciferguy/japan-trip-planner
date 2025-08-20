import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.itinerary_items.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting itinerary item:', error)
    return NextResponse.json(
      { error: 'Failed to delete itinerary item' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      location_name,
      location_address
    } = body

    // Get current item to check for existing location
    const currentItem = await prisma.itinerary_items.findUnique({
      where: { id: params.id },
      include: { locations: true }
    })

    if (!currentItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    let locationId = currentItem.location_id

    // Handle location updates
    if (location_name) {
      if (currentItem.locations) {
        // Update existing location
        await prisma.locations.update({
          where: { id: currentItem.locations.id },
          data: {
            name: location_name,
            address: location_address || '',
          }
        })
      } else {
        // Create new location with all required fields
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
    } else if (currentItem.locations) {
      // Remove location if name is empty
      await prisma.locations.delete({
        where: { id: currentItem.locations.id }
      })
      locationId = null
    }

    // Update itinerary item
    const updatedItem = await prisma.itinerary_items.update({
      where: { id: params.id },
      data: {
        title,
        description: description || null,
        day: parseInt(day),
        start_time: start_time ? new Date(start_time) : null,
        end_time: end_time ? new Date(end_time) : null,
        type,
        location_id: locationId
      },
      include: {
        locations: true
      }
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating itinerary item:', error)
    return NextResponse.json(
      { error: 'Failed to update itinerary item' },
      { status: 500 }
    )
  }
}