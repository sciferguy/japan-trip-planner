'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Activity {
  id: string
  title: string
  description?: string
  day: number
  start_time?: string
  end_time?: string
  type: string
  locations: {
    id: string
    name: string
    address: string
  } | null
}

interface Props {
  activity: Activity
  userId: string
}

const ACTIVITY_TYPES = [
  { value: 'ACTIVITY', label: 'Activity' },
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'MEAL', label: 'Meal' },
  { value: 'ACCOMMODATION', label: 'Accommodation' },
  { value: 'MEETING', label: 'Meeting' },
  { value: 'FREE_TIME', label: 'Free Time' }
]

export function EditActivityForm({ activity, userId }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatTimeForInput = (timeString?: string) => {
    if (!timeString) return ''
    const date = new Date(timeString)
    return date.toTimeString().slice(0, 5) // HH:MM format
  }

  const [formData, setFormData] = useState({
    title: activity.title,
    description: activity.description || '',
    day: activity.day,
    start_time: formatTimeForInput(activity.start_time),
    end_time: formatTimeForInput(activity.end_time),
    type: activity.type,
    location_name: activity.locations?.name || '',
    location_address: activity.locations?.address || ''
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/itinerary-items/${activity.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          start_time: formData.start_time ? new Date(`1970-01-01T${formData.start_time}:00`).toISOString() : null,
          end_time: formData.end_time ? new Date(`1970-01-01T${formData.end_time}:00`).toISOString() : null
        })
      })

      if (response.ok) {
        router.push('/dashboard/itinerary')
        router.refresh()
      } else {
        throw new Error('Failed to update activity')
      }
    } catch (error) {
      console.error('Error updating activity:', error)
      alert('Failed to update activity. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="title">Activity Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., Visit Senso-ji Temple"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Optional details about this activity..."
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
            onChange={(e) => handleChange('day', parseInt(e.target.value))}
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Activity Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_TYPES.map((type) => (
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
            onChange={(e) => handleChange('start_time', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) => handleChange('end_time', e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="location_name">Location Name</Label>
          <Input
            id="location_name"
            value={formData.location_name}
            onChange={(e) => handleChange('location_name', e.target.value)}
            placeholder="e.g., Senso-ji Temple"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="location_address">Location Address</Label>
          <Input
            id="location_address"
            value={formData.location_address}
            onChange={(e) => handleChange('location_address', e.target.value)}
            placeholder="e.g., 2-3-1 Asakusa, Taito City, Tokyo"
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Activity'}
        </Button>
      </div>
    </form>
  )
}