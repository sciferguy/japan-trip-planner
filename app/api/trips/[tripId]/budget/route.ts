import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateBudgetSchema = z.object({
  budget_total: z.number().positive().optional(),
  budget_transport: z.number().positive().optional(),
  budget_accommodation: z.number().positive().optional(),
  budget_food: z.number().positive().optional(),
  budget_activities: z.number().positive().optional(),
  budget_shopping: z.number().positive().optional(),
  budget_misc: z.number().positive().optional(),
})

export async function PATCH(
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
    const body = await request.json()
    const validated = updateBudgetSchema.parse(body)

    const trip = await prisma.trips.findFirst({
      where: {
        id: tripId,
        created_by: session.user.id,
      },
    })

    if (!trip) {
      return NextResponse.json({ ok: false, error: 'Trip not found' }, { status: 404 })
    }

    const updatedTrip = await prisma.trips.update({
      where: { id: tripId },
      data: validated,
    })

    return NextResponse.json({ ok: true, data: updatedTrip })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Validation failed',
        details: error.flatten().fieldErrors
      }, { status: 400 })
    }
    console.error('Failed to update budget:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to update budget' },
      { status: 500 }
    )
  }
}