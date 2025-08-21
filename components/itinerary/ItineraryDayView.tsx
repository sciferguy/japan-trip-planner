// components/itinerary/ItineraryDayView.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ItineraryItemCard } from './ItineraryItemCard'
import { AddItineraryItemForm } from './AddItineraryItemForm'
import { useItinerary } from '@/hooks/useItinerary'
import { formatDate } from '@/lib/utils'

interface Trip {
  id: string
  title: string
  start_date: string
  end_date: string
}

interface ItineraryDayViewProps {
  trip: Trip
  dayNumber: number
  date: Date
  userId: string
}

export default function ItineraryDayView({
  trip,
  dayNumber,
  date,
  _userId
}: ItineraryDayViewProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const { items, loading, error, createItem, refetch } = useItinerary(trip.id, dayNumber)

  const handleCreateItem = async (data: any) => {
    const result = await createItem(data)
    // Convert the response to match expected format
    if (result.success) {
      setShowAddForm(false)
      await refetch()
      return { ok: true, data: result.data }
    }
    return { ok: false, error: result.error }
  }

  // Sort items by time, putting untimed items at the end
  const sortedItems = [...items].sort((a, b) => {
    if (!a.startTime && !b.startTime) return 0
    if (!a.startTime) return 1
    if (!b.startTime) return -1
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  })

  // Calculate previous and next day dates
  const prevDate = new Date(date)
  prevDate.setDate(prevDate.getDate() - 1)

  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + 1)

  const tripStart = new Date(trip.start_date)
  const tripEnd = new Date(trip.end_date)

  const hasPrevDay = prevDate >= tripStart
  const hasNextDay = nextDate <= tripEnd

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-48"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">Error loading day: {error}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-blue-600 hover:text-blue-800 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/itinerary"
            className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block"
          >
            ← Back to Overview
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Day {dayNumber}
          </h1>
          <p className="text-gray-600">
            {formatDate(date.toISOString())}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center py-4 border-t border-b border-gray-200">
        {hasPrevDay ? (
          <Link
            href={`/dashboard/itinerary/${prevDate.toISOString().split('T')[0]}`}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Day {dayNumber - 1}
          </Link>
        ) : (
          <div></div>
        )}

        <span className="text-sm text-gray-500">
          {items.length} items
        </span>

        {hasNextDay ? (
          <Link
            href={`/dashboard/itinerary/${nextDate.toISOString().split('T')[0]}`}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            Day {dayNumber + 1} →
          </Link>
        ) : (
          <div></div>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <AddItineraryItemForm
              dayId={dayNumber.toString()}
              onSubmit={handleCreateItem}
              onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Items */}
      <div className="space-y-4">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => (
            <ItineraryItemCard key={item.id} item={item} />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No items planned for this day</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Add your first item
            </button>
          </div>
        )}
      </div>
    </div>
  )
}