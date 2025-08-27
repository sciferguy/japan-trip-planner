// components/test/TestMobileComponents.tsx
'use client'

import { useState } from 'react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { toast } from 'sonner'

export function TestMobileComponents() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-4">Mobile Components Test</h2>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg mr-4 mb-2"
        >
          Test Bottom Sheet
        </button>

        <button
          onClick={() => toast.success('Mobile setup working! 🎉')}
          className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg"
        >
          Test Toast
        </button>
      </div>

      <BottomSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Mobile Components Ready!"
        description="Vaul & Sonner are now integrated with your theme system"
      >
        <div className="space-y-4">
          <p className="text-center">This bottom sheet uses your existing theme colors and will work perfectly on mobile devices.</p>
          <button
            onClick={() => {
              toast.success('Integration complete! Ready for Phase 2 🚀')
              setIsOpen(false)
            }}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg"
          >
            Complete Test
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}