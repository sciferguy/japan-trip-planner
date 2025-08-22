// components/places/PlaceForm.tsx
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, X } from 'lucide-react'

interface Place {
  id: string
  name: string
  address?: string
  lat?: number
  lng?: number
  source_url?: string
  category?: string
}

interface PlaceFormProps {
  tripId: string | null
  place?: Place | null
  onSubmit: () => void
  onCancel: () => void
}

export function PlaceForm({ tripId, place, onSubmit, onCancel }: PlaceFormProps) {
  const [formData, setFormData] = useState({
    name: place?.name || '',
    address: place?.address || '',
    source_url: place?.source_url || '',
    category: place?.category || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tripId) return

    setIsSubmitting(true)
    setError('')

    try {
      const url = place
          ? `/api/places/${place.id}`
          : `/api/places?tripId=${tripId}`
      const method = place ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.ok) {
        onSubmit()
      } else {
        setError(data.error?.message || 'Failed to save place')
      }
    } catch (error) {
      setError('Network error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleParseUrl = async () => {
    if (!formData.source_url) return

    setIsParsing(true)
    try {
      const response = await fetch('/api/places/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.source_url })
      })

      const data = await response.json()

      if (data.ok && data.data.parsed) {
        setFormData(prev => ({
          ...prev,
          name: prev.name || data.data.name,
          address: prev.address || data.data.address
        }))
      }
    } catch (error) {
      console.error('Failed to parse URL:', error)
    } finally {
      setIsParsing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full shadow-zen dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <MapPin className="h-5 w-5" />
            {place ? 'Edit Place' : 'Add Place'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="source_url" className="dark:text-stone-300">Google Maps URL (optional)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="source_url"
                  type="url"
                  value={formData.source_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, source_url: e.target.value }))}
                  placeholder="https://maps.google.com/..."
                  className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                {formData.source_url && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleParseUrl}
                    disabled={isParsing}
                    className="dark:border-gray-600 dark:text-stone-300"
                  >
                    {isParsing ? '...' : 'Parse'}
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="name" className="dark:text-stone-300">Name *</Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="address" className="dark:text-stone-300">Address</Label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                rows={2}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tea-500 focus:border-tea-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-tea-400"
              />
            </div>

            <div>
              <Label htmlFor="category" className="dark:text-stone-300">Category</Label>
              <Input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Restaurant, Museum, etc."
                className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-tea-600 hover:bg-tea-700 dark:bg-tea-500 dark:hover:bg-tea-600"
              >
                {isSubmitting ? 'Saving...' : (place ? 'Update' : 'Add Place')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 dark:border-gray-600 dark:text-stone-300"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}