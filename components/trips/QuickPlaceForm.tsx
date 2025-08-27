'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface QuickPlaceFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function QuickPlaceForm({ onSubmit, onCancel }: QuickPlaceFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    category: ''
  })
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])

  const handleNameChange = async (value: string) => {
    setFormData(prev => ({ ...prev, name: value }))

    if (value.length > 2) {
      setIsSearching(true)
      try {
        const response = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(value)}`)
        const data = await response.json()

        if (data.predictions) {
          setSuggestions(data.predictions.slice(0, 5))
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setIsSearching(false)
      }
    } else {
      setSuggestions([])
    }
  }

  const selectSuggestion = async (suggestion: any) => {
    setIsSearching(true)
    try {
      const response = await fetch(`/api/places/details?place_id=${suggestion.place_id}`)
      const data = await response.json()

      if (data.result) {
        setFormData(prev => ({
          ...prev,
          name: data.result.name,
          address: data.result.formatted_address,
          category: data.result.types?.[0]?.replace(/_/g, ' ') || prev.category
        }))
      }
      setSuggestions([])
    } catch (error) {
      console.error('Error fetching place details:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Label htmlFor="place-name">Place Name *</Label>
        <Input
          id="place-name"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Bar Centifolia, Tokyo Station, LAX Airport..."
          className="mt-1"
          required
        />
        {isSearching && (
          <p className="text-xs text-muted-foreground mt-1">Searching...</p>
        )}

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm border-b last:border-b-0"
                onClick={() => selectSuggestion(suggestion)}
              >
                <div className="font-medium">{suggestion.structured_formatting?.main_text}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {suggestion.structured_formatting?.secondary_text}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="place-address">Address</Label>
        <Input
          id="place-address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          placeholder="Auto-populated when you select a place"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="place-category">Category (Optional)</Label>
        <Input
          id="place-category"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          placeholder="Restaurant, Temple, Shopping..."
          className="mt-1"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1 bg-tea-600 hover:bg-tea-700">
          Add Place
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
}