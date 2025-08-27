'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useCurrentTrip } from '@/hooks/useCurrentTrip'
import { 
  Plus, 
  Trash2, 
  Check, 
  Square, 
  CheckSquare,
  Luggage,
  FileText,
  Home,
  ChevronDown,
  ChevronRight,
  Loader2,
  X
} from 'lucide-react'

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  category: string
  createdAt: Date
  updatedAt: Date
}

interface ChecklistCategory {
  id: string
  name: string
  icon: typeof Luggage
  items: ChecklistItem[]
  isCollapsed: boolean
}

export default function ChecklistPage() {
  const { data: session } = useSession()
  const { currentTrip, loading: tripLoading } = useCurrentTrip()
  const tripId = currentTrip?.id

  const [categories, setCategories] = useState<ChecklistCategory[]>([
    { id: 'GENERAL', name: 'General', icon: Home, items: [], isCollapsed: false },
    { id: 'DOCUMENTS', name: 'Documents', icon: FileText, items: [], isCollapsed: false },
    { id: 'PACKING', name: 'Packing', icon: Luggage, items: [], isCollapsed: false },
  ])
  const [newItemText, setNewItemText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('GENERAL')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // Load checklist items
  useEffect(() => {
    const loadChecklist = async () => {
      if (!tripId || !session?.user?.id) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/trips/${tripId}/checklist`)
        if (response.ok) {
          const data = await response.json()
          // Organize items by category
          const categorizedItems = categories.map(cat => ({
            ...cat,
            items: data.items?.filter((item: ChecklistItem) => item.category === cat.id) || []
          }))
          setCategories(categorizedItems)
        }
      } catch (error) {
        console.error('Error loading checklist:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadChecklist()
  }, [tripId, session])

  // Toggle item completion
  const toggleItem = async (categoryId: string, itemId: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        }
      }
      return cat
    })
    setCategories(updatedCategories)

    // Save to backend
    try {
      const item = categories
        .find(c => c.id === categoryId)
        ?.items.find(i => i.id === itemId)
      
      await fetch(`/api/trips/${tripId}/checklist/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !item?.completed })
      })
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  // Add new item
  const addItem = async () => {
    if (!newItemText.trim() || !tripId) return

    const tempId = `temp-${Date.now()}`
    const newItem: ChecklistItem = {
      id: tempId,
      text: newItemText,
      completed: false,
      category: selectedCategory,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Optimistic update
    setCategories(prev => prev.map(cat => 
      cat.id === selectedCategory 
        ? { ...cat, items: [...cat.items, newItem] }
        : cat
    ))
    setNewItemText('')
    setShowAddForm(false)

    // Save to backend
    try {
      const response = await fetch(`/api/trips/${tripId}/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newItemText,
          category: selectedCategory
        })
      })
      
      if (response.ok) {
        const savedItem = await response.json()
        // Replace temp item with saved item
        setCategories(prev => prev.map(cat =>
          cat.id === selectedCategory
            ? {
                ...cat,
                items: cat.items.map(item =>
                  item.id === tempId ? savedItem : item
                )
              }
            : cat
        ))
      }
    } catch (error) {
      console.error('Error adding item:', error)
      // Remove temp item on error
      setCategories(prev => prev.map(cat =>
        cat.id === selectedCategory
          ? { ...cat, items: cat.items.filter(item => item.id !== tempId) }
          : cat
      ))
    }
  }

  // Delete item
  const deleteItem = async (categoryId: string, itemId: string) => {
    if (!tripId) return
    
    // Optimistic update
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId
        ? { ...cat, items: cat.items.filter(item => item.id !== itemId) }
        : cat
    ))

    // Delete from backend
    try {
      await fetch(`/api/trips/${tripId}/checklist/${itemId}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  // Toggle category collapse
  const toggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId
        ? { ...cat, isCollapsed: !cat.isCollapsed }
        : cat
    ))
  }

  // Calculate progress
  const getProgress = () => {
    const allItems = categories.flatMap(cat => cat.items)
    if (allItems.length === 0) return 0
    const completed = allItems.filter(item => item.completed).length
    return Math.round((completed / allItems.length) * 100)
  }

  if (isLoading || tripLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-sakura-600" />
      </div>
    )
  }

  if (!tripId) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <h2 className="text-xl font-semibold text-stone-800 dark:text-white mb-2">
            No Trip Selected
          </h2>
          <p className="text-stone-600 dark:text-stone-400">
            Please select or create a trip first to manage your checklist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800 dark:text-white">
              Trip Checklist
            </h1>
            <p className="text-stone-600 dark:text-stone-400 mt-1">
              Keep track of everything you need for your trip
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-sakura-600 text-white rounded-lg hover:bg-sakura-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-stone-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-sakura-500 to-tea-500 h-full transition-all duration-500"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
          {getProgress()}% complete
        </p>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-800 dark:text-white">Add New Item</h3>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setNewItemText('')
                }}
                className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-stone-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-stone-800 dark:text-white"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                placeholder="Enter item..."
                className="flex-1 px-4 py-2 border border-stone-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-sakura-500"
                autoFocus
              />
              
              <button
                onClick={addItem}
                disabled={!newItemText.trim()}
                className="px-4 py-2 bg-sakura-600 text-white rounded-lg hover:bg-sakura-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-4">
        {categories.map(category => {
          const Icon = category.icon
          const completedCount = category.items.filter(item => item.completed).length
          const totalCount = category.items.length

          return (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-stone-600 dark:text-stone-400" />
                  <h2 className="text-lg font-semibold text-stone-800 dark:text-white">
                    {category.name}
                  </h2>
                  <span className="text-sm text-stone-500 dark:text-stone-400">
                    {completedCount}/{totalCount}
                  </span>
                </div>
                {category.isCollapsed ? (
                  <ChevronRight className="h-5 w-5 text-stone-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-stone-400" />
                )}
              </button>

              {!category.isCollapsed && (
                <div className="px-6 pb-4 space-y-2">
                  {category.items.length === 0 ? (
                    <p className="text-stone-500 dark:text-stone-400 text-sm py-4 text-center">
                      No items yet. Add your first item above!
                    </p>
                  ) : (
                    category.items.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 dark:hover:bg-gray-700 group transition-colors"
                      >
                        <button
                          onClick={() => toggleItem(category.id, item.id)}
                          className="flex-shrink-0"
                        >
                          {item.completed ? (
                            <CheckSquare className="h-5 w-5 text-tea-600 dark:text-tea-400" />
                          ) : (
                            <Square className="h-5 w-5 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300" />
                          )}
                        </button>
                        
                        <span className={`flex-1 ${item.completed ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-700 dark:text-stone-200'}`}>
                          {item.text}
                        </span>
                        
                        <button
                          onClick={() => deleteItem(category.id, item.id)}
                          className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-600 dark:text-stone-500 dark:hover:text-red-400 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick Add Suggestions */}
      <div className="bg-gradient-to-r from-sakura-50 to-tea-50 dark:from-sakura-900/20 dark:to-tea-900/20 rounded-xl p-6">
        <h3 className="font-semibold text-stone-800 dark:text-white mb-3">Quick Add Suggestions</h3>
        <div className="flex flex-wrap gap-2">
          {['Passport', 'JR Pass', 'Phone charger', 'Universal adapter', 'Comfortable shoes', 'Rain jacket', 'Medication', 'Travel insurance'].map(suggestion => (
            <button
              key={suggestion}
              onClick={() => {
                setNewItemText(suggestion)
                setShowAddForm(true)
              }}
              className="px-3 py-1.5 bg-white dark:bg-gray-700 text-stone-600 dark:text-stone-300 rounded-lg text-sm hover:bg-sakura-100 dark:hover:bg-sakura-900/30 hover:text-sakura-700 dark:hover:text-sakura-300 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}