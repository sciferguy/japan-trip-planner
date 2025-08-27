import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Plus, 
  Clock, 
  MapPin, 
  Edit2, 
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Train,
  Utensils,
  Activity,
  Bed,
  Users,
  Coffee
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const prisma = new PrismaClient()

// Type icon mapping
const typeIcons = {
  ACTIVITY: Activity,
  TRANSPORT: Train,
  MEAL: Utensils,
  ACCOMMODATION: Bed,
  MEETING: Users,
  FREE_TIME: Coffee
}

// Type color mapping
const typeColors = {
  ACTIVITY: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  TRANSPORT: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  MEAL: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  ACCOMMODATION: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  MEETING: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  FREE_TIME: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
}

async function getDayDetails(dayIdOrNumber: string, userId: string) {
  // First, check if it's a UUID (day ID) or a number (day number)
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dayIdOrNumber) ||
                 /^c[a-z0-9]{20,}$/i.test(dayIdOrNumber) // Prisma's cuid format
  
  if (isUUID) {
    // It's a day ID, query directly
    const day = await prisma.days.findUnique({
      where: { id: dayIdOrNumber },
      include: {
        trip: {
          include: {
            trip_members: true
          }
        },
        itinerary_items: {
          include: {
            place: true,
            created_by_user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: [
            { start_time: 'asc' },
            { created_at: 'asc' }
          ]
        }
      }
    })

    if (!day) {
      return null
    }

    // Check if user has access to this trip
    const hasAccess = day.trip.created_by === userId || 
      day.trip.trip_members.some(member => member.user_id === userId)

    if (!hasAccess) {
      return null
    }

    return day
  } else {
    // It's a day number, need to find the trip first and then get the nth day
    const dayNumber = parseInt(dayIdOrNumber)
    if (isNaN(dayNumber)) {
      return null
    }

    // Get the user's current trip
    const trip = await prisma.trips.findFirst({
      where: {
        OR: [
          { created_by: userId },
          { trip_members: { some: { user_id: userId } } }
        ]
      },
      include: {
        days: {
          orderBy: { date: 'asc' }
        },
        trip_members: true
      }
    })

    if (!trip || !trip.days[dayNumber - 1]) {
      return null
    }

    // Now get the full day details
    const day = await prisma.days.findUnique({
      where: { id: trip.days[dayNumber - 1].id },
      include: {
        trip: {
          include: {
            trip_members: true
          }
        },
        itinerary_items: {
          include: {
            place: true,
            created_by_user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: [
            { start_time: 'asc' },
            { created_at: 'asc' }
          ]
        }
      }
    })

    return day
  }
}

async function getAdjacentDays(tripId: string, currentDate: Date) {
  const days = await prisma.days.findMany({
    where: { trip_id: tripId },
    orderBy: { date: 'asc' },
    select: {
      id: true,
      date: true
    }
  })

  const currentIndex = days.findIndex(d => 
    d.date.toDateString() === currentDate.toDateString()
  )

  return {
    previousDay: currentIndex > 0 ? days[currentIndex - 1] : null,
    nextDay: currentIndex < days.length - 1 ? days[currentIndex + 1] : null,
    currentDayNumber: currentIndex + 1,
    totalDays: days.length
  }
}

export default async function DayViewPage({ 
  params 
}: { 
  params: Promise<{ dayId: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/sign-in')
  }

  const { dayId } = await params
  const day = await getDayDetails(dayId, session.user.id)

  if (!day) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Day Not Found</h1>
          <p className="text-gray-600 mb-6">
            This day doesn't exist or you don't have access to view it.
          </p>
          <Button asChild>
            <Link href="/dashboard/itinerary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Itinerary
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const { previousDay, nextDay, currentDayNumber, totalDays } = 
    await getAdjacentDays(day.trip_id, day.date)

  const dayDate = new Date(day.date)
  const formattedDate = dayDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
              Dashboard
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/dashboard/itinerary" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
              Itinerary
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white">Day {currentDayNumber}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header with Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Previous Day */}
              {previousDay ? (
                <Link 
                  href={`/dashboard/itinerary/day/${previousDay.id}`}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              ) : (
                <div className="p-2 opacity-30">
                  <ChevronLeft className="h-5 w-5" />
                </div>
              )}

              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Day {currentDayNumber} of {totalDays}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </p>
              </div>

              {/* Next Day */}
              {nextDay ? (
                <Link 
                  href={`/dashboard/itinerary/day/${nextDay.id}`}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </Link>
              ) : (
                <div className="p-2 opacity-30">
                  <ChevronRight className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button asChild variant="outline">
                <Link href={`/dashboard/itinerary/day/${day.id}/edit`}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Day
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/dashboard/itinerary/day/${day.id}/add`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Link>
              </Button>
            </div>
          </div>

          {/* Day Note */}
          {day.note && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-blue-900 dark:text-blue-200">{day.note}</p>
            </div>
          )}
        </div>

        {/* Timeline View */}
        <div className="space-y-6">
          {day.itinerary_items.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Coffee className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No activities planned yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start planning your day by adding activities, meals, or transportation.
              </p>
              <Button asChild>
                <Link href={`/dashboard/itinerary/day/${day.id}/add`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Link>
              </Button>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

              {/* Timeline items */}
              {day.itinerary_items.map((item, index) => {
                const Icon = typeIcons[item.type]
                const colorClass = typeColors[item.type]
                
                return (
                  <div key={item.id} className="relative flex gap-6 pb-8 last:pb-0">
                    {/* Timeline dot */}
                    <div className="relative z-10 flex items-center justify-center w-16 flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Content card */}
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          {(item.start_time || item.end_time) && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mt-1">
                              <Clock className="h-4 w-4" />
                              {item.start_time && new Date(item.start_time).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                              {item.start_time && item.end_time && ' - '}
                              {item.end_time && new Date(item.end_time).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                          {item.type.replace('_', ' ')}
                        </span>
                      </div>

                      {item.note && (
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {item.note}
                        </p>
                      )}

                      {item.place && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <MapPin className="h-4 w-4" />
                          <span>{item.place.name}</span>
                          {item.place.address && (
                            <span className="text-gray-400">• {item.place.address}</span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Added by {item.created_by_user.name || item.created_by_user.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            asChild
                          >
                            <Link href={`/dashboard/itinerary/item/${item.id}/edit`}>
                              <Edit2 className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Day Summary */}
        {day.itinerary_items.length > 0 && (
          <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Day Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(
                day.itinerary_items.reduce((acc, item) => {
                  acc[item.type] = (acc[item.type] || 0) + 1
                  return acc
                }, {} as Record<string, number>)
              ).map(([type, count]) => {
                const Icon = typeIcons[type as keyof typeof typeIcons]
                const colorClass = typeColors[type as keyof typeof typeColors]
                return (
                  <div key={type} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {count} {type.replace('_', ' ').toLowerCase()}{count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Loading component
export function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    </div>
  )
}