import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import ItineraryOverview from '@/components/itinerary/ItineraryOverview'
import { ItineraryClientWrapper } from '@/components/itinerary/ItineraryClientWrapper'
import { Button } from '@/components/ui/button'
import { Plus, Calendar } from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

// Define the ItineraryItem type to match your component
interface ItineraryItem {
  id: string
  title: string
  description?: string
  day: number
  start_time?: string
  end_time?: string
  type: string
  created_at: string
  location_id?: string
  locations: {
    id: string
    name: string
    address: string
    google_place_id?: string
    custom_notes?: string
  } | null
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
    return null // Handle gracefully instead of throwing
  }

  // Transform dates and null values to match Trip type
  return {
    ...trip,
    start_date: trip.start_date.toISOString(),
    end_date: trip.end_date.toISOString(),
    created_at: trip.created_at.toISOString(),
    itinerary_items: trip.itinerary_items.map(item => ({
      ...item,
      description: item.description ?? undefined,
      location_id: item.location_id ?? undefined,
      start_time: item.start_time ? item.start_time.toISOString() : undefined,
      end_time: item.end_time ? item.end_time.toISOString() : undefined,
      created_at: item.created_at.toISOString(),
      locations: item.locations ? {
        ...item.locations,
        google_place_id: item.locations.google_place_id ?? undefined,
        custom_notes: item.locations.custom_notes ?? undefined
      } : null
    }))
  }
}

// Group items by day for better organization with proper typing
function groupItemsByDay(items: ItineraryItem[]): [string, ItineraryItem[]][] {
  const grouped = items.reduce((acc, item) => {
    const day = item.day.toString()
    if (!acc[day]) acc[day] = []
    acc[day].push(item)
    return acc
  }, {} as Record<string, ItineraryItem[]>)

  return Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b))
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
            <Link href="/dashboard/trips/new">
              <Plus size={18} className="mr-2" />
              Create New Trip
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const groupedItems = groupItemsByDay(trip.itinerary_items)

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
        {/* Overview Component */}
        <div className="mb-8">
          <ItineraryOverview
            trip={trip}
            userId={session.user.id!}
          />
        </div>

        {/* Interactive Day-by-Day View */}
        <ItineraryClientWrapper
          trip={trip}
          groupedItems={groupedItems}
          userId={session.user.id!}
        />
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