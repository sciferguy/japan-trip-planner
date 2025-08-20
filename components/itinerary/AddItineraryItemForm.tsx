// components/itinerary/AddItineraryItemForm.tsx
import { useState } from 'react'
import { CreateItineraryItemData, ItineraryItem } from '@/types/itinerary'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) return
    setLoading(true)
    setError(null)
    const res = await onSubmit(formData as CreateItineraryItemData)
    if (res.ok) {
      setFormData({ dayId, type: 'ACTIVITY' })
      onCancel?.()
    } else {
      setError(res.error || 'Failed')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-4">Add New Item</h3>
      {error && (
        <div className="bg-red-50 border border-red-200 text-sm text-red-700 rounded p-2 mb-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              required
              value={formData.title || ''}
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
              placeholder="Title"
            />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows={2}
            value={formData.description || ''}
            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={formData.type}
            onChange={e => setFormData(p => ({ ...p, type: e.target.value as any }))}
            className="w-full px-3 py-2 border rounded"
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
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input
            type="datetime-local"
            value={formData.startTime ? formData.startTime.slice(0, 16) : ''}
            onChange={e =>
              setFormData(p => ({
                ...p,
                startTime: e.target.value ? new Date(e.target.value).toISOString() : undefined
              }))
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <input
            type="datetime-local"
            value={formData.endTime ? formData.endTime.slice(0, 16) : ''}
            onChange={e =>
              setFormData(p => ({
                ...p,
                endTime: e.target.value ? new Date(e.target.value).toISOString() : undefined
              }))
            }
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm border rounded bg-white"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !formData.title}
          className="px-4 py-2 text-sm rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Add Item'}
        </button>
      </div>
    </form>
  )
}