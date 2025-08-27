'use client'

import { useState, useEffect } from 'react'
import { TouchableCard } from '@/components/ui/TouchableCard'
import { Button } from '@/components/ui/button'
import { MapPin, Plus } from 'lucide-react'
import { QuickPlaceForm } from '../QuickPlaceForm'

interface KeyPlacesStepProps {
  stepData?: any
  onUpdateData?: (data: any) => void
  onValidationChange?: (isValid: boolean) => void
}

export function KeyPlacesStep({
  stepData,
  onUpdateData,
  onValidationChange
}: KeyPlacesStepProps) {
  const [places, setPlaces] = useState(stepData?.places || [])
  const [showPlaceForm, setShowPlaceForm] = useState(false)

  useEffect(() => {
    // Always allow proceeding - places are optional now
    onValidationChange?.(true)
    onUpdateData?.({ places })
  }, [places])

  const addPlace = (place: any) => {
    setPlaces((prev: any[]) => [...prev, { ...place, id: Date.now().toString() }])
    setShowPlaceForm(false)
  }

  const removePlace = (id: string) => {
    setPlaces((prev: any[]) => prev.filter((p: any) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">📍</div>
        <h3 className="text-xl font-semibold mb-2">Add Key Places</h3>
        <p className="text-muted-foreground">
          Add places you definitely want to visit (optional)
        </p>
      </div>

      {places.length > 0 && (
        <div className="space-y-3">
          {places.map((place: any) => (
            <TouchableCard
              key={place.id}
              variant="interactive"
              className="p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-tea-600" />
                  <div>
                    <h4 className="font-medium">{place.name}</h4>
                    {place.description && (
                      <p className="text-sm text-muted-foreground">{place.description}</p>
                    )}
                    {place.address && (
                      <p className="text-xs text-muted-foreground">{place.address}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePlace(place.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </Button>
              </div>
            </TouchableCard>
          ))}
        </div>
      )}

      {showPlaceForm ? (
        <TouchableCard variant="kawaii" className="p-4">
          <QuickPlaceForm
            onSubmit={addPlace}
            onCancel={() => setShowPlaceForm(false)}
          />
        </TouchableCard>
      ) : (
        <TouchableCard
          variant="interactive"
          className="p-6 cursor-pointer"
          onClick={() => setShowPlaceForm(true)}
        >
          <div className="flex flex-col items-center text-center">
            <Plus className="h-8 w-8 text-tea-600 mb-2" />
            <h4 className="font-medium mb-1">Add Place</h4>
            <p className="text-sm text-muted-foreground">
              Add restaurants, temples, shops, or any place you want to visit
            </p>
          </div>
        </TouchableCard>
      )}

      {places.length === 0 && !showPlaceForm && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground mb-4">
            No places added yet. You can always add them later!
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPlaceForm(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Your First Place
          </Button>
        </div>
      )}
    </div>
  )
}