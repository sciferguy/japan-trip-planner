'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ItineraryItemCard } from './ItineraryItemCard'
import { AddActivityForm } from './AddActivityForm'
import { EditActivityForm } from './EditActivityForm'
import { useItinerary } from '@/hooks/useItinerary'
import { formatDate } from '@/lib/utils'
import {CreateItineraryItemData, ItineraryItem, UpdateItineraryItemData} from '@/types/itinerary'

interface Trip {
  id: string
  title: string
  start_date: string | Date
  end_date: string | Date
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
  userId
}: ItineraryDayViewProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null)
  const { items, loading, error, createItem, patchItem, deleteItem, refetch } = useItinerary(trip.id, dayNumber)

  const handleCreateItem = async (data: CreateItineraryItemData) => {
    const result = await createItem(data)
    if (result.success) {
      setShowAddForm(false)
      await refetch()
      return { success: true, data: result.data }
    }
    return { success: false, error: result.error }
  }

  const handleEditItem = async (data: UpdateItineraryItemData) => {
    if (!editingItem) return { ok: false, error: 'No item selected for editing' }

    const result = await patchItem(editingItem.id, data)

    if (result.success) {
      setEditingItem(null)
      await refetch()
      return {
        ok: true,
        data: result.data?.updated // Extract just the updated item
      }
    } else {
      return {
        ok: false,
        error: result.error || 'Failed to update item'
      }
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    const result = await deleteItem(id)
    if (result.success) {
      await refetch()
    }
  }

  const handleStartEdit = (item: ItineraryItem) => {
    setEditingItem(item)
    setShowAddForm(false)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
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
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
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
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Day {dayNumber} - {formatDate(date.toISOString())}
          </h1>
          <p className="text-gray-600 mt-1">{trip.title}</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add Activity'}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center py-4 border-t border-b border-gray-200">
        {hasPrevDay ? (
          <Link
            href={`/dashboard/itinerary/${trip.id}?day=${dayNumber - 1}`}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Previous Day
          </Link>
        ) : (
          <div></div>
        )}

        <span className="text-sm text-gray-500">
          {dayNumber} of {Math.ceil((tripEnd.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24)) + 1} days
        </span>

        {hasNextDay ? (
          <Link
            href={`/dashboard/itinerary/${trip.id}?day=${dayNumber + 1}`}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            Next Day →
          </Link>
        ) : (
          <div></div>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Activity</h3>
          <AddActivityForm
            tripId={trip.id}
            dayId={dayNumber.toString()}
            userId={userId}
            tripStartDate={trip.start_date instanceof Date ? trip.start_date : new Date(trip.start_date)}
            onSubmit={handleCreateItem}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Edit Form */}
      {editingItem && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Edit Activity</h3>
          <EditActivityForm
            item={editingItem}
            _tripId={trip.id}
            tripStartDate={trip.start_date instanceof Date ? trip.start_date : new Date(trip.start_date)}
            onSubmit={handleEditItem}
            onCancel={handleCancelEdit}
          />
        </div>
      )}

      {/* Items */}
      <div className="space-y-4">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => (
            <ItineraryItemCard
              key={item.id}
              item={item}
              onEdit={handleStartEdit}
              onDelete={handleDeleteItem}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No activities planned for this day</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Add your first activity
            </button>
          </div>
        )}
      </div>
    </div>
  )
}