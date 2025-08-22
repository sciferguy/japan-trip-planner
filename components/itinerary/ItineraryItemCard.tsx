// components/itinerary/ItineraryItemCard.tsx
import { useState } from 'react'
import { ItineraryItem } from '@/types/itinerary'
import { Button } from '@/components/ui/button'

interface ItineraryItemCardProps {
  item: ItineraryItem
  className?: string
  onEdit?: (item: ItineraryItem) => void
  onDelete?: (id: string) => void
}

export function ItineraryItemCard({ item, className = '', onEdit, onDelete }: ItineraryItemCardProps) {
  const [showActions, setShowActions] = useState(false)

  // ... existing code ...

  return (
    <div
      className={`relative bg-white rounded-lg border p-4 transition-shadow ${
        item.overlap ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'
      } hover:shadow-md ${className}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* ... existing content ... */}

      {showActions && (onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex gap-1">
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(item)}
              className="h-6 w-6 p-0"
            >
              ✏️
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(item.id)}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
            >
              🗑️
            </Button>
          )}
        </div>
      )}
    </div>
  )
}