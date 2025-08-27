import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TouchableCard } from '@/components/ui/TouchableCard'
import { MobileContainer } from '@/components/ui/MobileContainer'
import { Plus, MapPin, Calendar } from 'lucide-react'

// Mock data for now - replace with actual data fetching
const mockTrips = [
  {
    id: '1',
    name: 'Spring in Japan',
    startDate: '2024-03-15',
    endDate: '2024-03-25',
    placesCount: 8
  },
  {
    id: '2',
    name: 'Tokyo Adventure',
    startDate: '2024-06-01',
    endDate: '2024-06-10',
    placesCount: 12
  }
]

function TripsListContent() {
  return (
    <MobileContainer className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <Button asChild className="bg-tea-600 hover:bg-tea-700">
          <Link href="/trips/new">
            <Plus className="h-4 w-4 mr-2" />
            New Trip
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {mockTrips.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🗾</div>
            <h2 className="text-xl font-semibold mb-2">No trips yet</h2>
            <p className="text-muted-foreground mb-6">
              Start planning your Japan adventure!
            </p>
            <Button asChild className="bg-tea-600 hover:bg-tea-700">
              <Link href="/trips/new">Create Your First Trip</Link>
            </Button>
          </div>
        ) : (
          mockTrips.map((trip) => (
            <TouchableCard
              key={trip.id}
              variant="interactive"
              className="p-4"
              onClick={() => {/* Navigate to trip detail */}}
            >
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{trip.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{trip.placesCount} places</span>
                  </div>
                </div>
              </div>
            </TouchableCard>
          ))
        )}
      </div>
    </MobileContainer>
  )
}

export default function TripsPage() {
  return (
    <Suspense fallback={
      <MobileContainer className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-32"></div>
          <div className="space-y-3">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </div>
      </MobileContainer>
    }>
      <TripsListContent />
    </Suspense>
  )
}