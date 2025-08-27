'use client'

import { MobileFormStepper } from '@/components/ui/MobileFormStepper'
import { useRouter } from 'next/navigation'
import { TripBasicsStep } from './wizard/TripBasicStep'
import { KeyPlacesStep } from './wizard/KeyPlacesStep'
import { TripReadyStep } from './wizard/TripReadyStep'
import { toast } from 'sonner'

export function TripCreationWizard() {
  const router = useRouter()

  const steps = [
    {
      id: 'tripBasics',
      title: 'Trip Details',
      component: TripBasicsStep,
      isValid: false
    },
    {
      id: 'keyPlaces',
      title: 'Key Places',
      component: KeyPlacesStep,
      isValid: true,
      isOptional: true
    },
    {
      id: 'tripReady',
      title: 'Ready!',
      component: TripReadyStep,
      isValid: true
    }
  ]

  const handleComplete = async (wizardData: any) => {
    try {
      console.log('🚀 Starting trip creation with data:', wizardData)
      toast.loading('Creating your trip...', { id: 'trip-creation' })

      const tripBasics = wizardData.tripBasics

      if (!tripBasics?.name?.trim()) {
        throw new Error('Trip name is required')
      }

      if (!tripBasics.startDate || !tripBasics.endDate) {
        throw new Error('Start and end dates are required')
      }

      // Step 1: Create the trip
      const tripPayload = {
        title: tripBasics.name.trim(),
        start_date: tripBasics.startDate,
        end_date: tripBasics.endDate,
        description: tripBasics.description?.trim() || null
      }

      console.log('📦 Trip payload:', tripPayload)

      const tripResponse = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripPayload),
      })

      if (!tripResponse.ok) {
        const errorText = await tripResponse.text()
        console.error('❌ Trip creation failed:', errorText)
        throw new Error(`Failed to create trip`)
      }

      const tripResult = await tripResponse.json()
      console.log('✅ Trip created:', tripResult)

      const tripId = tripResult.data?.id || tripResult.id

      if (!tripId) {
        console.error('❌ No trip ID in response:', tripResult)
        throw new Error('Trip created but ID not returned')
      }

      // Step 2: Create places if any were added
      // Step 2: Create places if any were added
      const places = wizardData.keyPlaces?.places || []
      if (places.length > 0) {
        toast.loading(`Adding ${places.length} places...`, { id: 'trip-creation' })
        
        for (const place of places) {
          try {
            const placeResponse = await fetch(`/api/places?tripId=${tripId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: place.name,
                address: place.address || null,
                category: place.category || null
              }),
            })
            
            if (!placeResponse.ok) {
              console.error(`Failed to create place: ${place.name}`)
            }
          } catch (error) {
            console.error(`Error creating place ${place.name}:`, error)
          }
        }
      }

      // Success! Show different messages based on places
      const successMessage = places.length > 0
        ? `Trip "${tripBasics.name}" created with ${places.length} places!`
        : `Trip "${tripBasics.name}" created successfully!`

      toast.success(successMessage, {
        id: 'trip-creation',
        duration: 3000
      })

      // Add small delay to ensure trip is fully created before redirect
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)

    } catch (error) {
      console.error('💥 Trip creation error:', error)
      const message = (error instanceof Error) ? error.message : 'Unknown error'
      toast.error(`Failed to create trip: ${message}`, {
        id: 'trip-creation',
        duration: 4000
      })
    }
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  return (
    <MobileFormStepper
      steps={steps}
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  )
}