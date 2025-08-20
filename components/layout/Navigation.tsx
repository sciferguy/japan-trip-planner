// components/layout/Navigation.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SignOutButton } from '@/components/SignOutButton'
import { useSession, signIn } from 'next-auth/react'

export function Navigation() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/itinerary', label: 'Itinerary', icon: '📅' },
    { href: '/dashboard/checklists', label: 'Checklists', icon: '✅' },
    { href: '/dashboard/map', label: 'Places', icon: '📍' },
    { href: '/dashboard/expenses', label: 'Expenses', icon: '💰' },
    { href: '/dashboard/activities', label: 'Activities', icon: '🎯' },
    { href: '/dashboard/reservations', label: 'Reservations', icon: '🎫' },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/dashboard" className="font-semibold">
          Japan Trip Planner
        </Link>
        <nav className="flex flex-1 items-center gap-2">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-3 py-2 text-sm font-medium transition ${
                isActive(item.href)
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {status === 'loading' && (
            <span className="text-xs text-gray-500">Loading...</span>
          )}
          {session?.user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                {session.user.name || session.user.email}
              </span>
              <SignOutButton />
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-black"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}