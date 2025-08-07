"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut({ callbackUrl: "/" })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tea-50 via-stone-50 to-bamboo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tea-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tea-50 via-stone-50 to-bamboo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800 mb-4">Access Denied</h1>
          <p className="text-stone-600 mb-6">You need to be signed in to access the dashboard.</p>
          <Link href="/sign-in">
            <Button className="bg-tea-600 hover:bg-tea-700">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-50 via-stone-50 to-bamboo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
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
              <div className="hidden sm:flex items-center space-x-2 text-sm text-stone-600">
                <span>Welcome,</span>
                <span className="font-medium text-stone-800">
                  {session.user?.name || session.user?.email || 'User'}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} disabled={isSigningOut}>
                {isSigningOut ? 'Signing out...' : 'Sign Out'}
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