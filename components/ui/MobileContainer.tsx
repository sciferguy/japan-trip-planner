'use client'

import { ReactNode } from 'react'

interface MobileContainerProps {
  children: ReactNode
  className?: string
  withPadding?: boolean
}

export function MobileContainer({
  children,
  className = '',
  withPadding = true
}: MobileContainerProps) {
  return (
    <div className={`
      min-h-screen-safe 
      ${withPadding ? 'pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}