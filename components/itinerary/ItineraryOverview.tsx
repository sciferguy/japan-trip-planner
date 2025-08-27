'use client'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import Link from 'next/link'
import { ItineraryItem } from '@/types/itinerary'
import { ItineraryItemCard } from './ItineraryItemCard'
import AddItineraryItemForm from './AddItineraryItemForm'
import { useItinerary } from '@/hooks/useItinerary'
import { formatDate } from '@/lib/utils'
// import { toast } from 'sonner' // Uncomment if using Sonner for toasts
import { CreateItineraryItemData, UpdateItineraryItemData } from '@/types/itinerary'


interface Trip {
  id: string
  title: string
  start_date: string
  end_date: string
  itinerary_items: ItineraryItem[]
  days?: Array<{
    id: string
    date: Date | string
    trip_id: string
  }>
}

interface ItineraryOverviewProps {
  trip: Trip
  userId: string
}

export default function ItineraryOverview({ trip, userId }: ItineraryOverviewProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null)  // Move this inside

  // For now, use the items from the trip prop
  const { items, loading, error, createItem, deleteItem, patchItem, refetch, reorderItems } = useItinerary(trip.id)
  const logged403Ref = useRef(false)

  useEffect(() => {
    (async () => {
      try {
        await refetch()
      } catch (e) {
        console.error('[ItineraryOverview.refetch:init]', { tripId: trip.id, error: (e as Error).message })
      }
    })()
  }, [])

  useEffect(() => {
    if (error === 'forbidden' && !logged403Ref.current) {
      logged403Ref.current = true
      console.error('[ItineraryOverview.403]', {
        component: 'ItineraryOverview',
        status: 403,
        itineraryId: trip.id,
        userId,
        endpoint: `/api/trips/${trip.id}/itinerary-items`
      })
    }
  }, [error, trip.id, userId])

  console.log('Current selectedDayId:', selectedDayId)

  // Generate days between start and end date
  const generateDays = () => {
    const days = []
    const start = new Date(trip.start_date)
    const end = new Date(trip.end_date)
  
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayNumber = Math.floor((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      const dayDate = new Date(d)
      
      // Find the actual day record from the database
      const dbDay = trip.days?.find(day => {
        const dbDate = new Date(day.date)
        return !isNaN(dbDate.getTime()) && dbDate.toDateString() === dayDate.toDateString()
      })
      
      days.push({
        id: dbDay?.id || `temp_${dayNumber}`, // Use real ID if available
        number: dayNumber,
        date: dayDate,
        items: items.filter(item => item.day === dayNumber)
      })
    }
  
    return days
  }

  const daysKey = useMemo(
    () => (trip.days ?? [])
      .map(d => {
        const dt = new Date(d.date)
        return `${d.id}:${isNaN(dt.getTime()) ? String(d.date) : dt.toDateString()}`
      })
      .join('|'),
    [trip.days]
  )

  const days = useMemo(() => generateDays(), [trip.start_date, trip.end_date, items, daysKey])

// DnD state: keep local order per day
const [dayItems, setDayItems] = useState<Record<number, ItineraryItem[]>>({})

useEffect(() => {
  const next: Record<number, ItineraryItem[]> = {}
  days.forEach(day => {
    next[day.number] = day.items
  })

  // Update only when ids changed to avoid re-render loop
  setDayItems(prev => {
    const same =
      Object.keys(next).length === Object.keys(prev).length &&
      Object.keys(next).every(k => {
        const a = next[Number(k)] ?? []
        const b = prev[Number(k)] ?? []
        if (a.length !== b.length) return false
        for (let i = 0; i < a.length; i++) {
          if (a[i]?.id !== b[i]?.id) return false
        }
        return true
      })
    return same ? prev : next
  })
}, [days])

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  // Handle drag end
  const handleDragEnd = useCallback(async (event: any, dayNumber: number) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = dayItems[dayNumber].findIndex(i => i.id === active.id)
    const newIndex = dayItems[dayNumber].findIndex(i => i.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const newOrder = arrayMove(dayItems[dayNumber], oldIndex, newIndex)
    setDayItems(prev => ({ ...prev, [dayNumber]: newOrder }))

    // Persist new order (implement reorderItems in your hook/store)
    try {
      await reorderItems(dayNumber, newOrder.map(i => i.id))
      // toast.success('Reordered successfully') // Uncomment if using Sonner
      await refetch()
    } catch (e: any) {
      console.error('[ItineraryOverview.reorderItems]', {
        tripId: trip.id,
        dayNumber,
        ids: newOrder.map(i => i.id),
        error: e?.message || e
      })
      // toast.error('Failed to reorder') // Uncomment if using Sonner
    }
  }, [dayItems, reorderItems, refetch, trip.id])

  const handleCreateItem = async (data: any) => {
    try {
      const result = await createItem(data)
      if (result.success) {
        setShowAddForm(false)
        setSelectedDayId(null)
        await refetch()  // Refresh the items
        return { ok: true, data: result.data }
      }
      console.error('[ItineraryOverview.createItem:fail]', { tripId: trip.id, data, error: result.error })
      return { ok: false, error: result.error }
    } catch (e: any) {
      console.error('[ItineraryOverview.createItem:error]', { tripId: trip.id, data, error: e?.message || e })
      return { ok: false, error: e?.message || 'Create failed' }
    }
  }
  
  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      const result = await deleteItem(id)
      if (result.success) {
        await refetch()  // Refresh the items
      } else {
        console.error('[ItineraryOverview.deleteItem:fail]', { tripId: trip.id, id, error: result.error })
      }
    } catch (e: any) {
      console.error('[ItineraryOverview.deleteItem:error]', { tripId: trip.id, id, error: e?.message || e })
    }
  }
  
  const handleUpdateItem = async (data: CreateItineraryItemData) => {
    if (!editingItem) return { ok: false, error: 'No item to edit' }
    try {
      const result = await patchItem(editingItem.id, data as UpdateItineraryItemData)
      if (result.success) {
        setShowAddForm(false)
        setSelectedDayId(null)
        setEditingItem(null)
        await refetch()  // Refresh the items
        return { 
          ok: true, 
          data: { 
            created: editingItem,
            items: [] 
          } 
        }
      }
      console.error('[ItineraryOverview.updateItem:fail]', { tripId: trip.id, id: editingItem.id, data, error: result.error })
      return { ok: false, error: result.error || 'Update failed' }
    } catch (e: any) {
      console.error('[ItineraryOverview.updateItem:error]', { tripId: trip.id, id: editingItem.id, data, error: e?.message || e })
      return { ok: false, error: e?.message || 'Update failed' }
    }
  }

  const handleEditItem = (item: ItineraryItem) => {
    setEditingItem(item)
    setSelectedDayId(item.dayId)
    setShowAddForm(true)
  }

  if (error === 'forbidden') {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <h2 className="text-xl font-semibold text-red-700 mb-2">No access</h2>
        <p className="text-red-600 mb-4">You don’t have access to this itinerary.</p>
        <Link href="/dashboard/trips" className="text-blue-600 hover:underline">Back to trips</Link>
      </div>
    )
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
            + Add Activity
          </button>
          <Link
              href="/dashboard/itinerary/today"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors border-green-600"
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
              <h2 className="text-xl font-semibold">
                {editingItem ? 'Edit Itinerary Item' : 'Add New Itinerary Item'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingItem(null)
                }}
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
                  value={selectedDayId || ''}
                  onChange={(e) => setSelectedDayId(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a day</option>
                {days.map((day) => (
                    <option key={day.id} value={day.id}>
                      Day {day.number} - {day.date.toLocaleDateString()}
                    </option>
                ))}
              </select>
              </div>
              {selectedDayId && (
                
                <AddItineraryItemForm
                  dayId={selectedDayId}
                  initialData={editingItem ? {
                    title: editingItem.title,
                    description: editingItem.description || undefined,
                    type: editingItem.type as any,
                    startTime: editingItem.startTime || undefined,
                    endTime: editingItem.endTime || undefined,
                    locationId: editingItem.locationId || undefined,
                    dayId: editingItem.dayId  // Add this line - include the dayId
                  } : undefined}
                  isEdit={!!editingItem}
                  activeTripId={trip.id}
                  onSubmit={editingItem ? handleUpdateItem : handleCreateItem}
                  onCancel={() => {
                    setShowAddForm(false)
                    setSelectedDayId(null)
                    setEditingItem(null)
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
                    href={`/dashboard/itinerary/day/${day.number}`}
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
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={event => handleDragEnd(event, day.number)}
                >
                  <SortableContext
                    items={dayItems[day.number]?.map(i => i.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {dayItems[day.number]?.map((item) => (
                        <ItineraryItemCard
                        key={item.id}
                        item={item}
                        className="bg-gray-50"
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                      />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No items planned for this day</p>
                  <button
                    onClick={() => {
                      setSelectedDayId(day.id)
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