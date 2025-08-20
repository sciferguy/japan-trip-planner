// components/itinerary/ItineraryItemCard.tsx
import { ItineraryItem } from '@/types/itinerary'
import { formatTime, formatDuration } from '@/lib/utils'

interface ItineraryItemCardProps {
  item: ItineraryItem
  className?: string
}

export function ItineraryItemCard({ item, className = '' }: ItineraryItemCardProps) {
  const getTypeIcon = (type: string) => {
    const icons = {
      ACTIVITY: '🎯',
      TRANSPORT: '🚌',
      MEAL: '🍽️',
      ACCOMMODATION: '🏨',
      MEETING: '🤝',
      FREE_TIME: '⏰'
    }
    return icons[type as keyof typeof icons] || '📝'
  }

  const getTypeColor = (type: string) => {
    const colors = {
      ACTIVITY: 'bg-blue-100 text-blue-800',
      TRANSPORT: 'bg-green-100 text-green-800',
      MEAL: 'bg-orange-100 text-orange-800',
      ACCOMMODATION: 'bg-purple-100 text-purple-800',
      MEETING: 'bg-red-100 text-red-800',
      FREE_TIME: 'bg-gray-100 text-gray-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getTypeIcon(item.type)}</span>
            <h3 className="font-medium text-gray-900">{item.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
              {item.type}
            </span>
          </div>

          {item.description && (
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
          )}

          {item.locations && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
              <span>📍</span>
              <span>{item.locations.name}</span>
            </div>
          )}

          {item.start_time && item.end_time && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>🕐</span>
              <span>
                {formatTime(item.start_time)} - {formatTime(item.end_time)}
                <span className="ml-2 text-xs">
                  ({formatDuration(item.start_time, item.end_time)})
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}