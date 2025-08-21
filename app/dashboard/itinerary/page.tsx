import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import ItineraryOverview from '@/components/itinerary/ItineraryOverview'
import { Button } from '@/components/ui/button'
import { Plus, Calendar } from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

// Trip type that matches ItineraryOverview expectations
interface Trip {
  id: string
  title: string
  start_date: string
  end_date: string
  itinerary_items: Array<{
    id: string
    tripId: string
    dayId: string | null
    day: number
    title: string
    description: string | null
    startTime: string | null
    endTime: string | null
    locationId: string | null
    type: 'ACTIVITY' | 'TRANSPORT' | 'MEAL' | 'ACCOMMODATION' | 'MEETING' | 'FREE_TIME'
    createdBy: string
    createdAt: string
    overlap: boolean
  }>
}

async function getTrip() {
  // For MVP, get the first trip (single user mode)
  const trip = await prisma.trips.findFirst({
    include: {
      itinerary_items: {
        include: { locations: true },
        orderBy: [
          { day: 'asc' },
          { start_time: 'asc' },
          { created_at: 'asc' }
        ]
      }
    }
  })

  if (!trip) {
    return null
  }

  // Transform to match Trip interface expected by ItineraryOverview
  const transformedTrip: Trip = {
    id: trip.id,
    title: trip.title,
    start_date: trip.start_date.toISOString(),
    end_date: trip.end_date.toISOString(),
    itinerary_items: trip.itinerary_items.map(item => ({
      id: item.id,
      tripId: item.trip_id,
      dayId: item.day.toString(),
      day: item.day,
      title: item.title,
      description: item.description,
      startTime: item.start_time ? item.start_time.toISOString() : null,
      endTime: item.end_time ? item.end_time.toISOString() : null,
      locationId: item.location_id,
      type: item.type as Trip['itinerary_items'][0]['type'],
      createdBy: item.created_by,
      createdAt: item.created_at.toISOString(),
      overlap: false // Set default value
    }))
  }

  return transformedTrip
}

export default async function ItineraryPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/sign-in')
  }

  const trip = await getTrip()

  // Handle no trip case
  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Trip Found</h1>
          <p className="text-gray-600 mb-6">
            Create your first Japan trip to start planning your itinerary.
          </p>
          <Button asChild>
            <Link href="/dashboard/">
              <Plus size={18} className="mr-2" />
              Create New Trip
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {trip.title} Itinerary
          </h1>
          <p className="text-gray-600">
            {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button asChild variant="outline">
            <Link href={`/dashboard/itinerary/${trip.id}/add`}>
              <Plus size={18} className="mr-2" />
              Add Activity
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/itinerary/${trip.id}/edit`}>
              Edit Trip
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<ItinerarySkeleton />}>
        {/* Overview Component - now receives the correctly typed trip */}
        <div className="mb-8">
          <ItineraryOverview
            trip={trip}
            userId={session.user.id!}
          />
        </div>

        {/* Interactive Day-by-Day View - simplified to just show children */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Daily View</h2>
          {/* Add your day-by-day content here */}
        </div>
      </Suspense>
    </div>
  )
}

function ItinerarySkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-32"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}