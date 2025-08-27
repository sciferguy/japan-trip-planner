import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ tripId: string }> }  // Change to Promise
  ) {
    const { tripId } = await params  // Await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
  
    try {
      const trip = await prisma.trips.findFirst({
        where: {
          id: tripId,  // Use tripId directly now
          created_by: session.user.id,
        },
      })

    if (!trip) {
      return NextResponse.json({ ok: false, error: 'Trip not found' }, { status: 404 })
    }

    const expenses = await prisma.expenses.findMany({
      where: { trip_id: tripId },
    })

    // Calculate totals
    const totalInHomeCurrency = expenses.reduce((sum, exp) => sum + exp.amount_jpy, 0)
    const totalOriginal = expenses.reduce((sum, exp) => sum + exp.amount_original, 0)
    
    // Group by category
    const byCategory = expenses.reduce((acc, exp) => {
      const cat = exp.category || 'MISC'
      if (!acc[cat]) acc[cat] = { count: 0, total: 0 }
      acc[cat].count++
      acc[cat].total += exp.amount_jpy
      return acc
    }, {} as Record<string, { count: number, total: number }>)

    // Group by day
    const byDay = expenses.reduce((acc, exp) => {
      const date = exp.date.toISOString().split('T')[0]
      if (!acc[date]) acc[date] = { count: 0, total: 0 }
      acc[date].count++
      acc[date].total += exp.amount_jpy
      return acc
    }, {} as Record<string, { count: number, total: number }>)

    return NextResponse.json({
      ok: true,
      data: {
        totalInHomeCurrency,
        totalOriginal,
        homeCurrency: trip.home_currency,
        byCategory,
        byDay,
        count: expenses.length
      }
    })
  } catch (error) {
    console.error('Failed to fetch expense summary:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch expense summary' },
      { status: 500 }
    )
  }
}