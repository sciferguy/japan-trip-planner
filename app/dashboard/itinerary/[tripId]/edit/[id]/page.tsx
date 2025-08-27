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
      include: {
        place: true,
        day: true
      }
    }),
    prisma.trips.findUnique({
      where: { id: tripId },
      select: { id: true, start_date: true, end_date: true }
    })
  ])

  if (!item || !trip || item.day.trip_id !== tripId) return null

  // Calculate day number from trip start date and item day date
  const tripStart = new Date(trip.start_date)
  const itemDate = new Date(item.day.date)
  const dayNumber = Math.ceil((itemDate.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const transformedItem: ItineraryItem = {
    id: item.id,
    tripId: tripId,
    dayId: item.day_id,
    day: dayNumber,
    title: item.title,
    description: item.note,
    startTime: item.start_time?.toISOString() || null,
    endTime: item.end_time?.toISOString() || null,
    locationId: item.place_id,
    type: item.type as ItineraryItem['type'],
    createdBy: item.created_by_user_id,
    createdAt: item.created_at.toISOString(),
    overlap: false
  }

  return {
    item: transformedItem,
    trip: {
      ...trip,
      startDate: trip.start_date,
      endDate: trip.end_date
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
      const targetDayId = updateData.dayId || item.dayId

      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/itinerary-items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updateData,
          dayId: targetDayId
        })
      })

      if (!response.ok) {
        const error = await response.text()
        return { ok: false, error }
      }

      const result = await response.json()
      return { ok: true, data: result }
    } catch {
      return { ok: false, error: 'Failed to update activity' }
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
              _tripId={params.tripId}
              tripStartDate={trip.startDate instanceof Date ? trip.startDate : new Date(trip.startDate)}
              onSubmit={handleSubmit}
              onCancel={() => redirect(`/dashboard/itinerary/${params.tripId}`)}
            />
          </Suspense>
        </Card>
      </div>
    </div>
  )
}