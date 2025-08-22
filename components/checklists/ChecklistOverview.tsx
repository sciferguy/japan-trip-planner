'use client'

import { useState, useEffect } from 'react'
import { AddChecklistItemForm } from './AddChecklistItemForm'

interface ChecklistItem {
  id: string
  tripId: string
  userId: string
  title: string
  category: string
  completed: boolean
  createdAt: string
}

interface ChecklistOverviewProps {
  tripId: string
  userId: string
}

export default function ChecklistOverview({ tripId, userId }: ChecklistOverviewProps) {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      // Fix: Use correct parameter name
      const response = await fetch(`/api/checklists?tripId=${tripId}`)
      const result = await response.json()

      if (result.ok) {
        setItems(result.data)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('Failed to fetch checklist items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [tripId])

  const createItem = async (data: any) => {
    try {
      const response = await fetch('/api/checklists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.ok) {
        await fetchItems()
      }

      return result
    } catch (error) {
      return { ok: false, error: 'Failed to create item' }
    }
  }

  const toggleItem = async (itemId: string, completed: boolean) => {
    try {
      // Fix: Use correct endpoint
      const response = await fetch(`/api/checklists/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })

      if (response.ok) {
        await fetchItems()
      }
    } catch (error) {
      console.error('Failed to update item:', error)
    }
  }

  const deleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      // Fix: Use correct endpoint
      const response = await fetch(`/api/checklists/${itemId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchItems()
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  const categories = [
    { key: 'PACKING', label: 'Packing', icon: '🎒' },
    { key: 'DOCUMENTS', label: 'Documents', icon: '📄' },
    { key: 'SHOPPING', label: 'Shopping', icon: '🛒' },
    { key: 'PREPARATION', label: 'Preparation', icon: '📋' },
    { key: 'OTHER', label: 'Other', icon: '📝' },
  ]

  const getProgress = (categoryItems: ChecklistItem[]) => {
    if (!categoryItems?.length) return 0
    return Math.round((categoryItems.filter(item => item.completed).length / categoryItems.length) * 100)
  }

  if (loading) {
    return <div className="text-center py-8 dark:text-stone-300">Loading checklists...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Checklists</h1>
          <p className="text-gray-600 dark:text-stone-400">
            {items.filter(i => i.completed).length} of {items.length} items completed
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-tea-600 text-white px-4 py-2 rounded-lg hover:bg-tea-700 dark:bg-tea-500 dark:hover:bg-tea-600 transition-colors"
        >
          + Add Item
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold dark:text-white">Add Checklist Item</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <AddChecklistItemForm
                tripId={tripId}
                onSubmit={createItem}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-6">
        {categories.map(category => {
          const categoryItems = itemsByCategory[category.key] || []
          const progress = getProgress(categoryItems)

          return (
            <div key={category.key} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{category.label}</h3>
                      <p className="text-sm text-gray-600 dark:text-stone-400">
                        {categoryItems.filter(i => i.completed).length} of {categoryItems.length} complete
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-tea-500 dark:bg-tea-400 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-stone-300">{progress}%</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {categoryItems.length > 0 ? (
                  <div className="space-y-2">
                    {categoryItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={(e) => toggleItem(item.id, e.target.checked)}
                          className="h-4 w-4 text-tea-600 dark:text-tea-500 rounded focus:ring-tea-500 dark:focus:ring-tea-400"
                        />
                        <span className={`flex-1 ${item.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                          {item.title}
                        </span>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No items in this category</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}