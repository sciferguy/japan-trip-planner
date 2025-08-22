import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreateItineraryItemData } from '@/types/itinerary'
import { DayChoiceModal } from './DayChoiceModal'
import { PlaceSelector } from '@/components/places/PlaceSelector'

interface Props {
  tripId: string
  dayId: string
  userId: string
  tripStartDate: Date
  onSubmit: (data: CreateItineraryItemData) => Promise<{ success: boolean; error?: string }>
  onCancel?: () => void
}

export function AddActivityForm({ tripId, dayId, userId, tripStartDate, onSubmit, onCancel }: Props) {
  const dayNumber = parseInt(dayId)

  const [formData, setFormData] = useState<Partial<CreateItineraryItemData>>({
    dayId,
    type: 'ACTIVITY',
    locationId: undefined
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Day choice modal state
  const [showDayChoice, setShowDayChoice] = useState<{
    time: string
    originalDay: number
  } | null>(null)
  const [selectedDay, setSelectedDay] = useState(dayNumber)

  // Helper function to detect early morning (1-6am)
  const isEarlyMorning = (timeString: string) => {
    const time = new Date(timeString)
    const hour = time.getHours()
    return hour >= 1 && hour <= 6
  }

  const handleStartTimeChange = (value: string) => {
    const isoString = value ? new Date(value).toISOString() : undefined
    setFormData(prev => ({ ...prev, startTime: isoString }))

    if (value && isEarlyMorning(value)) {
      setShowDayChoice({
        time: value,
        originalDay: dayNumber
      })
    } else {
      setSelectedDay(dayNumber)
    }
  }

  const handleChooseDay = (chosenDay: number) => {
    setSelectedDay(chosenDay)
    setShowDayChoice(null)
  }

  const handleCloseDayChoice = () => {
    setShowDayChoice(null)
    setSelectedDay(dayNumber)
    setFormData(prev => ({ ...prev, startTime: undefined }))
  }

  const handleClearTime = (field: 'startTime' | 'endTime') => {
    setFormData(prev => ({ ...prev, [field]: undefined }))
    if (field === 'startTime') {
      setSelectedDay(dayNumber)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) return

    setLoading(true)
    setError(null)

    try {
      const result = await onSubmit({
        dayId: selectedDay !== dayNumber ? selectedDay.toString() : dayId,
        title: formData.title,
        description: formData.description,
        type: formData.type || 'ACTIVITY',
        startTime: formData.startTime,
        endTime: formData.endTime,
        locationId: formData.locationId
      })

      if (result.success) {
        onCancel?.()
      } else {
        setError(result.error || 'Failed to create activity')
      }
    } catch {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title *
            </Label>
            <Input
              id="title"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Activity title"
              className="mt-1"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value || undefined }))}
              placeholder="Optional description"
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
              Location
            </Label>
            <div className="space-y-2">
              <PlaceSelector
                value={formData.locationId || undefined}
                onValueChange={(locationId: string) => setFormData(prev => ({ ...prev, locationId: locationId || undefined }))}
                placeholder="Select or add a location"
              />
              {formData.locationId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, locationId: undefined }))}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear Location
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
              Type
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'ACTIVITY' | 'TRANSPORT' | 'MEAL' | 'ACCOMMODATION' | 'MEETING' | 'FREE_TIME') =>
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVITY">Activity</SelectItem>
                <SelectItem value="TRANSPORT">Transport</SelectItem>
                <SelectItem value="MEAL">Meal</SelectItem>
                <SelectItem value="ACCOMMODATION">Accommodation</SelectItem>
                <SelectItem value="MEETING">Meeting</SelectItem>
                <SelectItem value="FREE_TIME">Free Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div />

          <div>
            <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
              Start Time
            </Label>
            <div className="space-y-2">
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime ? formData.startTime.slice(0, 16) : ''}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                className="mt-1"
              />
              {formData.startTime && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleClearTime('startTime')}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear Start Time
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">
              End Time
            </Label>
            <div className="space-y-2">
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime ? formData.endTime.slice(0, 16) : ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  endTime: e.target.value ? new Date(e.target.value).toISOString() : undefined
                }))}
                className="mt-1"
              />
              {formData.endTime && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleClearTime('endTime')}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear End Time
                </Button>
              )}
            </div>
          </div>
        </div>

        {selectedDay !== dayNumber && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
            <strong>Note:</strong> This activity will be created on Day {selectedDay}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading || !formData.title}>
            {loading ? 'Creating...' : 'Create Activity'}
          </Button>
        </div>
      </form>

      <DayChoiceModal
        isOpen={!!showDayChoice}
        onClose={handleCloseDayChoice}
        onChooseDay={handleChooseDay}
        time={showDayChoice?.time || ''}
        currentDay={showDayChoice?.originalDay || dayNumber}
        tripStartDate={tripStartDate}
      />
    </>
  )
}