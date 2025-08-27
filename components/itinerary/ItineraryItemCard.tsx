import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ItineraryItem } from '@/types/itinerary'
import { Button } from '@/components/ui/button'

const formatTime = (dateString: string | null) => {
  if (!dateString) return ''
  // Extract just the time portion from the ISO string
  const match = dateString.match(/T(\d{2}):(\d{2})/)
  if (!match) return ''
  
  let hours = parseInt(match[1])
  const minutes = match[2]
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  
  return `${hours}:${minutes} ${ampm}`
}

interface ItineraryItemCardProps {
  item: ItineraryItem
  className?: string
  onEdit?: (item: ItineraryItem) => void
  onDelete?: (id: string) => void
}

export function ItineraryItemCard({ item, className = '', onEdit, onDelete }: ItineraryItemCardProps) {
  const [showActions, setShowActions] = useState(false)

  // DnD-kit sortable hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
      className={`relative bg-white rounded-lg border p-4 transition-shadow ${
        item.overlap ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'
      } hover:shadow-md ${className}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      {...attributes}
    >
      {/* Drag handle */}
      <span
        {...listeners}
        className="mr-2 cursor-grab text-gray-400 hover:text-gray-600 select-none"
        aria-label="Drag to reorder"
        tabIndex={0}
      >
        ⠿
      </span>

      {/* Main content */}
      <div className="inline-block align-middle">
      <div className="font-medium text-gray-900">{item.title}</div>
        {item.startTime && item.endTime && (
          <div className="text-xs text-gray-500">
            {formatTime(item.startTime)} - {formatTime(item.endTime)}
          </div>
        )}
        {item.description && (
          <div className="text-xs text-gray-600 mt-1">{item.description}</div>
        )}
      </div>

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