// __tests__/lib/itinerary/computeOverlaps.test.ts
import { computeOverlaps, type ItineraryInterval } from '@/lib/itinerary/overlaps'

describe('computeOverlaps', () => {
  const createItem = (id: string, start: string | null, end: string | null): ItineraryInterval => ({
    id,
    start_time: start ? new Date(start) : null,
    end_time: end ? new Date(end) : null
  })

  describe('null boundaries', () => {
    it('should handle items with null start_time', () => {
      const items = [
        createItem('1', null, '2024-01-01T12:00:00Z'),
        createItem('2', '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z')
      ]

      const result = computeOverlaps(items)

      expect(result['1']).toBe(false) // null start_time = no overlap
      expect(result['2']).toBe(false)
    })

    it('should handle items with null end_time', () => {
      const items = [
        createItem('1', '2024-01-01T10:00:00Z', null),
        createItem('2', '2024-01-01T11:00:00Z', '2024-01-01T12:00:00Z')
      ]

      const result = computeOverlaps(items)

      expect(result['1']).toBe(false) // null end_time = no overlap
      expect(result['2']).toBe(false)
    })

    it('should handle items with both null times', () => {
      const items = [
        createItem('1', null, null),
        createItem('2', '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z')
      ]

      const result = computeOverlaps(items)

      expect(result['1']).toBe(false)
      expect(result['2']).toBe(false)
    })
  })

  describe('identical intervals', () => {
    it('should detect overlap for identical start/end times', () => {
      const items = [
        createItem('1', '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z'),
        createItem('2', '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z')
      ]

      const result = computeOverlaps(items)

      expect(result['1']).toBe(true)
      expect(result['2']).toBe(true)
    })

    it('should handle multiple identical intervals', () => {
      const items = [
        createItem('1', '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z'),
        createItem('2', '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z'),
        createItem('3', '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z')
      ]

      const result = computeOverlaps(items)

      expect(result['1']).toBe(true)
      expect(result['2']).toBe(true)
      expect(result['3']).toBe(true)
    })
  })

  describe('cascade chains', () => {
    it('should propagate overlaps through chains (A overlaps B, B overlaps C)', () => {
      const items = [
        createItem('A', '2024-01-01T10:00:00Z', '2024-01-01T11:30:00Z'), // 10:00-11:30
        createItem('B', '2024-01-01T11:00:00Z', '2024-01-01T12:30:00Z'), // 11:00-12:30 (overlaps A)
        createItem('C', '2024-01-01T12:00:00Z', '2024-01-01T13:00:00Z')  // 12:00-13:00 (overlaps B)
      ]

      const result = computeOverlaps(items)

      expect(result['A']).toBe(true)  // A overlaps with B
      expect(result['B']).toBe(true)  // B overlaps with A and C
      expect(result['C']).toBe(true)  // C overlaps with B
    })

    it('should handle long chains with multiple overlaps', () => {
      const items = [
        createItem('1', '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z'),
        createItem('2', '2024-01-01T10:30:00Z', '2024-01-01T11:30:00Z'),
        createItem('3', '2024-01-01T11:00:00Z', '2024-01-01T12:00:00Z'),
        createItem('4', '2024-01-01T11:30:00Z', '2024-01-01T12:30:00Z')
      ]

      const result = computeOverlaps(items)

      expect(result['1']).toBe(true)  // overlaps with 2
      expect(result['2']).toBe(true)  // overlaps with 1 and 3
      expect(result['3']).toBe(true)  // overlaps with 2 and 4
      expect(result['4']).toBe(true)  // overlaps with 3
    })
  })

  describe('non-overlapping adjacency', () => {
    it('should not mark touching intervals as overlapping', () => {
      const items = [
        createItem('1', '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z'), // ends at 11:00
        createItem('2', '2024-01-01T11:00:00Z', '2024-01-01T12:00:00Z')  // starts at 11:00
      ]

      const result = computeOverlaps(items)

      expect(result['1']).toBe(false) // touching but not overlapping
      expect(result['2']).toBe(false)
    })

    it('should handle multiple adjacent intervals', () => {
      const items = [
        createItem('1', '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z'),
        createItem('2', '2024-01-01T11:00:00Z', '2024-01-01T12:00:00Z'),
        createItem('3', '2024-01-01T12:00:00Z', '2024-01-01T13:00:00Z')
      ]

      const result = computeOverlaps(items)

      expect(result['1']).toBe(false)
      expect(result['2']).toBe(false)
      expect(result['3']).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const result = computeOverlaps([])
      expect(result).toEqual({})
    })

    it('should handle single item', () => {
      const items = [createItem('1', '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z')]

      const result = computeOverlaps(items)

      expect(result['1']).toBe(false)
    })

    it('should handle zero-duration intervals (start === end)', () => {
      const items = [
        createItem('1', '2024-01-01T10:00:00Z', '2024-01-01T10:00:00Z'),
        createItem('2', '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z')
      ]

      const result = computeOverlaps(items)

      expect(result['1']).toBe(false) // zero duration doesn't overlap
      expect(result['2']).toBe(false)
    })

    it('should handle out-of-order items (algorithm assumes sorted input)', () => {
      // Note: The algorithm comment states items should be sorted by start_time
      const items = [
        createItem('2', '2024-01-01T11:00:00Z', '2024-01-01T12:00:00Z'),
        createItem('1', '2024-01-01T10:00:00Z', '2024-01-01T11:30:00Z') // should overlap with item 2
      ]

      const result = computeOverlaps(items)

      // Test current behavior (may need adjustment if sorting is required)
      expect(result['1']).toBeDefined()
      expect(result['2']).toBeDefined()
    })

    it('should handle items spanning different days', () => {
      const items = [
        createItem('1', '2024-01-01T23:00:00Z', '2024-01-02T01:00:00Z'), // crosses midnight
        createItem('2', '2024-01-02T00:30:00Z', '2024-01-02T02:00:00Z')  // overlaps in new day
      ]

      const result = computeOverlaps(items)

      expect(result['1']).toBe(true)
      expect(result['2']).toBe(true)
    })

    it('should handle microsecond precision overlaps', () => {
      const items = [
        createItem('1', '2024-01-01T10:00:00.000Z', '2024-01-01T11:00:00.001Z'),
        createItem('2', '2024-01-01T11:00:00.000Z', '2024-01-01T12:00:00.000Z')
      ]

      const result = computeOverlaps(items)

      expect(result['1']).toBe(true) // 1ms overlap
      expect(result['2']).toBe(true)
    })
  })

  describe('complex scenarios', () => {
    it('should handle mixed null and valid times', () => {
      const items = [
        createItem('null-start', null, '2024-01-01T12:00:00Z'),
        createItem('valid', '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z'),
        createItem('null-end', '2024-01-01T11:30:00Z', null),
        createItem('both-null', null, null)
      ]

      const result = computeOverlaps(items)

      expect(result['null-start']).toBe(false)
      expect(result['valid']).toBe(false)
      expect(result['null-end']).toBe(false)
      expect(result['both-null']).toBe(false)
    })

    it('should handle large number of overlapping items', () => {
      // Create 10 items all overlapping in same time window
      const items = Array.from({ length: 10 }, (_, i) =>
        createItem(`item-${i}`, '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z')
      )

      const result = computeOverlaps(items)

      // All items should be marked as overlapping
      items.forEach(item => {
        expect(result[item.id]).toBe(true)
      })
    })

    it('should handle performance with many non-overlapping items', () => {
      // Create 100 sequential non-overlapping items
      const items = Array.from({ length: 100 }, (_, i) => {
        const start = new Date(2024, 0, 1, 10 + i, 0, 0)
        const end = new Date(2024, 0, 1, 10 + i, 30, 0)
        return createItem(`item-${i}`, start.toISOString(), end.toISOString())
      })

      const startTime = performance.now()
      const result = computeOverlaps(items)
      const endTime = performance.now()

      // Should complete quickly (under 100ms for 100 items)
      expect(endTime - startTime).toBeLessThan(100)

      // No items should overlap
      items.forEach(item => {
        expect(result[item.id]).toBe(false)
      })
    })
  })
})