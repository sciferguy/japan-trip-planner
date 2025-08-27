// components/itinerary/AddItineraryItemForm.tsx
import { useState } from 'react'
import { CreateItineraryItemData, ItineraryItem } from '@/types/itinerary'
import PlaceSelector from '@/components/places/PlaceSelector'
type ItineraryItemType = 'ACTIVITY' | 'TRANSPORT' | 'MEAL' | 'ACCOMMODATION' | 'MEETING' | 'FREE_TIME'
type SelectorPlace = { id: string; name: string; trip_id: string }

interface AddItineraryItemFormProps {
  dayId: string
  initialData?: Partial<CreateItineraryItemData>
  isEdit?: boolean
  activeTripId: string
  onSubmit: (data: CreateItineraryItemData) => Promise<{
    ok: boolean
    error?: string
    data?: { created: ItineraryItem; items: ItineraryItem[] }
  }>
  onCancel?: () => void
}

export default function AddItineraryItemForm({
  dayId, 
  initialData,
  isEdit = false,
  activeTripId,
  onSubmit, 
  onCancel 
}: AddItineraryItemFormProps) {
  const extractTime = (isoString: string | undefined) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    const hours = date.getUTCHours().toString().padStart(2, '0')
    const minutes = date.getUTCMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }
  
  const [formData, setFormData] = useState<Partial<CreateItineraryItemData>>({
    dayId,
    type: 'ACTIVITY',
    ...initialData
  })

  const initialPlace: SelectorPlace | null = initialData?.locationId
    ? { id: initialData.locationId, name: initialData.title || '', trip_id: activeTripId }
    : null

  const [place, setPlace] = useState<SelectorPlace | null>(initialPlace)
  const [copying, setCopying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePlaceChange = (p: SelectorPlace | null) => {
    setPlace(p)
    if (p) {
        setFormData(prev => ({
          ...prev,
        title: prev.title || p.name,
        locationId: p.id
        }))
    } else {
      setFormData(prev => ({
        ...prev,
        locationId: undefined
      }))
    }
  }

  const handleCrossTripSelect = async (p: SelectorPlace) => {
    if (!activeTripId) return
    setCopying(true)
    setError(null)
    try {
      const res = await fetch('/api/places/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourcePlaceId: p.id, targetTripId: activeTripId })
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.ok) {
        setError(data?.error?.message || 'Failed to copy place')
        setCopying(false)
        return
      }
      const newPlaceId = data.data.newPlaceId
      const newPlace = { id: newPlaceId, name: p.name, trip_id: activeTripId }
      setPlace(newPlace)
      setFormData(prev => ({
        ...prev,
        title: prev.title || p.name,
        locationId: newPlaceId
              }))
    } catch (e: any) {
      setError(e?.message || 'Failed to copy place')
    } finally {
      setCopying(false)
            }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title) return
    
    if (place && place.trip_id !== activeTripId) {
      setError('This place belongs to a different trip. Please copy it into this trip first.')
      return
    }

    setLoading(true)
    const res = await onSubmit(formData as CreateItineraryItemData)
    
    if (res.ok) {
      setFormData({ dayId, type: 'ACTIVITY' })
      setPlace(null)
      onCancel?.()
    } else {
      setError(res.error || 'Failed')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-medium text-gray-900 dark:text-white mb-4">
        {isEdit ? 'Edit Item' : 'Add New Item'}
      </h3>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400 rounded p-2 mb-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 dark:text-stone-300">
            Select from Places (optional)
          </label>
          <PlaceSelector
            activeTripId={activeTripId}
            value={place}
            onChange={handlePlaceChange}
            onCrossTripSelect={handleCrossTripSelect}
            placeholder="-- Select a place or enter manually --"
          />
          {copying && <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Copying place…</div>}
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
            type="time"
            value={extractTime(formData.startTime)}
            onChange={e =>
              setFormData(p => ({
                ...p,
                startTime: e.target.value ? `2024-01-01T${e.target.value}:00.000Z` : undefined
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-tea-500 dark:focus:ring-tea-400 focus:border-tea-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-stone-300">End Time</label>
          <input
            type="time"
            value={extractTime(formData.endTime)}
            onChange={e =>
              setFormData(p => ({
                ...p,
                endTime: e.target.value ? `2024-01-01T${e.target.value}:00.000Z` : undefined
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
          {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Item' : 'Add Item')}
        </button>
      </div>
    </form>
  )
}
