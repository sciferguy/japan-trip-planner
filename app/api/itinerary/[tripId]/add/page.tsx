'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save } from 'lucide-react'

interface Props {
  params: { tripId: string }
}

const activityTypes = [
  { value: 'ACTIVITY', label: 'Activity' },
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'MEAL', label: 'Meal' },
  { value: 'ACCOMMODATION', label: 'Accommodation' },
  { value: 'MEETING', label: 'Meeting' },
  { value: 'FREE_TIME', label: 'Free Time' }
]

export default function AddItineraryItemPage({ params }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultDay = searchParams.get('day') || '1'

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    day: defaultDay,
    start_time: '',
    end_time: '',
    type: 'ACTIVITY',
    location_name: '',
    location_address: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Format times correctly for the API
      const formatTime = (timeString: string) => {
        if (!timeString) return null
        const today = new Date().toISOString().split('T')[0]
        return new Date(`${today}T${timeString}:00.000Z`).toISOString()
      }

      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          day: parseInt(formData.day),
          start_time: formatTime(formData.start_time),
          end_time: formatTime(formData.end_time),
          type: formData.type,
          trip_id: params.tripId,
          location_name: formData.location_name || null,
          location_address: formData.location_address || null,
        })
      })

      const result = await response.json()

      if (result.success) {
        router.push('/dashboard/itinerary')
        router.refresh()
      } else {
        throw new Error(result.error || 'Failed to create item')
      }
    } catch (error) {
      console.error('Error creating item:', error)
      alert('Failed to create item. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center space-x-4 mb-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center space-x-2"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Activity</h1>
          <p className="text-gray-600">Add a new item to your itinerary</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Activity Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. Visit Senso-ji Temple"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Optional notes about this activity"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="day">Day</Label>
              <Input
                id="day"
                type="number"
                min="1"
                value={formData.day}
                onChange={(e) => handleInputChange('day', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => handleInputChange('end_time', e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="location_name">Location Name</Label>
              <Input
                id="location_name"
                value={formData.location_name}
                onChange={(e) => handleInputChange('location_name', e.target.value)}
                placeholder="e.g. Senso-ji Temple"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="location_address">Location Address</Label>
              <Input
                id="location_address"
                value={formData.location_address}
                onChange={(e) => handleInputChange('location_address', e.target.value)}
                placeholder="e.g. 2-3-1 Asakusa, Taito City, Tokyo"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title}
              className="flex items-center space-x-2"
            >
              <Save size={18} />
              <span>{isSubmitting ? 'Saving...' : 'Save Activity'}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}