'use client'
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignOutButton } from "@/components/SignOutButton"
import { ThemeToggle } from "@/components/ThemeToggle"
import { TripSelector } from "@/components/trips/TripSelector"
import { 
  CalendarDays, 
  Map, 
  Home,
  CheckSquare,
  Receipt,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-stone-600 dark:text-stone-300">Loading...</div>
      </div>
    )
  }

  if (!session?.user?.id) {
    redirect('/sign-in')
  }

  const navLinks = [
    { href: '/dashboard', label: 'Overview', mobileLabel: 'Today', icon: Home },
    { href: '/dashboard/itinerary', label: 'Itinerary', mobileLabel: 'Days', icon: CalendarDays },
    { href: '/dashboard/places', label: 'Places', mobileLabel: 'Places', icon: Map },
    { href: '/dashboard/checklists', label: 'Checklist', mobileLabel: 'Pack', icon: CheckSquare },
    { href: '/dashboard/expenses', label: 'Expenses', mobileLabel: 'Budget', icon: Receipt },
  ]

  const isActiveLink = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen-safe organic-background bg-gradient-to-br from-stone-50 via-sakura-50 to-tea-50 dark:from-stone-900 dark:via-tea-900 dark:to-sakura-900">
      {/* Desktop Navigation */}
<div className="hidden md:block sticky top-0 z-50">
  {/* Main Navigation */}
  <nav className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-stone-200 dark:border-gray-700">
    <div className="container mx-auto px-6">
      <div className="flex items-center justify-between h-16">
      <div className="flex items-center justify-between flex-1">
          <Link 
            href="/dashboard"
            className="text-xl font-heading font-bold text-stone-800 dark:text-white hover:text-sakura-600 dark:hover:text-sakura-400 transition-colors"
          >
            🌸 Japan Trip Planner
          </Link>
          
          {/* Desktop Nav Links - Centered */}
          <div className="flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActiveLink(link.href)
                      ? 'bg-sakura-100 dark:bg-sakura-900/30 text-sakura-700 dark:text-sakura-300'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        <SignOutButton />
      </div>
    </div>
  </nav>

  {/* Sub-header Bar */}
  <div className="bg-stone-50 dark:bg-gray-900 border-b border-stone-200 dark:border-gray-700">
    <div className="container mx-auto px-6">
      <div className="flex items-center justify-between h-12">
        <TripSelector />
        <ThemeToggle />
      </div>
    </div>
  </div>
</div>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-stone-200 dark:border-gray-700 pt-safe-top">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/dashboard"
            className="text-lg font-heading font-bold text-stone-800 dark:text-white"
          >
            🌸 Trip Planner
          </Link>
          <div className="flex items-center space-x-2">
            <TripSelector />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 border-b border-stone-200 dark:border-gray-700 shadow-lg">
            <div className="container mx-auto px-4 py-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all
                      ${isActiveLink(link.href)
                        ? 'bg-sakura-100 dark:bg-sakura-900/30 text-sakura-700 dark:text-sakura-300'
                        : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
              
              <div className="mt-3 pt-3 border-t border-stone-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-stone-600 dark:text-stone-300">
                    {session.user.name || session.user.email?.split('@')[0] || 'User'}
                  </span>
                  <SignOutButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Breadcrumb or Page Title */}
        <div className="mb-6 md:mb-8">
          <p className="text-stone-700 dark:text-stone-200 text-sm md:text-base font-medium">
            Welcome back, {session.user.name || session.user.email?.split('@')[0] || 'there'}
          </p>
        </div>
        
        {children}
      </main>

      {/* Mobile Bottom Navigation (Optional - Alternative to header menu) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-stone-200 dark:border-gray-700 pb-safe-bottom">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all
                  ${isActiveLink(link.href)
                    ? 'bg-sakura-100 dark:bg-sakura-900/30 text-sakura-700 dark:text-sakura-300'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{link.mobileLabel || link.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}