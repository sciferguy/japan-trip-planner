import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getExchangeRate } from '@/lib/fx'

const createExpenseSchema = z.object({
    label: z.string().min(1),
    amount: z.number().positive(),
    currency: z.string().length(3),
    category: z.enum(['TRANSPORT', 'ACCOMMODATION', 'FOOD', 'ACTIVITIES', 'SHOPPING', 'MISC']).optional(),
    expenseType: z.enum(['PLANNED', 'ACTUAL']).optional().default('ACTUAL'),
    date: z.string(),  // Changed from z.string().datetime() to just z.string()
    dayId: z.string().optional(),
  })

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ tripId: string }> }
  ) {
    const resolvedParams = await params  // Await first
    const { tripId } = resolvedParams     // Then destructure
    
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
  
    try {
      const trip = await prisma.trips.findFirst({
        where: {
          id: tripId,
          created_by: session.user.id,
        },
      })
  
      if (!trip) {
        return NextResponse.json({ ok: false, error: 'Trip not found' }, { status: 404 })
      }
  
      const expenses = await prisma.expenses.findMany({
        where: { trip_id: tripId },
        orderBy: { date: 'desc' },
        include: {
          day: true,
          created_by_user: {
            select: { id: true, name: true, email: true }
          }
        }
      })
  
      return NextResponse.json({ 
        ok: true,
        data: expenses 
      })
    } catch (error) {
      console.error('Failed to fetch expenses:', error)
      return NextResponse.json(
        { ok: false, error: 'Failed to fetch expenses' },
        { status: 500 }
      )
    }
  }

export async function POST(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validated = createExpenseSchema.parse(body)

    const trip = await prisma.trips.findFirst({
      where: {
        id: params.tripId,
        created_by: session.user.id,
      },
    })

    if (!trip) {
      return NextResponse.json({ ok: false, error: 'Trip not found' }, { status: 404 })
    }

    if (validated.dayId) {
      const day = await prisma.days.findFirst({
        where: {
          id: validated.dayId,
          trip_id: params.tripId,
        },
      })
      
      if (!day) {
        return NextResponse.json({ ok: false, error: 'Day not found in trip' }, { status: 400 })
      }
    }

    // Calculate converted amounts
    // Use default currency if home_currency doesn't exist yet
    const homeCurrency = trip.home_currency || 'USD'
    let fxRate = 1
    let amountInHomeCurrency = validated.amount
    
    if (validated.currency !== homeCurrency) {
      fxRate = await getExchangeRate(validated.currency, homeCurrency)
      amountInHomeCurrency = validated.amount * fxRate
    }

    const expense = await prisma.expenses.create({
      data: {
        trip_id: params.tripId,
        day_id: validated.dayId || null,
        created_by_user_id: session.user.id,
        label: validated.label,
        amount_original: validated.amount,
        currency_original: validated.currency,
        fx_rate: fxRate,
        amount_jpy: amountInHomeCurrency, // Using amount_jpy for home currency amount
        category: validated.category || null,
        expense_type: validated.expenseType,
        date: validated.date ? new Date(validated.date) : new Date(),
      },
    })

    return NextResponse.json({ 
      ok: true,
      data: expense 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Validation failed',
        details: error.flatten().fieldErrors
      }, { status: 400 })
    }
    console.error('Failed to create expense:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to create expense' },
      { status: 500 }
    )
  }
}