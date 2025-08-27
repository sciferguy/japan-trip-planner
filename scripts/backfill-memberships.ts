// Minimal script to backfill trip_members for creators as OWNER.
// Run with: npx tsx scripts/backfill-memberships.ts

import { prisma } from '../lib/prisma'
import { TripMemberRole } from '@prisma/client'

async function main() {
  console.log('Backfilling trip memberships for creators...')
  const trips = await prisma.trips.findMany({
    select: { id: true, created_by: true }
  })

  let created = 0
  for (const t of trips) {
    if (!t.created_by) continue
    const existing = await prisma.trip_members.findUnique({
      where: { trip_id_user_id: { trip_id: t.id, user_id: t.created_by } }
    })
    if (!existing) {
      await prisma.trip_members.create({
        data: {
          trip_id: t.id,
          user_id: t.created_by,
          role: TripMemberRole.OWNER
        }
      })
      created++
    }
  }

  console.log(`Done. Created ${created} missing memberships.`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })