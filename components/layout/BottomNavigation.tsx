'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  CheckSquare,
  Settings
} from 'lucide-react'

const navItems = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: LayoutDashboard,
    activePattern: (path: string) => path === '/dashboard'
  },
  {
    href: '/dashboard/itinerary',
    label: 'Plan',
    icon: Calendar,
    activePattern: (path: string) => path.startsWith('/dashboard/itinerary')
  },
  {
    href: '/dashboard/places',
    label: 'Places',
    icon: MapPin,
    activePattern: (path: string) => path.startsWith('/dashboard/places') || path.startsWith('/dashboard/map')
  },
  {
    href: '/dashboard/checklists',
    label: 'Tasks',
    icon: CheckSquare,
    activePattern: (path: string) => path.startsWith('/dashboard/checklists')
  },
  {
    href: '/dashboard/overview',
    label: 'More',
    icon: Settings,
    activePattern: (path: string) => path.startsWith('/dashboard/overview') || path.startsWith('/dashboard/expenses') || path.startsWith('/dashboard/activities') || path.startsWith('/dashboard/reservations')
  }
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-stone-200 dark:border-gray-700 pb-safe-bottom">
      <div className="grid grid-cols-5 h-16">
        {navItems.map(({ href, label, icon: Icon, activePattern }) => {
          const isActive = activePattern(pathname)

          return (
            <Link
              key={href}
              href={href}
              className={`
                flex flex-col items-center justify-center space-y-1 
                min-h-touch-target transition-colors duration-200
                ${isActive 
                  ? 'text-tea-600 dark:text-tea-400' 
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                }
              `}
            >
              <Icon
                size={20}
                className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}
              />
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-tea-600 dark:bg-tea-400 rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}