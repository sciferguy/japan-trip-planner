import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/trips/[tripId]/checklist - Get all checklist items for a trip
export async function GET(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )}
    
    const tripId = await params.tripId

    // Verify user has access to this trip
    const trip = await prisma.trips.findFirst({
      where: {
        id: tripId,
        OR: [
          { created_by: session.user.id },
          { trip_members: { some: { user_id: session.user.id } } }
        ]
      }
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found or access denied' },
        { status: 404 }
      )
    }

    // Get all checklist items for this trip
    const items = await prisma.checklist_items.findMany({
      where: { trip_id: tripId },
      orderBy: [
        { priority: 'desc' }, // Critical items first
        { created_at: 'asc' }
      ]
    })

    return NextResponse.json({
      items: items.map(item => ({
        id: item.id,
        text: item.title, // Your schema uses 'title' not 'text'
        completed: item.completed,
        category: item.category,
        priority: item.priority,
        createdAt: item.created_at,
        completedAt: item.completed_at
      }))
    })
  } catch (error) {
    console.error('Error fetching checklist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch checklist' },
      { status: 500 }
    )
  }
}

// POST /api/trips/[tripId]/checklist - Add a new checklist item
export async function POST(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const tripId = params.tripId
    const body = await request.json()
    const { text, category, priority } = body

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    // Verify user has access to this trip
    const trip = await prisma.trips.findFirst({
      where: {
        id: tripId,
        OR: [
          { created_by: session.user.id },
          { trip_members: { some: { user_id: session.user.id } } }
        ]
      }
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found or access denied' },
        { status: 404 }
      )
    }

    // Create the checklist item
    const item = await prisma.checklist_items.create({
      data: {
        trip_id: tripId,
        title: text.trim(), // Your schema uses 'title'
        category: category || 'GENERAL', // Your schema uses uppercase enums
        priority: priority || 'MEDIUM', // Your schema uses uppercase enums
        completed: false,
        user_id: session.user.id // Your schema uses 'user_id' not 'created_by'
      }
    })

    return NextResponse.json({
      id: item.id,
      text: item.title,
      completed: item.completed,
      category: item.category,
      priority: item.priority,
      createdAt: item.created_at,
      completedAt: item.completed_at
    })
  } catch (error) {
    console.error('Error creating checklist item:', error)
    return NextResponse.json(
      { error: 'Failed to create checklist item' },
      { status: 500 }
    )
  }
}