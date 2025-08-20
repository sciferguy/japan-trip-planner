// components/itinerary/ItineraryItemCard.tsx
import { ItineraryItem } from '@/types/itinerary'

interface ItineraryItemCardProps {
  item: ItineraryItem
  className?: string
}

function fmt(t: string | null) {
  if (!t) return ''
  return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function duration(a: string | null, b: string | null) {
  if (!a || !b) return ''
  const ms = new Date(b).getTime() - new Date(a).getTime()
  if (ms <= 0) return ''
  const m = Math.round(ms / 60000)
  const h = Math.floor(m / 60)
  const mm = m % 60
  return h ? `${h}h ${mm}m` : `${mm}m`
}

export function ItineraryItemCard({ item, className = '' }: ItineraryItemCardProps) {
  const icons: Record<string, string> = {
    ACTIVITY: '🎯',
    TRANSPORT: '🚌',
    MEAL: '🍽️',
    ACCOMMODATION: '🏨',
    MEETING: '🤝',
    FREE_TIME: '⏰'
  }
  const badge: Record<string, string> = {
    ACTIVITY: 'bg-blue-100 text-blue-800',
    TRANSPORT: 'bg-green-100 text-green-800',
    MEAL: 'bg-orange-100 text-orange-800',
    ACCOMMODATION: 'bg-purple-100 text-purple-800',
    MEETING: 'bg-red-100 text-red-800',
    FREE_TIME: 'bg-gray-100 text-gray-800'
  }

  return (
    <div
      className={`relative bg-white rounded-lg border p-4 transition-shadow ${
        item.overlap ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'
      } hover:shadow-md ${className}`}
    >
      {item.overlap && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
          Overlap
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className="text-xl">{icons[item.type] || '📝'}</div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900">{item.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge[item.type]}`}>
              {item.type}
            </span>
          </div>
          {item.description && (
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
          )}
          {item.startTime && item.endTime && (
            <div className="text-xs text-gray-500">
              {fmt(item.startTime)} - {fmt(item.endTime)} ({duration(item.startTime, item.endTime)})
            </div>
          )}
        </div>
      </div>
    </div>
  )
}