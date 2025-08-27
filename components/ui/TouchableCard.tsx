'use client'

import { ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TouchableCardProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: 'default' | 'interactive' | 'elevated' | 'kawaii'
  disabled?: boolean
  loading?: boolean
  haptic?: boolean
}

export const TouchableCard = forwardRef<
  HTMLElement,
  TouchableCardProps
>(({
  children,
  onClick,
  className = '',
  variant = 'default',
  disabled = false,
  loading = false,
  haptic = true
}, ref) => {
  const baseStyles = "rounded-lg border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

  const variants = {
    default: "bg-card border-border text-card-foreground",
    interactive: cn(
      "bg-card border-border text-card-foreground",
      "hover:shadow-md hover:border-tea-300 dark:hover:border-tea-600",
      "active:scale-[0.98] active:shadow-sm",
      "cursor-pointer"
    ),
    elevated: cn(
      "bg-card border-border text-card-foreground shadow-zen",
      "hover:shadow-zen-lg hover:border-tea-300 dark:hover:border-tea-600",
      "active:scale-[0.99]",
      "cursor-pointer"
    ),
    kawaii: cn(
      "bg-gradient-to-br from-sakura-50 to-tea-50 border-sakura-200",
      "dark:from-tea-800 dark:to-sakura-800 dark:border-tea-600",
      "hover:shadow-md hover:from-sakura-100 hover:to-tea-100",
      "dark:hover:from-tea-700 dark:hover:to-sakura-700",
      "active:scale-[0.98]",
      "cursor-pointer"
    )
  }

  const handleClick = () => {
    if (disabled || loading) return

    // Mobile haptic feedback
    if (haptic && typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10) // Light haptic feedback
    }

    onClick?.()
  }

  const Component = onClick ? 'button' : 'div'
  const isClickable = onClick && !disabled && !loading

  return (
    <Component
      ref={ref as any}
      onClick={isClickable ? handleClick : undefined}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        isClickable && 'min-h-touch-target',
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'cursor-wait',
        className
      )}
      type={onClick ? 'button' : undefined}
    >
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tea-600"></div>
        </div>
      ) : (
        children
      )}
    </Component>
  )
})

TouchableCard.displayName = "TouchableCard"