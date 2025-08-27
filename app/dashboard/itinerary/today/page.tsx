import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function TodayPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/sign-in')
  }

  // Get the current trip
  const trip = await prisma.trips.findFirst({
    where: {
      OR: [
        { created_by: session.user.id },
        { trip_members: { some: { user_id: session.user.id } } }
      ]
    }
  })

  if (!trip) {
    redirect('/dashboard/itinerary')
  }

  // Calculate which day number today is
  const today = new Date()
  const tripStart = new Date(trip.start_date)
  const dayNumber = Math.ceil((today.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // If today is outside the trip dates, show a message
  if (dayNumber < 1 || today > trip.end_date) {
    return (
      <>
        <div className="border-b bg-white">
          <div className="container mx-auto px-4 py-3">
            <Link href="/dashboard/itinerary" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Back to Itinerary
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Today's Itinerary</h1>
          <p className="text-gray-600">Today is not within your trip dates.</p>
        </div>
      </>
    )
  }

  // Redirect to the appropriate day view
  redirect(`/dashboard/itinerary/day/${dayNumber}`)
}