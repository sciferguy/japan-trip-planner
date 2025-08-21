import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { EditActivityForm } from '@/components/itinerary/EditActivityForm'
import { Card } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UpdateItineraryItemData, ItineraryItem } from '@/types/itinerary'

const prisma = new PrismaClient()

interface PageProps {
  params: { tripId: string; id: string }
}

async function getActivityAndTrip(itemId: string, tripId: string) {
  const [item, trip] = await Promise.all([
    prisma.itinerary_items.findUnique({
      where: { id: itemId },
      include: { locations: true }
    }),
    prisma.trips.findUnique({
      where: { id: tripId },
      select: { id: true, start_date: true, end_date: true }
    })
  ])

  if (!item || !trip) return null

  const transformedItem: ItineraryItem = {
    id: item.id,
    tripId: item.trip_id,
    dayId: item.day.toString(),
    day: item.day,
    title: item.title,
    description: item.description,
    startTime: item.start_time?.toISOString() || null,
    endTime: item.end_time?.toISOString() || null,
    locationId: item.location_id,
    type: item.type as ItineraryItem['type'],
    createdBy: item.created_by,
    createdAt: item.created_at.toISOString(),
    overlap: false // You may need to compute this
  }

  return {
    item: transformedItem,
    trip: {
      ...trip,
      start_date: trip.start_date,
      end_date: trip.end_date
    }
  }
}

export default async function EditActivityPage({ params }: PageProps) {
  const session = await auth()
  if (!session?.user) {
    redirect('/sign-in')
  }

  const data = await getActivityAndTrip(params.id, params.tripId)
  if (!data) {
    redirect('/dashboard/itinerary')
  }

  const { item, trip } = data

  const handleSubmit = async (updateData: UpdateItineraryItemData) => {
    'use server'

    try {
      // Determine which day to update
      const targetDay = updateData.dayId ? parseInt(updateData.dayId) : item.day

      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/days/${targetDay}/itinerary-items/${item.id}?tripId=${params.tripId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const error = await response.text()
        return { success: false, error }
      }

      return { success: true }
    } catch {
      return { success: false, error: 'Failed to update activity' }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href={`/dashboard/itinerary/${params.tripId}`}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Itinerary
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Activity
          </h1>
          <p className="text-gray-600">
            Update details for &quot;{item.title}&quot;
          </p>
        </div>

        <Card className="p-6">
          <Suspense fallback={<div>Loading...</div>}>
            <EditActivityForm
              item={item}
              tripId={params.tripId}
              tripStartDate={trip.start_date}
              onSubmit={handleSubmit}
              onCancel={() => redirect(`/dashboard/itinerary/${params.tripId}`)}
            />
          </Suspense>
        </Card>
      </div>
    </div>
  )
}