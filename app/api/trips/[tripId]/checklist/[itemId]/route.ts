import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PATCH /api/trips/[tripId]/checklist/[itemId] - Update a checklist item
export async function PATCH(
  request: NextRequest,
  { params }: { params: { tripId: string; itemId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { tripId, itemId } = params
    const body = await request.json()
    const { completed, text, category, priority } = body

    // Verify the item exists and belongs to this trip
    const existingItem = await prisma.checklist_items.findFirst({
      where: {
        id: itemId,
        trip_id: tripId
      },
      include: {
        trip: {
          include: {
            trip_members: true
          }
        }
      }
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Checklist item not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this trip
    const hasAccess = existingItem.trip.created_by === session.user.id ||
      existingItem.trip.trip_members.some(member => member.user_id === session.user.id)

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Update the item
    const updatedItem = await prisma.checklist_items.update({
      where: { id: itemId },
      data: {
        ...(completed !== undefined && { 
          completed,
          completed_at: completed ? new Date() : null // Set/clear completed_at
        }),
        ...(text && { title: text.trim() }), // Your schema uses 'title'
        ...(category && { category: category.toUpperCase() }), // Ensure uppercase
        ...(priority && { priority: priority.toUpperCase() }) // Ensure uppercase
      }
    })

    return NextResponse.json({
      id: updatedItem.id,
      text: updatedItem.title, // Map back to 'text' for frontend
      completed: updatedItem.completed,
      category: updatedItem.category,
      priority: updatedItem.priority,
      createdAt: updatedItem.created_at,
      completedAt: updatedItem.completed_at
    })
  } catch (error) {
    console.error('Error updating checklist item:', error)
    return NextResponse.json(
      { error: 'Failed to update checklist item' },
      { status: 500 }
    )
  }
}

// DELETE /api/trips/[tripId]/checklist/[itemId] - Delete a checklist item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tripId: string; itemId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { tripId, itemId } = params

    // Verify the item exists and belongs to this trip
    const existingItem = await prisma.checklist_items.findFirst({
      where: {
        id: itemId,
        trip_id: tripId
      },
      include: {
        trip: {
          include: {
            trip_members: true
          }
        }
      }
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Checklist item not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this trip
    const hasAccess = existingItem.trip.created_by === session.user.id ||
      existingItem.trip.trip_members.some(member => member.user_id === session.user.id)

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Delete the item
    await prisma.checklist_items.delete({
      where: { id: itemId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting checklist item:', error)
    return NextResponse.json(
      { error: 'Failed to delete checklist item' },
      { status: 500 }
    )
  }
}