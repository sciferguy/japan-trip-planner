// app/dashboard/places/page.tsx
'use client'

import React, { useState } from 'react'
import { PlaceForm } from '@/components/places/PlaceForm'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useCurrentTrip } from '@/hooks/useCurrentTrip'
import { usePlaces } from '@/hooks/usePlaces'
import { Search, MapPin, Plus } from 'lucide-react'

interface Place {
  id: string
  name: string
  address?: string
  lat?: number
  lng?: number
  source_url?: string
  category?: string
  created_at: string
}

export default function PlacesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlace, setEditingPlace] = useState<Place | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { tripId, loading: tripLoading, currentTrip } = useCurrentTrip()
  const { places, loading: placesLoading, error, refetch } = usePlaces()

  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.address?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePlaceSubmit = () => {
    refetch()
    setIsFormOpen(false)
    setEditingPlace(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this place?')) return

    try {
      const response = await fetch(`/api/places/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        refetch()
      }
    } catch (error) {
      console.error('Failed to delete place:', error)
    }
  }

  if (tripLoading || placesLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!tripId) {
    return (
      <Card className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500 mb-4">No trip selected</p>
        <p className="text-sm text-gray-400">Please create a trip first</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="text-center py-12">
        <p className="text-red-500 mb-4">Error loading places: {error}</p>
        <Button onClick={refetch} variant="outline">
          Try Again
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Places</h1>
          {currentTrip && (
            <p className="text-sm text-gray-600 mt-1">
              for {currentTrip.title || 'Untitled Trip'}
            </p>
          )}
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Place
        </Button>
      </div>

      {places.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {places.length === 0 ? (
        <Card className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No places added yet</p>
          <p className="text-sm text-gray-400 mb-4">
            Add places to organize your trip itinerary
          </p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Place
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPlaces.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-500">No places match your search</p>
            </Card>
          ) : (
            filteredPlaces.map((place) => (
              <Card key={place.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{place.name}</h3>
                    {place.address && (
                      <p className="text-gray-600 mt-1 text-sm">{place.address}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {place.category && (
                        <Badge variant="secondary">{place.category}</Badge>
                      )}
                      {place.source_url && (
                        <a
                          href={place.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                        >
                          <MapPin className="h-3 w-3" />
                          View on Maps
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingPlace(place)
                        setIsFormOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(place.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {isFormOpen && (
        <PlaceForm
          tripId={tripId}
          place={editingPlace}
          onSubmit={handlePlaceSubmit}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingPlace(null)
          }}
        />
      )}
    </div>
  )
}