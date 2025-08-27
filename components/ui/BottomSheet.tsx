'use client'

import { Drawer } from 'vaul'
import { ReactNode, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { Button } from './button'

interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  title?: string
  description?: string
  snapPoints?: (string | number)[]
  fadeFromIndex?: number
  modal?: boolean
  className?: string
  // NEW: Allow overriding height behavior
  fitContent?: boolean
}

export function BottomSheet({
  open,
  onOpenChange,
  children,
  title,
  description,
  snapPoints = [1],
  fadeFromIndex = 0,
  modal = true,
  className,
  fitContent = false  // NEW: Default to old behavior for compatibility
}: BottomSheetProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      const vh = window.visualViewport?.height || window.innerHeight
      const diff = window.screen.height - vh
      setKeyboardHeight(diff > 150 ? diff : 0)
    }

    if (typeof window !== 'undefined') {
      const vv = window.visualViewport
      if (vv) {
        vv.addEventListener('resize', handleResize)
        return () => vv.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={snapPoints}
      fadeFromIndex={fadeFromIndex}
      modal={modal}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content
          className={cn(
            "bg-card flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 z-50 border border-border",
            // NEW: Conditional height classes
            fitContent
              ? "max-h-[80vh]"  // Only max height, let content determine actual height
              : "max-h-[90vh] min-h-[50vh]",  // Old behavior
            className
          )}
          style={{
            paddingBottom: keyboardHeight ? `${keyboardHeight}px` : '0px',
            height: keyboardHeight ? `calc(100vh - ${keyboardHeight}px)` : 'auto'
          }}
        >
          {/* Drag Handle */}
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted flex-shrink-0" />

          {/* Header */}
          {(title || description) && (
            <div className="flex items-start justify-between p-4 border-b border-border flex-shrink-0">
              <div className="flex-1">
                {title && (
                  <Drawer.Title className="text-lg font-semibold text-foreground">
                    {title}
                  </Drawer.Title>
                )}
                {description && (
                  <Drawer.Description className="text-sm text-muted-foreground mt-1">
                    {description}
                  </Drawer.Description>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-6 w-6 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          )}

          {/* Content */}
          <div className={cn(
            "p-4 pb-8",
            fitContent ? "" : "flex-1 overflow-auto"  // Only make scrollable if not fitting content
          )}>
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

// Export convenience components
export const BottomSheetTrigger = Drawer.Trigger
export const BottomSheetClose = Drawer.Close