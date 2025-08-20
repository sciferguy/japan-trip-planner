// scripts/test-itinerary-api.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const BASE_URL = 'http://localhost:3000'

async function testItineraryAPI() {
  console.log('🧪 Testing Itinerary API...\n')

  try {
    const trip = await prisma.trips.findFirst()
    const user = await prisma.user.findFirst()

    if (!trip || !user) {
      console.error('❌ No trip or user found in database.')
      return
    }

    console.log(`📍 Using trip: ${trip.title} (${trip.id})`)
    console.log(`👤 Using user: ${user.name} (${user.id})\n`)

    // Test 1: Create a new itinerary item
    console.log('1️⃣ Testing CREATE itinerary item...')
    const createPayload = {
      trip_id: trip.id,
      day: 3, // Changed to day 3 to avoid conflicts
      title: 'Shibuya Crossing Visit',
      description: 'Famous scramble crossing experience',
      start_time: '2024-09-17T10:00:00.000Z',
      end_time: '2024-09-17T11:30:00.000Z',
      type: 'ACTIVITY',
      created_by: user.id,
    }

    console.log('Payload:', JSON.stringify(createPayload, null, 2))

    const createResponse = await fetch(`${BASE_URL}/api/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createPayload),
    })

    console.log('Response status:', createResponse.status)
    console.log('Response headers:', Object.fromEntries(createResponse.headers))

    const createResult = await createResponse.json()
    console.log('✅ CREATE response:', JSON.stringify(createResult, null, 2))

    // Test 2: Get all items
    console.log('\n2️⃣ Testing GET all items...')
    const getAllResponse = await fetch(`${BASE_URL}/api/itinerary?trip_id=${trip.id}`)
    const getAllResult = await getAllResponse.json()
    console.log('✅ GET ALL response:', {
      success: getAllResult.success,
      count: getAllResult.data?.length,
    })

  } catch (error) {
    console.error('💥 Test failed with error:', error)
  } finally {
    await prisma.$disconnect()
    console.log('\n🏁 API tests completed!')
  }
}

testItineraryAPI()