// components/places/PlaceSelector.tsx
'use client'

import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePlaces } from '@/hooks/usePlaces'
import { Loader2, Plus, MapPin, ExternalLink } from 'lucide-react'

interface PlaceSelectorProps {
  value?: string
  onValueChange: (placeId: string) => void
  placeholder?: string
  disabled?: boolean
}

interface CreatePlaceFormData {
  name: string
  address: string
  googleUrl: string
  category: string
  lat: number | null
  lng: number | null
}

export function PlaceSelector({
  value,
  onValueChange,
  placeholder = "Select a place...",
  disabled = false
}: PlaceSelectorProps) {
  const { places, loading, createPlace } = usePlaces()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState<CreatePlaceFormData>({
    name: '',
    address: '',
    googleUrl: '',
    category: '',
    lat: null,
    lng: null
  })
  const [formLoading, setFormLoading] = useState(false)
  const [parseLoading, setParseLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleOpenCreateForm = () => {
    setShowCreateForm(true)
    setFormData({
      name: '',
      address: '',
      googleUrl: '',
      category: '',
      lat: null,
      lng: null
    })
    setFormError(null)
  }

  const handleCloseCreateForm = () => {
    setShowCreateForm(false)
    setFormData({
      name: '',
      address: '',
      googleUrl: '',
      category: '',
      lat: null,
      lng: null
    })
    setFormError(null)
  }

  const handleParseGoogleUrl = async () => {
    if (!formData.googleUrl.trim()) {
      setFormError('Please enter a Google Maps URL')
      return
    }

    setParseLoading(true)
    setFormError(null)

    try {
      const response = await fetch('/api/places/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.googleUrl.trim() })
      })

      if (!response.ok) {
        throw new Error('Failed to parse URL')
      }

      const result = await response.json()

      if (result.error) {
        setFormError(result.error)
        return
      }

      setFormData(prev => ({
        ...prev,
        name: result.name || prev.name,
        address: result.address || prev.address,
        lat: result.lat,
        lng: result.lng
      }))

      if (!result.parsed) {
        setFormError('Could not extract location data from URL. Please fill in details manually.')
      }
    } catch (error) {
      console.error('Parse error:', error)
      setFormError('Failed to parse Google Maps URL')
    } finally {
      setParseLoading(false)
    }
  }

  const handleCreatePlace = async () => {
    if (!formData.name.trim()) {
      setFormError('Place name is required')
      return
    }

    setFormLoading(true)
    setFormError(null)

    try {
      const placeData = {
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        lat: formData.lat,
        lng: formData.lng,
        source_url: formData.googleUrl.trim() || undefined,
        category: formData.category.trim() || undefined
      }

      const newPlace = await createPlace(placeData)

      // Select the newly created place
      onValueChange(newPlace.id)
      handleCloseCreateForm()
    } catch (error: unknown) {
      console.error('Create place error:', error)
      setFormError(error instanceof Error ? error.message : 'Failed to create place')
    } finally {
      setFormLoading(false)
    }
  }

  const selectedPlace = places.find(p => p.id === value)

  return (
    <>
      <Select value={value || ''} onValueChange={onValueChange} disabled={disabled || loading}>
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Loading places..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">-- No place selected --</SelectItem>

          {/* Add new place option */}
          <div
            className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleOpenCreateForm()
            }}
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium text-primary">Add new place...</span>
          </div>

          {places.map((place) => (
            <SelectItem key={place.id} value={place.id}>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{place.name}</span>
                  {place.lat && place.lng && (
                    <MapPin className="h-3 w-3 text-green-600" />
                  )}
                  {!place.lat && !place.lng && (
                    <MapPin className="h-3 w-3 text-gray-400" />
                  )}
                </div>
                {place.category && (
                  <span className="text-xs text-gray-500">{place.category}</span>
                )}
                {place.address && (
                  <span className="text-xs text-gray-400 truncate">{place.address}</span>
                )}
                {!place.lat && !place.lng && (
                  <span className="text-xs text-orange-600">No coordinates</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Show selected place info */}
      {selectedPlace && (
        <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{selectedPlace.name}</div>
              {selectedPlace.address && (
                <div className="text-gray-600">{selectedPlace.address}</div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {selectedPlace.lat && selectedPlace.lng ? (
                  `📍 ${selectedPlace.lat.toFixed(6)}, ${selectedPlace.lng.toFixed(6)}`
                ) : (
                  '📍 No coordinates'
                )}
              </div>
            </div>
            {selectedPlace.source_url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(selectedPlace.source_url!, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Create Place Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Place</DialogTitle>
            <DialogDescription>
              Create a new place for your trip. You can paste a Google Maps URL to auto-fill details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Google Maps URL */}
            <div className="space-y-2">
              <Label htmlFor="googleUrl">Google Maps URL (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="googleUrl"
                  value={formData.googleUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, googleUrl: e.target.value }))}
                  placeholder="https://maps.google.com/..."
                  disabled={formLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleParseGoogleUrl}
                  disabled={parseLoading || !formData.googleUrl.trim()}
                >
                  {parseLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Parse'}
                </Button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Place name"
                disabled={formLoading}
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Street address"
                disabled={formLoading}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Restaurant, Temple, Hotel"
                disabled={formLoading}
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={formData.lat || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    lat: e.target.value ? parseFloat(e.target.value) : null
                  }))}
                  placeholder="35.6762"
                  disabled={formLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  value={formData.lng || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    lng: e.target.value ? parseFloat(e.target.value) : null
                  }))}
                  placeholder="139.6503"
                  disabled={formLoading}
                />
              </div>
            </div>

            {formError && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {formError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCreateForm} disabled={formLoading}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlace} disabled={formLoading || !formData.name.trim()}>
              {formLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Place
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}