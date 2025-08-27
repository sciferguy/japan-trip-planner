import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ItineraryDayView from '@/components/itinerary/ItineraryDayView'

interface PageProps {
  params: { date: string }
}

function isISODate(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s)
}

async function getTripAndDay(dateStr: string) {
  if (!isISODate(dateStr)) throw new Error('Invalid date format (YYYY-MM-DD)')

  const trip = await prisma.trips.findFirst()
  if (!trip) throw new Error('No trip found')

  const startDate = new Date(trip.start_date)
  const endDate = new Date(trip.end_date)

  const targetDate = new Date(dateStr + 'T00:00:00Z')
  if (isNaN(targetDate.getTime())) throw new Error('Unparseable date')
  if (targetDate < startDate || targetDate > endDate) throw new Error('Date is outside trip range')

  const dayNumber = Math.floor((targetDate.getTime() - startDate.getTime()) / 86400000) + 1

  return {
    trip: {
      ...trip,
      startDate: trip.start_date.toISOString(),
      endDate: trip.end_date.toISOString(),
      createdAt: trip.created_at.toISOString()
    },
    dayNumber,
    date: targetDate
  }
}

export default async function ItineraryDayPage({ params }: PageProps) {
  const session = await auth()
  if (!session?.user) redirect('/sign-in')

  try {
    const { trip, dayNumber, date } = await getTripAndDay(params.date)
    return (
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<DayViewSkeleton />}>
          <ItineraryDayView
            trip={trip}
            dayNumber={dayNumber}
            date={date}
            userId={session.user.id!}
          />
        </Suspense>
      </div>
    )
  } catch (e) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h1 className="text-xl font-semibold text-red-800 mb-2">Invalid Date</h1>
          <p className="text-red-600 mb-4">
            {e instanceof Error ? e.message : 'This date is not part of your trip.'}
          </p>
          <a href="/dashboard/itinerary" className="text-blue-600 hover:text-blue-800 underline">
            Return to Itinerary Overview
          </a>
        </div>
      </div>
    )
  }
}

function DayViewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-64" />
      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-48" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}