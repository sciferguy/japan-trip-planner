// components/itinerary/AddItineraryItemForm.tsx
import { useState } from 'react'
import { CreateItineraryItemData, ItineraryItem } from '@/types/itinerary'

interface AddItineraryItemFormProps {
  tripId: string
  day: number
  userId: string
  onSubmit: (data: CreateItineraryItemData) => Promise<{
    success: boolean
    error?: string
    overlaps?: any[]
    data?: ItineraryItem
  }>
  onCancel?: () => void
}

export function AddItineraryItemForm({
  tripId,
  day,
  userId,
  onSubmit,
  onCancel
}: AddItineraryItemFormProps) {
  const [formData, setFormData] = useState<Partial<CreateItineraryItemData>>({
    trip_id: tripId,
    day,
    created_by: userId,
    type: 'ACTIVITY'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [overlaps, setOverlaps] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) return

    setLoading(true)
    setError(null)
    setOverlaps([])

    const result = await onSubmit(formData as CreateItineraryItemData)

    if (result.success) {
      // Reset form
      setFormData({
        trip_id: tripId,
        day,
        created_by: userId,
        type: 'ACTIVITY'
      })
      onCancel?.()
    } else {
      setError(result.error || 'Failed to create item')
      if (result.overlaps) {
        setOverlaps(result.overlaps)
      }
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-4">Add New Item</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-sm text-red-800">{error}</p>
          {overlaps.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-red-700 font-medium">Time conflicts with:</p>
              {overlaps.map((overlap, idx) => (
                <p key={idx} className="text-xs text-red-600">
                  • {overlap.title} ({formatTime(overlap.start_time)} - {formatTime(overlap.end_time)})
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter activity title"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Optional description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ACTIVITY">Activity</option>
            <option value="TRANSPORT">Transport</option>
            <option value="MEAL">Meal</option>
            <option value="ACCOMMODATION">Accommodation</option>
            <option value="MEETING">Meeting</option>
            <option value="FREE_TIME">Free Time</option>
          </select>
        </div>

        <div></div> {/* Empty div for grid spacing */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="datetime-local"
            value={formData.start_time ? formData.start_time.slice(0, 16) : ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              start_time: e.target.value ? new Date(e.target.value).toISOString() : undefined
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="datetime-local"
            value={formData.end_time ? formData.end_time.slice(0, 16) : ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              end_time: e.target.value ? new Date(e.target.value).toISOString() : undefined
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !formData.title}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? 'Creating...' : 'Add Item'}
        </button>
      </div>
    </form>
  )
}

// Helper function for the overlap display
function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}