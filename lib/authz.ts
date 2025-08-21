// lib/authz.ts
import { prisma } from '@/lib/prisma'
import { TripMemberRole } from '@prisma/client'

export class ApiError extends Error {
  status: number
  code: string
  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

const ROLE_ORDER: TripMemberRole[] = [
  TripMemberRole.VIEWER,
  TripMemberRole.EDITOR,
  TripMemberRole.ADMIN  // Changed from OWNER to ADMIN
]

export function hasSufficientRole(actual: TripMemberRole, needed: TripMemberRole) {
  return ROLE_ORDER.indexOf(actual) >= ROLE_ORDER.indexOf(needed)
}

export async function getMembership(tripId: string, userId: string) {
  return prisma.trip_members.findUnique({
    where: {
      trip_id_user_id: {
        trip_id: tripId,
        user_id: userId
      }
    }
  })
}

export async function requireMembership(tripId: string, userId: string) {
  const m = await getMembership(tripId, userId)
  if (!m) {
    throw new ApiError(403, 'FORBIDDEN', 'Not a trip member')
  }
  return m
}

export async function requireTripRole(
  tripId: string,
  userId: string,
  minRole: TripMemberRole
) {
  const m = await requireMembership(tripId, userId)
  if (!hasSufficientRole(m.role, minRole)) {
    throw new ApiError(403, 'FORBIDDEN', 'Insufficient role')
  }
  return m
}

// Utility to assert an entity belongs to a trip (defensive cross‑trip guard)
export async function assertEntityTrip(entity: { trip_id: string }, expectedTripId: string) {
  if (entity.trip_id !== expectedTripId) {
    throw new ApiError(400, 'CROSS_TRIP', 'Entity does not belong to trip')
  }
}