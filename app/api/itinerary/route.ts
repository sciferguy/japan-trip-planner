import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const UpdateItineraryItemSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  start_time: z.string().datetime().optional().nullable(),
  end_time: z.string().datetime().optional().nullable(),
  location_id: z.string().optional().nullable(),
  type: z.enum(['ACTIVITY', 'TRANSPORT', 'MEAL', 'ACCOMMODATION', 'MEETING', 'FREE_TIME']).optional(),
})

export async function PUT(request: NextRequest, { params }: { params: { tripId: string } }) {
  try {
    const body = await request.json()
    const data = UpdateItineraryItemSchema.parse(body)
    const { tripId } = params

    // Get current item for overlap checking - fix field references
    const currentItem = await prisma.itinerary_items.findUnique({
      where: { id: tripId },
      include: { day: true } // Include day relation to get trip_id
    })

    if (!currentItem) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 })
    }

    // Check for overlaps if updating times
    if (data.start_time && data.end_time) {
      const overlaps = await prisma.itinerary_items.findMany({
        where: {
          day: {
            trip_id: currentItem.day.trip_id // Access trip_id through day relation
          },
          day_id: currentItem.day_id, // Use day_id instead of day
          id: { not: tripId }, // Exclude current item
          AND: [
            { start_time: { not: null } },
            { end_time: { not: null } },
            {
              OR: [
                {
                  AND: [
                    { start_time: { lte: new Date(data.start_time) } },
                    { end_time: { gt: new Date(data.start_time) } }
                  ]
                },
                {
                  AND: [
                    { start_time: { lt: new Date(data.end_time) } },
                    { end_time: { gte: new Date(data.end_time) } }
                  ]
                },
                {
                  AND: [
                    { start_time: { gte: new Date(data.start_time) } },
                    { end_time: { lte: new Date(data.end_time) } }
                  ]
                }
              ]
            }
          ]
        },
        select: { id: true, title: true, start_time: true, end_time: true }
      })

      if (overlaps.length > 0) {
        return NextResponse.json({
          success: false,
          error: 'Time overlap detected',
          overlaps
        }, { status: 400 })
      }
    }

    const item = await prisma.itinerary_items.update({
      where: { id: tripId },
      data: {
        title: data.title,
        note: data.description, // Use 'note' field instead of 'description'
        start_time: data.start_time ? new Date(data.start_time) : undefined,
        end_time: data.end_time ? new Date(data.end_time) : undefined,
        place_id: data.location_id, // Use 'place_id' instead of 'location_id'
        type: data.type
      },
      include: {
        place: true // Use 'place' relation instead of 'locations'
      }
    })

    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    console.error('Error updating itinerary item:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof z.ZodError ? error.issues : 'Failed to update itinerary item'
    }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { tripId: string } }) {
  try {
    const { tripId } = params

    await prisma.itinerary_items.delete({
      where: { id: tripId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting itinerary item:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete itinerary item' }, { status: 500 })
  }
}