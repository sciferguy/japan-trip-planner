// lib/itinerary/overlaps.ts
import { prisma } from '@/lib/prisma'

export interface ItineraryInterval {
  id: string
  start_time: Date | null
  end_time: Date | null
}

export interface ItineraryWithOverlap {
  id: string
  trip_id: string
  day: number
  title: string
  description: string | null
  start_time: Date | null
  end_time: Date | null
  location_id: string | null
  type: string
  created_by: string
  created_at: Date
  overlap: boolean
}

/**
 * Linear overlap computation.
 * Assumes items sorted by start_time ascending (nulls last). Chained overlaps are propagated.
 * Overlap rule: A.start < B.end AND B.start < A.end.
 */
export function computeOverlaps(items: ItineraryInterval[]): Record<string, boolean> {
  const result: Record<string, boolean> = {}
  // Track active intervals (those whose end_time > current.start_time)
  const active: ItineraryInterval[] = []

  for (const current of items) {
    const { id, start_time, end_time } = current
    if (!start_time || !end_time) {
      result[id] = false
      // Clear any expired from active relative to null start items (no effect)
      continue
    }

    // Remove expired from front (end_time <= current.start_time)
    for (let i = active.length - 1; i >= 0; i--) {
      const a = active[i]
      if (!a.end_time || a.end_time <= start_time) {
        active.splice(i, 1)
      }
    }

    // Any remaining active intervals overlap with current if their end_time > current.start_time
    let currentOverlaps = false
    for (const a of active) {
      if (a.start_time && a.end_time && a.start_time < end_time && start_time < a.end_time) {
        result[a.id] = true
        currentOverlaps = true
      }
    }
    result[id] = currentOverlaps
    active.push(current)
  }

  // Ensure every id assigned (non‑interval items already assigned false above)
  for (const it of items) {
    if (result[it.id] === undefined) result[it.id] = false
  }
  return result
}

export async function getDayItemsWithOverlaps(day: number, tripId: string): Promise<ItineraryWithOverlap[]> {
  const items = await prisma.itinerary_items.findMany({
    where: {
      day: day,
      trip_id: tripId
    },
    orderBy: [
      { start_time: 'asc' },
      { created_at: 'asc' }
    ]
  })
  const intervals: ItineraryInterval[] = items.map(i => ({
    id: i.id,
    start_time: i.start_time,
    end_time: i.end_time
  }))
  const overlaps = computeOverlaps(intervals)
  return items.map(i => ({ ...i, overlap: overlaps[i.id] || false }))
}

/**
 * Batch helper: returns a record keyed by day number with arrays including overlap flags.
 */
export async function getDaysItemsWithOverlaps(days: number[], tripId: string): Promise<Record<number, ItineraryWithOverlap[]>> {
  const unique = Array.from(new Set(days))
  const all = await prisma.itinerary_items.findMany({
    where: {
      day: { in: unique },
      trip_id: tripId
    },
    orderBy: [
      { day: 'asc' },
      { start_time: 'asc' },
      { created_at: 'asc' }
    ]
  })
  const grouped: Record<number, ItineraryWithOverlap[]> = {}
  for (const d of unique) {
    const subset = all.filter(i => i.day === d)
    const intervals: ItineraryInterval[] = subset.map(i => ({
      id: i.id,
      start_time: i.start_time,
      end_time: i.end_time
    }))
    const overlaps = computeOverlaps(intervals)
    grouped[d] = subset.map(i => ({ ...i, overlap: overlaps[i.id] || false }))
  }
  return grouped
}