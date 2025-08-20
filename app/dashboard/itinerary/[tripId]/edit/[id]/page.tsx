import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { EditActivityForm } from '@/components/itinerary/EditActivityForm'
import { Card } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const prisma = new PrismaClient()

interface PageProps {
  params: { tripId: string; id: string }
}

async function getActivity(id: string) {
  const item = await prisma.itinerary_items.findUnique({
    where: { id },
    include: { locations: true }
  })

  if (!item) return null

  return {
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
  }
}

export default async function EditActivityPage({ params }: PageProps) {
  const session = await auth()
  if (!session?.user) {
    redirect('/sign-in')
  }

  const activity = await getActivity(params.id)
  if (!activity) {
    redirect('/dashboard/itinerary')
  }

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
            Edit Activity
          </h1>
          <p className="text-gray-600">
            Update details for "{activity.title}"
          </p>
        </div>

        <Card className="p-6">
          <Suspense fallback={<div>Loading...</div>}>
            <EditActivityForm
              activity={activity}
              userId={session.user.id!}
            />
          </Suspense>
        </Card>
      </div>
    </div>
  )
}