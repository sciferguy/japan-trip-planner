// prisma/seed.ts
import { PrismaClient, TripMemberRole } from '@prisma/client'
import { randomUUID } from 'node:crypto'

const prisma = new PrismaClient()

async function upsertUser(email: string, name: string) {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { id: randomUUID(), email, name }
  })
}

function inclusiveDates(start: Date, end: Date): Date[] {
  const out: Date[] = []
  const d = new Date(start)
  while (d <= end) {
    out.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return out
}

async function createTripWithDays(ownerId: string) {
  const start = new Date()
  const end = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
  const trip = await prisma.trips.create({
    data: {
      id: randomUUID(),
      title: 'Sample Trip',
      start_date: start,
      end_date: end,
      created_by: ownerId
    }
  })
  const days = await Promise.all(
    inclusiveDates(start, end).map(date =>
      prisma.days.create({
        data: {
          id: randomUUID(),
            trip_id: trip.id,
            date
        }
      })
    )
  )
  return { trip, days }
}

async function addMembership(tripId: string, userId: string, role: TripMemberRole) {
  return prisma.trip_members.upsert({
    where: { trip_id_user_id: { trip_id: tripId, user_id: userId } },
    update: { role },
    create: {
      id: randomUUID(),
      trip_id: tripId,
      user_id: userId,
      role
    }
  })
}

interface SeedItemSpec {
  title: string
  startMin: number
  endMin: number
}

async function seedItineraryDay(tripId: string, dayId: string, userId: string, specs: SeedItemSpec[]) {
  const base = new Date()
  base.setMinutes(0, 0, 0)
  for (const spec of specs) {
    const start = new Date(base.getTime() + spec.startMin * 60000)
    const end = new Date(base.getTime() + spec.endMin * 60000)
    await prisma.itinerary_items.create({
      data: {
        id: randomUUID(),
        trip_id: tripId,
        day_id: dayId,
        title: spec.title,
        type: 'ACTIVITY',
        start_time: start,
        end_time: end,
        created_by: userId,
        created_at: new Date()
      }
    })
  }
}

async function main() {
  console.log('Seeding...')
  // Clean (optional; adjust if you want to preserve data)
  // await prisma.itinerary_items.deleteMany()
  // await prisma.trip_members.deleteMany()
  // await prisma.days.deleteMany()
  // await prisma.trips.deleteMany()
  // await prisma.user.deleteMany()

  const owner = await upsertUser('owner@example.com', 'Owner User')
  const editor = await upsertUser('editor@example.com', 'Editor User')
  const viewer = await upsertUser('viewer@example.com', 'Viewer User')

  const { trip, days } = await createTripWithDays(owner.id)
  await addMembership(trip.id, owner.id, TripMemberRole.OWNER)
  await addMembership(trip.id, editor.id, TripMemberRole.EDITOR)
  await addMembership(trip.id, viewer.id, TripMemberRole.VIEWER)

  // Day 1: overlapping items (Breakfast + Overlap + Extended)
  await seedItineraryDay(trip.id, days[0].id, owner.id, [
    { title: 'Breakfast', startMin: 8 * 60, endMin: 9 * 60 },
    { title: 'Museum (overlaps breakfast end)', startMin: 8 * 60 + 30, endMin: 10 * 60 + 30 },
    { title: 'Short Stop (chains with museum)', startMin: 10 * 60 + 15, endMin: 11 * 60 },
    { title: 'Lunch (no overlap)', startMin: 12 * 60, endMin: 13 * 60 }
  ])

  // Day 2: no overlaps
  await seedItineraryDay(trip.id, days[1].id, editor.id, [
    { title: 'Morning Walk', startMin: 9 * 60, endMin: 10 * 60 },
    { title: 'Coffee', startMin: 10 * 60 + 30, endMin: 11 * 60 },
    { title: 'Temple Visit', startMin: 12 * 60, endMin: 13 * 60 + 30 }
  ])

  console.log('Seed complete. Trip ID:', trip.id)
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })