// components/layout/MainLayout.tsx
'use client'

import { Navigation } from './Navigation'
import { usePathname } from 'next/navigation'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const showGlobalNav = !pathname.startsWith('/dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      {showGlobalNav && <Navigation />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}