import Link from "next/link"
import { Button } from "@/components/ui/button"
// import { auth, signOut } from "@/auth"
// import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const session = await auth()
  
  // if (!session) {
  //   redirect('/sign-in')
  // }
  
  // Mock session for now
  const session = { user: { name: "Demo User", email: "demo@example.com" } }
  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-50 via-stone-50 to-bamboo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-heading font-bold text-stone-800">
                Japan Trip Planner
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-stone-600 hover:text-stone-800 font-medium">
                Dashboard
              </Link>
              <Link href="/itinerary" className="text-stone-600 hover:text-stone-800 font-medium">
                Itinerary
              </Link>
              <Link href="/map" className="text-stone-600 hover:text-stone-800 font-medium">
                Map
              </Link>
              <Link href="/reservations" className="text-stone-600 hover:text-stone-800 font-medium">
                Reservations
              </Link>
              <Link href="/checklists" className="text-stone-600 hover:text-stone-800 font-medium">
                Checklists
              </Link>
              <Link href="/expenses" className="text-stone-600 hover:text-stone-800 font-medium">
                Expenses
              </Link>
              <Link href="/activities" className="text-stone-600 hover:text-stone-800 font-medium">
                Activities
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-stone-600">
                Welcome, {session.user?.name || session.user?.email}
              </span>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Sign Out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}