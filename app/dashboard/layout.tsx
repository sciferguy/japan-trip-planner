import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
              <Link href="/dashboard/itinerary" className="text-stone-600 hover:text-stone-800 font-medium">
                Itinerary
              </Link>
              <Link href="/dashboard/map" className="text-stone-600 hover:text-stone-800 font-medium">
                Map
              </Link>
              <Link href="/dashboard/reservations" className="text-stone-600 hover:text-stone-800 font-medium">
                Reservations
              </Link>
              <Link href="/dashboard/checklists" className="text-stone-600 hover:text-stone-800 font-medium">
                Checklists
              </Link>
              <Link href="/dashboard/expenses" className="text-stone-600 hover:text-stone-800 font-medium">
                Expenses
              </Link>
              <Link href="/dashboard/activities" className="text-stone-600 hover:text-stone-800 font-medium">
                Activities
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Profile
              </Button>
              <Button variant="ghost" size="sm">
                Sign Out
              </Button>
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