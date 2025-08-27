'use client'

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCurrentTrip } from '@/hooks/useCurrentTrip'
import ItineraryOverview from '@/components/itinerary/ItineraryOverview'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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

export default function ItineraryPage() {
  const { data: session, status } = useSession()
  const { currentTrip, loading } = useCurrentTrip()
  
  if (status === 'loading' || loading) {
    return <ItinerarySkeleton />
  }
  
  if (status === 'unauthenticated' || !session?.user) {
    redirect('/sign-in')
  }

  if (!currentTrip) {
    return (
      <>
        <div className="border-b bg-white">
          <div className="container mx-auto px-4 py-3">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No Trip Selected</h1>
            <p className="text-gray-600 mb-6">
              Select a trip from the dropdown or create your first trip to start planning.
            </p>
            <Button asChild>
              <Link href="/dashboard">
                <Plus size={18} className="mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </>
    )
  }

  // Transform the currentTrip to match the expected format
  const transformedTrip = {
    id: currentTrip.id,
    title: currentTrip.title,
    start_date: typeof currentTrip.start_date === 'string' 
      ? currentTrip.start_date 
      : currentTrip.start_date.toISOString(),
    end_date: typeof currentTrip.end_date === 'string'
      ? currentTrip.end_date
      : currentTrip.end_date.toISOString(),
    days: currentTrip.days || [],
    itinerary_items: currentTrip.itinerary_items || []
  }

  return (
    <>
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-3">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentTrip.title} Itinerary
            </h1>
            <p className="text-gray-600">
              {new Date(currentTrip.start_date).toLocaleDateString()} - 
              {new Date(currentTrip.end_date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button asChild variant="outline">
              <Link href="/dashboard/itinerary/calendar">
                <Calendar size={18} className="mr-2" />
                Calendar View
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/trips/${currentTrip.id}/settings`}>
                Trip Settings
              </Link>
            </Button>
          </div>
        </div>

        <Suspense fallback={<ItinerarySkeleton />}>
          <div className="mb-8">
            <ItineraryOverview
              trip={transformedTrip}
              userId={session.user.id!}
            />
          </div>
        </Suspense>
      </div>
    </>
  )
}