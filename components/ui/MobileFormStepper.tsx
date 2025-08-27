'use client'

import React, { ReactNode, useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { MobileContainer } from '@/components/ui/MobileContainer'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Step {
  id: string
  title: string
  component: React.ComponentType<any>
  isValid?: boolean
  isOptional?: boolean
}

interface MobileFormStepperProps {
  steps: Step[]
  onComplete: (data: any) => void
  onCancel?: () => void
  initialStep?: number
  className?: string
}

export function MobileFormStepper({
  steps,
  onComplete,
  onCancel,
  initialStep = 0,
  className
}: MobileFormStepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [stepData, setStepData] = useState<Record<string, any>>({})
  const [stepValidation, setStepValidation] = useState<Record<number, boolean>>({})

  const currentStepData = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const canProceed = stepValidation[currentStep] !== false

  const handleNext = () => {
    if (isLastStep) {
      onComplete(stepData)
    } else {
      setCompletedSteps(prev => new Set([...prev, currentStep]))
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const updateStepData = useCallback((stepId: string, data: any) => {
    setStepData(prev => ({ ...prev, [stepId]: data }))
  }, [])

  const updateValidation = useCallback((stepIndex: number, isValid: boolean) => {
    setStepValidation(prev => ({ ...prev, [stepIndex]: isValid }))
  }, [])

  // Progress calculation
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <MobileContainer className={cn("flex flex-col h-screen-safe", className)}>
      {/* Header with progress */}
      <div className="flex-shrink-0 px-4 py-3 border-b bg-background">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                className="p-1"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <h2 className="font-semibold text-lg">{currentStepData.title}</h2>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-tea-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {React.createElement(currentStepData.component, {
            stepData: stepData[currentStepData.id],
            onUpdateData: (data: any) => updateStepData(currentStepData.id, data),
            onValidationChange: (isValid: boolean) => updateValidation(currentStep, isValid),
            allStepData: stepData
          })}
        </div>
      </div>

      {/* Footer with navigation */}
      <div className="flex-shrink-0 p-4 border-t bg-background">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex-1 bg-tea-600 hover:bg-tea-700"
          >
            {isLastStep ? 'Complete' : 'Next'}
            {!isLastStep && <ChevronRight className="ml-1 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </MobileContainer>
  )
}