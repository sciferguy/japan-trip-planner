const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createDays() {
  const trips = await prisma.trips.findMany()
  
  for (const trip of trips) {
    const start = new Date(trip.start_date)
    const end = new Date(trip.end_date)
    
    const days = []
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({
        trip_id: trip.id,
        date: new Date(d)
      })
    }
    
    await prisma.days.createMany({
      data: days,
      skipDuplicates: true
    })
    
    console.log(`Created ${days.length} days for trip: ${trip.title}`)
  }
  
  const allDays = await prisma.days.findMany({ include: { trip: true }})
  console.log('All days:', allDays)
}

createDays()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
