'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Edit2, Trash2, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Location {
  id: string
  name: string
  address: string
  google_place_id?: string
  custom_notes?: string
}

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
  locations: Location | null
}

interface Trip {
  id: string
  title: string
  start_date: string
  end_date: string
  itinerary_items: ItineraryItem[]
}

interface Props {
  trip: Trip
  groupedItems: [string, ItineraryItem[]][]
  userId: string
}

const typeColors = {
  ACTIVITY: 'bg-blue-100 text-blue-800',
  TRANSPORT: 'bg-green-100 text-green-800',
  MEAL: 'bg-orange-100 text-orange-800',
  ACCOMMODATION: 'bg-purple-100 text-purple-800',
  MEETING: 'bg-yellow-100 text-yellow-800',
  FREE_TIME: 'bg-gray-100 text-gray-800'
} as const

export function ItineraryClientWrapper({ trip, groupedItems, userId }: Props) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    setDeletingId(itemId)
    try {
      const response = await fetch(`/api/itinerary-items/${itemId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.refresh() // Refresh server data
      } else {
        throw new Error('Failed to delete item')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return null
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getDayDate = (dayNumber: number) => {
    const startDate = new Date(trip.start_date)
    const dayDate = new Date(startDate)
    dayDate.setDate(startDate.getDate() + dayNumber - 1)
    return dayDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  }

  if (groupedItems.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No activities planned yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start building your Japan itinerary by adding your first activity.
          </p>
          <Button asChild>
            <Link href={`/dashboard/itinerary/${trip.id}/add`}>
              <Plus size={18} className="mr-2" />
              Add First Activity
            </Link>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {groupedItems.map(([day, items]) => (
        <Card key={day} className="overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Day {day}
                </h2>
                <p className="text-gray-600 text-sm">
                  {getDayDate(Number(day))}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {items.length} {items.length === 1 ? 'activity' : 'activities'}
                </span>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/itinerary/${trip.id}/add?day=${day}`}>
                    <Plus size={16} className="mr-1" />
                    Add
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  {/* Time indicator */}
                  <div className="flex-shrink-0 w-20 text-center">
                    {item.start_time ? (
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {formatTime(item.start_time)}
                        </div>
                        {item.end_time && (
                          <div className="text-gray-500">
                            {formatTime(item.end_time)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">
                        No time
                      </div>
                    )}
                  </div>

                  {/* Activity details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">
                            {item.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={typeColors[item.type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800'}
                          >
                            {item.type}
                          </Badge>
                        </div>

                        {item.description && (
                          <p className="text-gray-600 text-sm mb-2">
                            {item.description}
                          </p>
                        )}

                        {item.locations && (
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin size={14} className="mr-1" />
                            <span>{item.locations.name}</span>
                            {item.locations.address && (
                              <span className="ml-1">• {item.locations.address}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-1 ml-4">
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Link href={`/dashboard/itinerary/${trip.id}/edit/${item.id}`}>
                            <Edit2 size={14} />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={deletingId === item.id}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}

      {/* Add day button */}
      <Card className="p-6 border-dashed border-2 border-gray-300">
        <div className="text-center">
          <Button asChild variant="outline" className="w-full">
            <Link href={`/dashboard/itinerary/${trip.id}/add?day=${groupedItems.length + 1}`}>
              <Plus size={18} className="mr-2" />
              Add Day {groupedItems.length + 1} Activities
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default ItineraryClientWrapper