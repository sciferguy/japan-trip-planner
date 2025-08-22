// components/itinerary/AddItineraryItemForm.tsx
import { useState } from 'react'
import { CreateItineraryItemData, ItineraryItem } from '@/types/itinerary'
import { PlaceSelector } from '@/components/places/PlaceSelector'
import { usePlaces } from '@/hooks/usePlaces'

type ItineraryItemType = 'ACTIVITY' | 'TRANSPORT' | 'MEAL' | 'ACCOMMODATION' | 'MEETING' | 'FREE_TIME'

interface AddItineraryItemFormProps {
  dayId: string
  onSubmit: (data: CreateItineraryItemData) => Promise<{
    ok: boolean
    error?: string
    data?: { created: ItineraryItem; items: ItineraryItem[] }
  }>
  onCancel?: () => void
}

export function AddItineraryItemForm({ dayId, onSubmit, onCancel }: AddItineraryItemFormProps) {
  const [formData, setFormData] = useState<Partial<CreateItineraryItemData>>({
    dayId,
    type: 'ACTIVITY'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('')

  const { places } = usePlaces()

  const handlePlaceSelect = (placeId: string) => {
    setSelectedPlaceId(placeId)

    if (placeId) {
      const place = places.find(p => p.id === placeId)
      if (place) {
        setFormData(prev => ({
          ...prev,
          title: prev.title || place.name,
          description: prev.description || (place.address ? `Location: ${place.address}` : ''),
          locationId: place.id
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        locationId: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) return
    setLoading(true)
    setError(null)
    const res = await onSubmit(formData as CreateItineraryItemData)
    if (res.ok) {
      setFormData({ dayId, type: 'ACTIVITY' })
      setSelectedPlaceId('')
      onCancel?.()
    } else {
      setError(res.error || 'Failed')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-medium text-gray-900 dark:text-white mb-4">Add New Item</h3>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400 rounded p-2 mb-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Place Selector */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 dark:text-stone-300">
            Select from Places (optional)
          </label>
          <PlaceSelector
            value={selectedPlaceId}
            onValueChange={handlePlaceSelect}
            placeholder="-- Select a place or enter manually --"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 dark:text-stone-300">Title *</label>
          <input
            required
            value={formData.title || ''}
            onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-tea-500 dark:focus:ring-tea-400 focus:border-tea-500"
            placeholder="Enter activity title"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 dark:text-stone-300">Description</label>
          <textarea
            rows={2}
            value={formData.description || ''}
            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-tea-500 dark:focus:ring-tea-400 focus:border-tea-500"
            placeholder="Optional description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-stone-300">Type</label>
          <select
            value={formData.type}
            onChange={e => setFormData(p => ({ ...p, type: e.target.value as ItineraryItemType }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-tea-500 dark:focus:ring-tea-400 focus:border-tea-500"
          >
            <option value="ACTIVITY">Activity</option>
            <option value="TRANSPORT">Transport</option>
            <option value="MEAL">Meal</option>
            <option value="ACCOMMODATION">Accommodation</option>
            <option value="MEETING">Meeting</option>
            <option value="FREE_TIME">Free Time</option>
          </select>
        </div>

        <div />

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-stone-300">Start Time</label>
          <input
            type="datetime-local"
            value={formData.startTime ? formData.startTime.slice(0, 16) : ''}
            onChange={e =>
              setFormData(p => ({
                ...p,
                startTime: e.target.value ? new Date(e.target.value).toISOString() : undefined
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-tea-500 dark:focus:ring-tea-400 focus:border-tea-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-stone-300">End Time</label>
          <input
            type="datetime-local"
            value={formData.endTime ? formData.endTime.slice(0, 16) : ''}
            onChange={e =>
              setFormData(p => ({
                ...p,
                endTime: e.target.value ? new Date(e.target.value).toISOString() : undefined
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-tea-500 dark:focus:ring-tea-400 focus:border-tea-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-stone-300"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !formData.title}
          className="px-4 py-2 text-sm rounded bg-tea-600 hover:bg-tea-700 dark:bg-tea-500 dark:hover:bg-tea-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Add Item'}
        </button>
      </div>
    </form>
  )
}