// Mock auth before importing anything that uses it
jest.mock('@/lib/auth', () => ({
  auth: jest.fn()
}))

// Mock validation schema
jest.mock('@/lib/validation/itinerary', () => ({
  createItineraryItemSchema: {
    safeParse: jest.fn()
  }
}))

// Now your existing imports
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/days/[dayId]/itinerary-items/route'
import { prisma } from '@/lib/prisma'
import { TripMemberRole, ItineraryItemType } from '@prisma/client'
import { createItineraryItemSchema } from '@/lib/validation/itinerary'

const mockAuth = jest.mocked(jest.requireMock('@/lib/auth').auth)
const mockValidationSchema = jest.mocked(createItineraryItemSchema)

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    days: {
      findUnique: jest.fn()
    },
    trip_members: {
      findUnique: jest.fn()
    },
    itinerary_items: {
      create: jest.fn()
    },
    places: {
      findFirst: jest.fn()
    }
  }
}))

// Mock the overlap function
jest.mock('@/lib/itinerary/overlaps', () => ({
  getDayItemsWithOverlaps: jest.fn().mockResolvedValue([])
}))

describe('/api/days/[dayId]/itinerary-items', () => {
  const mockDayId = 'test-day-id'
  const mockTripId = 'test-trip-id'
  const mockUserId = 'test-user-id'
  const mockOtherUserId = 'other-user-id'

  const mockDay = {
    id: mockDayId,
    trip_id: mockTripId,
    trip: { id: mockTripId }
  }

  const validItemData = {
    title: 'Test Activity',
    type: ItineraryItemType.ACTIVITY,
    description: 'Test description',
    startTime: '2024-01-01T10:00:00Z',
    endTime: '2024-01-01T11:00:00Z'
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Default validation success
    mockValidationSchema.safeParse.mockReturnValue({
      success: true,
      data: validItemData
    })
  })

  describe('GET /api/days/[dayId]/itinerary-items', () => {
    const createRequest = () => new NextRequest('http://localhost/api/days/test-day-id/itinerary-items')

    describe('Authentication', () => {
      it('should return 401 when not authenticated', async () => {
        mockAuth.mockResolvedValue(null)

        const response = await GET(createRequest(), { params: { dayId: mockDayId } })
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error.code).toBe('UNAUTH')
      })
    })

    describe('Day validation', () => {
      beforeEach(() => {
        mockAuth.mockResolvedValue({
          user: { id: mockUserId, email: 'test@example.com', name: 'Test User' },
          expires: '2024-12-31'
        })
      })

      it('should return 404 when day does not exist', async () => {
        ;(prisma.days.findUnique as jest.Mock).mockResolvedValue(null)

        const response = await GET(createRequest(), { params: { dayId: mockDayId } })
        const data = await response.json()

        expect(response.status).toBe(404)
        expect(data.error.code).toBe('NOT_FOUND')
        expect(data.error.message).toBe('Day not found')
      })
    })

    describe('Role-based access control', () => {
      beforeEach(() => {
        mockAuth.mockResolvedValue({
          user: { id: mockUserId, email: 'test@example.com', name: 'Test User' },
          expires: '2024-12-31'
        })
        ;(prisma.days.findUnique as jest.Mock).mockResolvedValue(mockDay)
      })

      it('should allow VIEWER role to get itinerary items', async () => {
        ;(prisma.trip_members.findUnique as jest.Mock).mockResolvedValue({
          trip_id: mockTripId,
          user_id: mockUserId,
          role: TripMemberRole.VIEWER
        })

        const response = await GET(createRequest(), { params: { dayId: mockDayId } })

        expect(response.status).toBe(200)
        expect(prisma.trip_members.findUnique).toHaveBeenCalledWith({
          where: {
            trip_id_user_id: {
              trip_id: mockTripId,
              user_id: mockUserId
            }
          }
        })
      })

      it('should allow EDITOR role to get itinerary items', async () => {
        ;(prisma.trip_members.findUnique as jest.Mock).mockResolvedValue({
          trip_id: mockTripId,
          user_id: mockUserId,
          role: TripMemberRole.EDITOR
        })

        const response = await GET(createRequest(), { params: { dayId: mockDayId } })

        expect(response.status).toBe(200)
      })

      it('should allow OWNER role to get itinerary items', async () => {
        ;(prisma.trip_members.findUnique as jest.Mock).mockResolvedValue({
          trip_id: mockTripId,
          user_id: mockUserId,
          role: TripMemberRole.OWNER
        })

        const response = await GET(createRequest(), { params: { dayId: mockDayId } })

        expect(response.status).toBe(200)
      })

      it('should return 403 when user is not a trip member', async () => {
        ;(prisma.trip_members.findUnique as jest.Mock).mockResolvedValue(null)

        const response = await GET(createRequest(), { params: { dayId: mockDayId } })
        const data = await response.json()

        expect(response.status).toBe(403)
        expect(data.error.code).toBe('FORBIDDEN')
        expect(data.error.message).toBe('Not a trip member')
      })
    })
  })

  describe('POST /api/days/[dayId]/itinerary-items', () => {
    const createRequest = (body: Record<string, unknown>) => {
      return new NextRequest('http://localhost/api/days/test-day-id/itinerary-items', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    describe('Authentication', () => {
      it('should return 401 when not authenticated', async () => {
        mockAuth.mockResolvedValue(null)

        const response = await POST(createRequest(validItemData), { params: { dayId: mockDayId } })
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error.code).toBe('UNAUTH')
      })
    })

    describe('Role-based access control', () => {
      beforeEach(() => {
        mockAuth.mockResolvedValue({
          user: { id: mockUserId, email: 'test@example.com', name: 'Test User' },
          expires: '2024-12-31'
        })
        ;(prisma.days.findUnique as jest.Mock).mockResolvedValue(mockDay)
      })

      it('should reject VIEWER role for creating itinerary items', async () => {
        ;(prisma.trip_members.findUnique as jest.Mock).mockResolvedValue({
          trip_id: mockTripId,
          user_id: mockUserId,
          role: TripMemberRole.VIEWER
        })

        const response = await POST(createRequest(validItemData), { params: { dayId: mockDayId } })
        const data = await response.json()

        expect(response.status).toBe(403)
        expect(data.error.code).toBe('FORBIDDEN')
        expect(data.error.message).toBe('Insufficient role')
      })

      it('should allow EDITOR role to create itinerary items', async () => {
        ;(prisma.trip_members.findUnique as jest.Mock).mockResolvedValue({
          trip_id: mockTripId,
          user_id: mockUserId,
          role: TripMemberRole.EDITOR
        })
        ;(prisma.days.findUnique as jest.Mock)
          .mockResolvedValueOnce(mockDay)
          .mockResolvedValueOnce({ id: mockDayId, trip_id: mockTripId })
        ;(prisma.itinerary_items.create as jest.Mock).mockResolvedValue({
          id: 'new-item-id',
          day_id: mockDayId,
          title: validItemData.title,
          note: validItemData.description,
          type: validItemData.type,
          start_time: new Date(validItemData.startTime),
          end_time: new Date(validItemData.endTime),
          place_id: null,
          created_by_user_id: mockUserId,
          created_at: new Date()
        })

        const response = await POST(createRequest(validItemData), { params: { dayId: mockDayId } })

        expect(response.status).toBe(200)
        expect(prisma.itinerary_items.create).toHaveBeenCalled()
      })

      it('should allow OWNER role to create itinerary items', async () => {
        ;(prisma.trip_members.findUnique as jest.Mock).mockResolvedValue({
          trip_id: mockTripId,
          user_id: mockUserId,
          role: TripMemberRole.OWNER
        })
        ;(prisma.days.findUnique as jest.Mock)
          .mockResolvedValueOnce(mockDay)
          .mockResolvedValueOnce({ id: mockDayId, trip_id: mockTripId })
        ;(prisma.itinerary_items.create as jest.Mock).mockResolvedValue({
          id: 'new-item-id',
          day_id: mockDayId,
          title: validItemData.title,
          note: validItemData.description,
          type: validItemData.type,
          start_time: new Date(validItemData.startTime),
          end_time: new Date(validItemData.endTime),
          place_id: null,
          created_by_user_id: mockUserId,
          created_at: new Date()
        })

        const response = await POST(createRequest(validItemData), { params: { dayId: mockDayId } })

        expect(response.status).toBe(200)
      })
    })

    describe('Validation', () => {
      beforeEach(() => {
        mockAuth.mockResolvedValue({
          user: { id: mockUserId, email: 'test@example.com', name: 'Test User' },
          expires: '2024-12-31'
        })
        ;(prisma.days.findUnique as jest.Mock).mockResolvedValue(mockDay)
        ;(prisma.trip_members.findUnique as jest.Mock).mockResolvedValue({
          trip_id: mockTripId,
          user_id: mockUserId,
          role: TripMemberRole.EDITOR
        })
      })

      it('should return 400 for invalid data', async () => {
        mockValidationSchema.safeParse.mockReturnValue({
          success: false,
          error: {
            issues: [{
              code: 'custom' as any,
              path: ['title'],
              message: 'Invalid title'
            }]
          } as any
        })

        const invalidData = { title: '' }
        const response = await POST(createRequest(invalidData), { params: { dayId: mockDayId } })
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error.code).toBe('VALIDATION_ERROR')
      })

      it('should validate cross-trip day access', async () => {
        const otherTripDayId = 'other-trip-day-id'
        const dataWithDifferentDay = { ...validItemData, dayId: otherTripDayId }

        mockValidationSchema.safeParse.mockReturnValue({
          success: true,
          data: dataWithDifferentDay
        })

        ;(prisma.days.findUnique as jest.Mock)
          .mockResolvedValueOnce(mockDay)
          .mockResolvedValueOnce({ id: otherTripDayId, trip_id: 'other-trip-id' })

        const response = await POST(createRequest(dataWithDifferentDay), { params: { dayId: mockDayId } })
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error.code).toBe('INVALID_DAY')
        expect(data.error.message).toBe('Invalid day for this trip')
      })

      it('should validate place belongs to trip', async () => {
        const dataWithPlace = { ...validItemData, locationId: 'invalid-place-id' }

        mockValidationSchema.safeParse.mockReturnValue({
          success: true,
          data: dataWithPlace
        })

        ;(prisma.days.findUnique as jest.Mock)
          .mockResolvedValueOnce(mockDay)
          .mockResolvedValueOnce({ id: mockDayId, trip_id: mockTripId })
        ;(prisma.places.findFirst as jest.Mock).mockResolvedValue(null)

        const response = await POST(createRequest(dataWithPlace), { params: { dayId: mockDayId } })
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error.code).toBe('INVALID_LOCATION')
        expect(data.error.message).toBe('Place does not belong to this trip')
      })
    })

    describe('Cross-trip protection', () => {
      beforeEach(() => {
        mockAuth.mockResolvedValue({
          user: { id: mockUserId, email: 'test@example.com', name: 'Test User' },
          expires: '2024-12-31'
        })
        ;(prisma.trip_members.findUnique as jest.Mock).mockResolvedValue(null)
      })

      it('should prevent creating items in days from different trips', async () => {
        const otherTripId = 'other-trip-id'
        const dayFromOtherTrip = { id: mockDayId, trip_id: otherTripId, trip: { id: otherTripId } }

        ;(prisma.days.findUnique as jest.Mock).mockResolvedValue(dayFromOtherTrip)

        const response = await POST(createRequest(validItemData), { params: { dayId: mockDayId } })
        const data = await response.json()

        expect(response.status).toBe(403)
        expect(data.error.code).toBe('FORBIDDEN')
        expect(data.error.message).toBe('Not a trip member')
      })
    })

    describe('Authorization flow verification', () => {
      it('should check membership before role requirements', async () => {
        mockAuth.mockResolvedValue({
          user: { id: mockOtherUserId, email: 'other@example.com', name: 'Other User' },
          expires: '2024-12-31'
        })
        ;(prisma.days.findUnique as jest.Mock).mockResolvedValue(mockDay)
        ;(prisma.trip_members.findUnique as jest.Mock).mockResolvedValue(null)

        const response = await POST(createRequest(validItemData), { params: { dayId: mockDayId } })
        const data = await response.json()

        expect(response.status).toBe(403)
        expect(data.error.code).toBe('FORBIDDEN')
        expect(data.error.message).toBe('Not a trip member')

        expect(prisma.itinerary_items.create).not.toHaveBeenCalled()
      })

      it('should call requireTripRole with correct parameters', async () => {
        mockAuth.mockResolvedValue({
          user: { id: mockUserId, email: 'test@example.com', name: 'Test User' },
          expires: '2024-12-31'
        })
        ;(prisma.days.findUnique as jest.Mock).mockResolvedValue(mockDay)
        ;(prisma.trip_members.findUnique as jest.Mock).mockResolvedValue({
          trip_id: mockTripId,
          user_id: mockUserId,
          role: TripMemberRole.EDITOR
        })

        await POST(createRequest(validItemData), { params: { dayId: mockDayId } })

        expect(prisma.trip_members.findUnique).toHaveBeenCalledWith({
          where: {
            trip_id_user_id: {
              trip_id: mockTripId,
              user_id: mockUserId
            }
          }
        })
      })
    })
  })
})