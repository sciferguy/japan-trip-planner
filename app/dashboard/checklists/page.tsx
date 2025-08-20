// app/(dashboard)/checklists/page.tsx
    import { auth } from '@/lib/auth'
    import { PrismaClient } from '@prisma/client'
    import { redirect } from 'next/navigation'
    import ChecklistOverview from '@/components/checklists/ChecklistOverview'

    const prisma = new PrismaClient()

    export default async function ChecklistsPage() {
      console.log('🚀 CHECKLISTS PAGE LOADING 🚀')

      const session = await auth()
      console.log('🔍 Session:', session?.user?.email, session?.user?.id)

      if (!session?.user?.id) {
        console.log('❌ No session, redirecting...')
        redirect('/sign-in')
      }

      // Get the user's trip
      let trip
      try {
        trip = await prisma.trips.findFirst({
          where: {
            created_by: session.user.id
          }
        })
        console.log('🔍 Trip found:', !!trip, trip?.id)
      } catch (error) {
        console.error('💥 Database error:', error)
        return (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-red-600">DATABASE ERROR</h1>
            <pre>{error?.toString()}</pre>
          </div>
        )
      } finally {
        await prisma.$disconnect()
      }

      if (!trip) {
        return (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-yellow-600">NO TRIP FOUND</h1>
            <p>User ID: {session.user.id}</p>
            <a href="/dashboard">Go to Dashboard</a>
          </div>
        )
      }

      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-green-600">CHECKLISTS PAGE!</h1>
          <ChecklistOverview tripId={trip.id} userId={session.user.id} />
        </div>
      )
    }