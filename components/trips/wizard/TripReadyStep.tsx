'use client'

import { TouchableCard } from '@/components/ui/TouchableCard'
import { Check } from 'lucide-react'

interface TripReadyStepProps {
  stepData?: any
  onUpdateData?: (data: any) => void
  onValidationChange?: (isValid: boolean) => void
  allStepData?: any
}

export function TripReadyStep({ allStepData }: TripReadyStepProps) {
  const tripData = allStepData?.tripBasics
  const places = allStepData?.keyPlaces?.places || []

  return (
    <div className="space-y-6 text-center">
      <div className="text-6xl mb-4">🎌</div>
      <h3 className="text-2xl font-bold text-tea-800 dark:text-tea-200">
        Your Trip is Ready!
      </h3>
      <p className="text-muted-foreground">
        {places.length > 0
          ? `We've created your trip with ${places.length} place${places.length > 1 ? 's' : ''}.`
          : "We've created your trip. You can add places anytime!"
        }
        {' '}Let's explore your dashboard!
      </p>

      <TouchableCard variant="kawaii" className="p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-green-700">
            <Check className="h-5 w-5" />
            <span className="font-medium">Trip "{tripData?.name}" created</span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <Check className="h-5 w-5" />
            <span className="font-medium">
              {places.length > 0 ? `${places.length} places added` : 'Ready for planning'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <Check className="h-5 w-5" />
            <span className="font-medium">Ready for itinerary planning</span>
          </div>
        </div>
      </TouchableCard>

      <p className="text-sm text-muted-foreground">
        Next: {places.length > 0 ? 'Add more places, create itineraries' : 'Add places, create itineraries'}, and manage your tasks!
      </p>
    </div>
  )
}