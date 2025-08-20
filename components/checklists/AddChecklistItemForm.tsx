// components/checklists/AddChecklistItemForm.tsx
import { useState } from 'react'

interface AddChecklistItemFormProps {
  tripId: string
  userId: string
  onSubmit: (data: {
    trip_id: string
    title: string
    category: string
    user_id: string
  }) => Promise<{ success: boolean; error?: string }>
  onCancel?: () => void
}

export function AddChecklistItemForm({
  tripId,
  userId,
  onSubmit,
  onCancel
}: AddChecklistItemFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'PREPARATION' as const
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setLoading(true)
    setError(null)

    const result = await onSubmit({
      trip_id: tripId,
      title: formData.title.trim(),
      category: formData.category,
      user_id: userId,
    })

    if (result.success) {
      setFormData({ title: '', category: 'PREPARATION' })
      onCancel?.()
    } else {
      setError(result.error || 'Failed to create item')
    }

    setLoading(false)
  }

  const categories = [
    { value: 'PACKING', label: 'Packing' },
    { value: 'DOCUMENTS', label: 'Documents' },
    { value: 'SHOPPING', label: 'Shopping' },
    { value: 'PREPARATION', label: 'Preparation' },
    { value: 'OTHER', label: 'Other' },
  ]

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-4">Add Checklist Item</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter checklist item"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
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
          disabled={loading || !formData.title.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </div>
    </form>
  )
}