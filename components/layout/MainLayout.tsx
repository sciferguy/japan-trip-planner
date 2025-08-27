'use client'

import { Navigation } from './Navigation'
import { BottomNavigation } from './BottomNavigation'
import { MobileContainer } from '@/components/ui/MobileContainer'
import { usePathname } from 'next/navigation'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const showGlobalNav = !pathname.startsWith('/dashboard')
  const showBottomNav = pathname.startsWith('/dashboard')

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Navigation - Hidden on Mobile */}
      {showGlobalNav && (
        <div className="hidden md:block">
          <Navigation />
        </div>
      )}

      {/* Mobile-First Layout */}
      <MobileContainer withPadding={false}>
        <main className={`
          flex-1 
          ${showBottomNav ? 'pb-16 md:pb-0' : ''} 
          ${showGlobalNav ? 'md:pt-0' : ''}
        `}>
          {children}
        </main>

        {/* Bottom Navigation - Mobile Only */}
        {showBottomNav && (
          <div className="md:hidden">
            <BottomNavigation />
          </div>
        )}
      </MobileContainer>
    </div>
  )
}