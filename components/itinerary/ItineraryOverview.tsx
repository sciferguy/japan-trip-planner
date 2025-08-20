// components/itinerary/ItineraryOverview.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ItineraryItem } from '@/types/itinerary'
import { ItineraryItemCard } from './ItineraryItemCard'
import { AddItineraryItemForm } from './AddItineraryItemForm'
import { useItinerary } from '@/hooks/useItinerary'
import { formatDate } from '@/lib/utils'

interface Trip {
  id: string
  title: string
  start_date: string
  end_date: string
  itinerary_items: ItineraryItem[]
}

interface ItineraryOverviewProps {
  trip: Trip
  userId: string
}

export default function ItineraryOverview({ trip, userId }: ItineraryOverviewProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const { items, createItem, refetch } = useItinerary(trip.id)

  // Generate days between start and end date
  const generateDays = () => {
    const days = []
    const start = new Date(trip.start_date)
    const end = new Date(trip.end_date)

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayNumber = Math.floor((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      days.push({
        number: dayNumber,
        date: new Date(d),
        items: items.filter(item => item.day === dayNumber)
      })
    }

    return days
  }

  const days = generateDays()

  const handleCreateItem = async (data: any) => {
    const result = await createItem(data)
    if (result.success) {
      setShowAddForm(false)
      setSelectedDay(null)
      await refetch()
    }
    return result
  }

  return (
    <div className="space-y-8">
      {/* Quick Add Button */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors border border-blue-600"
          >
            + Add Item
          </button>
          <Link
              href="/itinerary/today"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors border border-green-600"
          >
            View Today
          </Link>
        </div>

        <div className="text-sm text-gray-500">
          {items.length} total items
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Itinerary Item</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Day
                </label>
                <select
                    value={selectedDay || ''}
                    onChange={(e) => setSelectedDay(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a day</option>
                  {days.map((day) => (
                      <option key={day.number} value={day.number}>
                        Day {day.number} - {day.date.toLocaleDateString()}
                      </option>
                  ))}
                </select>
              </div>

              {selectedDay && (
                <AddItineraryItemForm
                  tripId={trip.id}
                  day={selectedDay}
                  userId={userId}
                  onSubmit={handleCreateItem}
                  onCancel={() => {
                    setShowAddForm(false)
                    setSelectedDay(null)
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Days Overview */}
      <div className="space-y-6">
        {days.map((day) => (
          <div key={day.number} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Day {day.number}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {formatDate(day.date.toISOString())}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/itinerary/${day.date.toISOString().split('T')[0]}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Day →
                  </Link>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {day.items.length} items
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {day.items.length > 0 ? (
                <div className="space-y-3">
                  {day.items.map((item) => (
                    <ItineraryItemCard
                      key={item.id}
                      item={item}
                      className="bg-gray-50"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No items planned for this day</p>
                  <button
                    onClick={() => {
                      setSelectedDay(day.number)
                      setShowAddForm(true)
                    }}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Add first item
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}