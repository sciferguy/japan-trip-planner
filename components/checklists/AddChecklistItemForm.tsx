import { useState } from 'react'

interface AddChecklistItemFormProps {
  tripId: string
  onSubmit: (data: {
    tripId: string
    title: string
    category: string
  }) => Promise<{ ok: boolean; error?: string }>
  onCancel?: () => void
}

export function AddChecklistItemForm({
  tripId,
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
      tripId,
      title: formData.title.trim(),
      category: formData.category,
    })

    if (result.ok) {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
          Item *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-tea-500 dark:focus:ring-tea-400 focus:border-tea-500"
          placeholder="Enter checklist item"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-tea-500 dark:focus:ring-tea-400 focus:border-tea-500"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-stone-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !formData.title.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-tea-600 dark:bg-tea-500 rounded-md hover:bg-tea-700 dark:hover:bg-tea-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </div>
    </form>
  )
}