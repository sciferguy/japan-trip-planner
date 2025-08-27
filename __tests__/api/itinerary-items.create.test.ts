import { POST as dayItemsPOST } from '@/app/api/days/[dayId]/itinerary-items/route'
import { prisma } from '@/lib/prisma'
import * as authMod from '@/lib/auth'
import * as authz from '@/lib/authz'
import { TripMemberRole } from '@prisma/client'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    days: {
      findUnique: jest.fn()
    },
    places: {
      findFirst: jest.fn()
    },
    itinerary_items: {
      create: jest.fn()
    }
  }
}))

jest.spyOn(authMod, 'auth').mockImplementation(async () => ({
  user: { id: 'user-1', email: 'u@example.com', name: 'U' }
}) as any)

jest.spyOn(authz, 'requireTripRole').mockImplementation(async (_tripId, _userId, _role) => {
  return {} as any
})

function mkReq(body: any, dayId = 'day-1') {
  return [
    new Request(`http://t/api/days/${dayId}/itinerary-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }),
    { params: { dayId } }
  ] as any
}

describe('POST /api/days/[dayId]/itinerary-items', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('creates item when place belongs to same trip as day', async () => {
    ;(prisma.days.findUnique as jest.Mock).mockResolvedValue({
      id: 'day-1',
      trip_id: 'trip-1',
      trip: { id: 'trip-1' }
    })
    ;(prisma.places.findFirst as jest.Mock).mockResolvedValue({
      id: 'place-1',
      trip_id: 'trip-1'
    })
    ;(prisma.itinerary_items.create as jest.Mock).mockResolvedValue({
      id: 'item-1',
      trip_id: 'trip-1',
      day_id: 'day-1',
      title: 'Visit',
      note: 'Notes',
      type: 'ACTIVITY',
      start_time: new Date(),
      end_time: new Date(),
      place_id: 'place-1',
      created_by_user_id: 'user-1',
      created_at: new Date()
    })

    const [req, ctx] = mkReq({
      dayId: 'day-1',
      title: 'Visit',
      description: 'Notes',
      type: 'ACTIVITY',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      locationId: 'place-1'
    })

    const res = await dayItemsPOST(req, ctx)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.data.created.id).toBe('item-1')
    expect(prisma.itinerary_items.create).toHaveBeenCalled()
  })

  it('rejects with INVALID_LOCATION when place belongs to another trip', async () => {
    ;(prisma.days.findUnique as jest.Mock).mockResolvedValue({
      id: 'day-1',
      trip_id: 'trip-1',
      trip: { id: 'trip-1' }
    })
    ;(prisma.places.findFirst as jest.Mock).mockResolvedValue(null) // not found within trip-1

    const [req, ctx] = mkReq({
      dayId: 'day-1',
      title: 'Visit',
      type: 'ACTIVITY',
      locationId: 'place-OTHER'
    })

    const res = await dayItemsPOST(req, ctx)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.ok).toBe(false)
    expect(body.error.code).toBe('INVALID_LOCATION')
  })
})