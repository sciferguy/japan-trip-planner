'use client'

import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { SignOutButton } from "@/components/SignOutButton"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useState } from 'react'
import {
  Menu,
  X,
  LayoutDashboard,
  Calendar,
  Map,
  Hotel,
  CheckSquare,
  DollarSign,
  Activity
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session?.user?.id) {
    redirect('/sign-in')
  }

  const navigationLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/itinerary', label: 'Itinerary', icon: Calendar },
    { href: '/dashboard/map', label: 'Map', icon: Map },
    { href: '/dashboard/reservations', label: 'Reservations', icon: Hotel },
    { href: '/dashboard/checklists', label: 'Checklists', icon: CheckSquare },
    { href: '/dashboard/expenses', label: 'Expenses', icon: DollarSign },
    { href: '/dashboard/activities', label: 'Activities', icon: Activity },
  ]

  return (
    <div className="min-h-screen organic-background bg-gradient-to-br from-stone-50 via-sakura-50 to-tea-50 dark:from-stone-900 dark:via-tea-900 dark:to-sakura-900">

      {/* Navigation */}
      <nav className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-stone-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <span className="text-xl font-heading font-bold text-stone-800 dark:text-white">
                🌸 Japan Trip Planner
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center space-x-2 text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-white font-medium transition-colors px-3 py-2 rounded-md hover:bg-stone-100 dark:hover:bg-gray-700"
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button & Actions */}
            <div className="flex items-center space-x-3">
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-stone-600 dark:text-stone-300 p-2 rounded-md hover:bg-stone-100 dark:hover:bg-gray-700"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
              <div className="hidden md:flex items-center space-x-3">
                <ThemeToggle />
                <SignOutButton />
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-stone-200 dark:border-gray-700 py-4">
              <div className="flex flex-col space-y-2">
                {navigationLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-white font-medium transition-colors px-3 py-2 rounded-md hover:bg-stone-100 dark:hover:bg-gray-700"
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                ))}
                <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-gray-700">
                  <ThemeToggle />
                  <SignOutButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <p className="text-stone-700 dark:text-stone-200 text-base font-medium">
            Welcome back, {session.user.name || session.user.email?.split('@')[0] || 'there'}
          </p>
        </div>
        {children}
      </main>
    </div>
  )
}