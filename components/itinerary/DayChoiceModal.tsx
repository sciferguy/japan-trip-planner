import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Clock, Calendar } from 'lucide-react'

interface DayChoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onChooseDay: (day: number) => void
  time: string
  currentDay: number
  tripStartDate: Date
}

export function DayChoiceModal({
  isOpen,
  onClose,
  onChooseDay,
  time,
  currentDay,
  tripStartDate
}: DayChoiceModalProps) {
  if (!isOpen) return null

  const timeObj = new Date(time)
  const formattedTime = timeObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  const getCurrentDayDate = (day: number) => {
    const date = new Date(tripStartDate)
    date.setDate(date.getDate() + day - 1)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const previousDay = currentDay - 1
  const showPreviousOption = previousDay >= 1

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="p-6 max-w-md w-full bg-white rounded-xl shadow-2xl border-0">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Early Morning Activity</h3>
          <p className="text-sm text-gray-600">
            This activity is at <span className="font-semibold text-blue-600">{formattedTime}</span>.
            <br />Which day should it be added to?
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {showPreviousOption && (
            <Button
              variant="outline"
              className="w-full p-4 h-auto border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              onClick={() => onChooseDay(previousDay)}
            >
              <div className="flex items-center w-full">
                <Calendar className="h-5 w-5 text-gray-400 group-hover:text-blue-500 mr-3 flex-shrink-0" />
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                    Day {previousDay} Night
                  </div>
                  <div className="text-sm text-gray-500 group-hover:text-blue-600">
                    {getCurrentDayDate(previousDay)} • Late night activity
                  </div>
                </div>
              </div>
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full p-4 h-auto border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
            onClick={() => onChooseDay(currentDay)}
          >
            <div className="flex items-center w-full">
              <Calendar className="h-5 w-5 text-gray-400 group-hover:text-green-500 mr-3 flex-shrink-0" />
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-900 group-hover:text-green-700">
                  Day {currentDay} Morning
                </div>
                <div className="text-sm text-gray-500 group-hover:text-green-600">
                  {getCurrentDayDate(currentDay)} • Early morning activity
                </div>
              </div>
            </div>
          </Button>
        </div>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  )
}