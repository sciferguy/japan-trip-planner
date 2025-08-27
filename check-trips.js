const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const trips = await prisma.trips.findMany({
    select: { id: true, title: true }
  })
  console.log('Trips:', trips)
  
  const members = await prisma.trip_members.findMany({
    where: { user_id: 'cmeo09ayr0000ur3l98jufpjc' },
    include: { trip: true }
  })
  console.log('Your memberships:', members)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
