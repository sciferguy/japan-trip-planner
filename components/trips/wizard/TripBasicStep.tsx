'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface TripBasicsStepProps {
  stepData?: any
  onUpdateData?: (data: any) => void
  onValidationChange?: (isValid: boolean) => void
}

export function TripBasicsStep({
  stepData,
  onUpdateData,
  onValidationChange
}: TripBasicsStepProps) {
  const [formData, setFormData] = useState({
    name: stepData?.name || '',
    description: stepData?.description || '',
    startDate: stepData?.startDate || '',
    endDate: stepData?.endDate || ''
  })

  const today = new Date().toISOString().split('T')[0]

  // Single useEffect that handles both validation and data updates
  // Remove callback dependencies to prevent infinite loop
  useEffect(() => {
    const isValid = formData.name.trim() && formData.startDate && formData.endDate

    onValidationChange?.(!!isValid)
    onUpdateData?.(formData)
  }, [formData.name, formData.description, formData.startDate, formData.endDate]) // Only depend on actual form data

  const handleStartDateChange = (value: string) => {
    setFormData(prev => ({ ...prev, startDate: value }))

    if (value && formData.endDate && formData.endDate < value) {
      const startDate = new Date(value)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 7)
      setFormData(prev => ({ ...prev, endDate: endDate.toISOString().split('T')[0] }))
    }
    else if (value && !formData.endDate) {
      const startDate = new Date(value)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 7)
      setFormData(prev => ({ ...prev, endDate: endDate.toISOString().split('T')[0] }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🗾</div>
        <h3 className="text-xl font-semibold mb-2">Plan Your Trip</h3>
        <p className="text-muted-foreground">
          Let's start with the basics
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="trip-name">Trip Name *</Label>
          <Input
            id="trip-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Japan Adventure 2024"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="trip-description">Description (Optional)</Label>
          <Textarea
            id="trip-description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Cherry blossom season trip with friends..."
            className="mt-1 h-20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start-date">Start Date *</Label>
            <Input
              id="start-date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              min={today}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="end-date">End Date *</Label>
            <Input
              id="end-date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              min={formData.startDate || today}
              className="mt-1"
              required
            />
          </div>
        </div>
      </div>
    </div>
  )
}