// scripts/test-itinerary-api.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const AUTH_COOKIE = process.env.AUTH_COOKIE // e.g. "next-auth.session-token=..."

async function main() {
  console.log('🧪 Testing new itinerary item endpoints...\n')

  const day = await prisma.days.findFirst({
    orderBy: { date: 'asc' }
  })
  if (!day) {
    console.error('No day found. Seed days first.')
    return
  }
  console.log(`Using day: ${day.id} (trip ${day.trip_id})`)

  // CREATE
  const start = new Date(day.date)
  start.setHours(9, 0, 0, 0)
  const end = new Date(day.date)
  end.setHours(10, 0, 0, 0)

  const createPayload = {
    title: 'Morning Activity',
    description: 'Test create',
    type: 'ACTIVITY',
    startTime: start.toISOString(),
    endTime: end.toISOString()
  }

  const createRes = await fetch(`${BASE_URL}/api/days/${day.id}/itinerary-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(AUTH_COOKIE ? { Cookie: AUTH_COOKIE } : {})
    },
    body: JSON.stringify(createPayload)
  })
  const createJson = await createRes.json()
  console.log('Create status', createRes.status, createJson)
  if (!createJson.data?.created?.id) return
  const createdId = createJson.data.created.id

  // PATCH (overlap by shifting within same hour)
  const patchRes = await fetch(`${BASE_URL}/api/itinerary-items/${createdId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(AUTH_COOKIE ? { Cookie: AUTH_COOKIE } : {})
    },
    body: JSON.stringify({
      title: 'Updated Activity',
      startTime: start.toISOString(),
      endTime: end.toISOString()
    })
  })
  console.log('Patch status', patchRes.status, await patchRes.json())

  // DELETE
  const delRes = await fetch(`${BASE_URL}/api/itinerary-items/${createdId}`, {
    method: 'DELETE',
    headers: {
      ...(AUTH_COOKIE ? { Cookie: AUTH_COOKIE } : {})
    }
  })
  console.log('Delete status', delRes.status, await delRes.json())

  console.log('\n✅ Test flow completed')
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())