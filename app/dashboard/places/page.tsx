'use client'

import React, { useState, useMemo } from 'react'
import { PlaceForm } from '@/components/places/PlaceForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useCurrentTrip } from '@/hooks/useCurrentTrip'
import { usePlaces } from '@/hooks/usePlaces'
import { 
  Search, 
  MapPin, 
  Plus, 
  Map, 
  List, 
  Bookmark,
  Navigation,
  Layers,
  Filter
} from 'lucide-react'

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

type ViewMode = 'map' | 'list' | 'saved'

export default function PlacesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlace, setEditingPlace] = useState<Place | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showLayers, setShowLayers] = useState(false)

  const { tripId, loading: tripLoading, currentTrip } = useCurrentTrip()
  const { places, loading: placesLoading, error, refetch } = usePlaces()

  // Get unique categories from places
  const categories = useMemo(() => {
    const cats = new Set(places.map(p => p.category).filter(Boolean))
    return Array.from(cats) as string[]
  }, [places])

  // Filter places based on search and categories
  const filteredPlaces = places.filter(place => {
    const matchesSearch = !searchQuery || 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategories.length === 0 || 
      (place.category && selectedCategories.includes(place.category))
    
    return matchesSearch && matchesCategory
  })

  // Generate Google Maps embed URL with markers
  const getMapEmbedUrl = () => {
    if (!filteredPlaces.length) {
      // Default to Tokyo if no places
      return `https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}&center=35.6762,139.6503&zoom=10`
    }
    
    // For MVP, show first place or center of all places
    const firstPlace = filteredPlaces[0]
    if (firstPlace.lat && firstPlace.lng) {
      return `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}&q=${encodeURIComponent(firstPlace.name)}&center=${firstPlace.lat},${firstPlace.lng}&zoom=13`
    }
    
    // Fallback to search by name
    return `https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}&q=${encodeURIComponent(filteredPlaces.map(p => p.name).join('|'))}`
  }

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

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  if (tripLoading || placesLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
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
    <div className="space-y-4">
      {/* Header with View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Places</h1>
          {currentTrip && (
            <p className="text-sm text-gray-600 mt-1">
              for {currentTrip.title || 'Untitled Trip'}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Map className="h-4 w-4" />
              Map
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <List className="h-4 w-4" />
              List
            </button>
            <button
              onClick={() => setViewMode('saved')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'saved'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              Saved
            </button>
          </div>
          
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Place
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {viewMode === 'map' && (
          <Button
            variant="outline"
            onClick={() => setShowLayers(!showLayers)}
            className="flex items-center gap-2"
          >
            <Layers className="h-4 w-4" />
            Filters
          </Button>
        )}
      </div>

      {/* Category Filters (visible when showLayers is true) */}
      {showLayers && categories.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Categories:</span>
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
            {selectedCategories.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategories([])}
                className="text-xs"
              >
                Clear filters
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map View */}
        {viewMode === 'map' && (
          <>
            <div className="lg:col-span-3">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {filteredPlaces.length === 0 && !searchQuery ? (
                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 mb-2">No places added yet</p>
                        <Button onClick={() => setIsFormOpen(true)} size="sm">
                          Add Your First Place
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-video bg-gray-100">
                      {/* Google Maps Embed - Replace with your API key */}
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={getMapEmbedUrl()}
                      />
                      {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                          <div className="text-center">
                            <p className="mb-2">Google Maps API key required</p>
                            <p className="text-sm">Add NEXT_PUBLIC_GOOGLE_MAPS_KEY to your .env.local</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar for Map View */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    Places ({filteredPlaces.length})
                    <Navigation className="h-4 w-4 text-gray-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredPlaces.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      {searchQuery ? 'No places match your search' : 'No places added'}
                    </p>
                  ) : (
                    filteredPlaces.map((place) => (
                      <div
                        key={place.id}
                        className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{place.name}</p>
                            {place.category && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                {place.category}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingPlace(place)
                              setIsFormOpen(true)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          >
                            <MapPin className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="lg:col-span-4">
            {filteredPlaces.length === 0 ? (
              <Card className="text-center py-12">
                <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">
                  {searchQuery ? 'No places match your search' : 'No places added yet'}
                </p>
                {!searchQuery && (
                  <>
                    <p className="text-sm text-gray-400 mb-4">
                      Add places to organize your trip itinerary
                    </p>
                    <Button onClick={() => setIsFormOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Place
                    </Button>
                  </>
                )}
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredPlaces.map((place) => (
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
                ))}
              </div>
            )}
          </div>
        )}

        {/* Saved View */}
        {viewMode === 'saved' && (
          <div className="lg:col-span-4">
            <Card className="text-center py-12">
              <Bookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Saved Places</h3>
              <p className="text-gray-500 mb-4">
                Save your favorite places for quick access
              </p>
              <p className="text-sm text-gray-400">
                This feature will allow you to bookmark places from search results and organize them into collections.
              </p>
            </Card>
          </div>
        )}
      </div>

      {/* Place Form Modal */}
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