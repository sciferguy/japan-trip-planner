import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { AddActivityForm } from '@/components/itinerary/AddActivityForm'
import { Card } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const prisma = new PrismaClient()

interface PageProps {
  params: { tripId: string }
  searchParams: { day?: string }
}

async function getTrip(tripId: string) {
  const trip = await prisma.trips.findUnique({
    where: { id: tripId },
    select: {
      id: true,
      title: true,
      start_date: true,
      end_date: true
    }
  })

  if (!trip) return null

  return {
    ...trip,
    start_date: trip.start_date.toISOString(),
    end_date: trip.end_date.toISOString()
  }
}

export default async function AddActivityPage({ params, searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user) {
    redirect('/sign-in')
  }

  const trip = await getTrip(params.tripId)
  if (!trip) {
    redirect('/dashboard/itinerary')
  }

  const defaultDay = searchParams.day ? parseInt(searchParams.day) : 1

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/dashboard/itinerary">
              <ArrowLeft size={16} className="mr-2" />
              Back to Itinerary
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Activity
          </h1>
          <p className="text-gray-600">
            Add an activity to {trip.title}
          </p>
        </div>

        <Card className="p-6">
          <Suspense fallback={<div>Loading...</div>}>
            <AddActivityForm
              tripId={trip.id}
              defaultDay={defaultDay}
              userId={session.user.id!}
            />
          </Suspense>
        </Card>
      </div>
    </div>
  )
}