# Task Backlog
   
   ## P0 (Critical / Fix Now)[DONE]
   1. Unify itinerary item API: deprecate `api/itinerary-items` POST (raw response) in favor of `api/days/[dayId]/itinerary-items` (standard `{ ok: true }` envelope + overlap recomputation).[Done]
   2. Implement missing PUT (or migrate UI to PATCH) for `EditActivityForm`; current form calls PUT but only PATCH exists.[Done]
   3. Standardize time serialization: always return ISO strings (current duplicate route file has raw Date vs ISO).[Done]
   4. Remove duplicate route file variant with differing `mapItem` (ensure single source with `toIso` helper).[Done]
   5. Prevent cross‑trip item creation/move in create route (already enforced in update).[Done]
   6. Add validation (Zod) to legacy `/api/itinerary-items` or remove it after UI migration.[Done]
   7. Ensure client components (`AddActivityForm`, `EditActivityForm`) send `startTime` / `endTime` matching schema (`start_time` vs `startTime` mismatch).[Done]
   8. Complete Prisma Schema with TripMember table and createdByUserId attribution fields.[Done]
   9. Implement authorization helpers (`getSessionUser`, `requireTripRole`, `assertEntityTrip`).[Done]
   10. Add role-based access control to all itinerary and places API endpoints.[Done]
   11. Create Places CRUD API with proper field mapping (snake_case ↔ camelCase).[Done]
   12. Implement Google Maps URL parsing endpoint with validation.[Done]
   13. Add Zod validation schemas for all entities in `lib/validation/*`.[Done]
   14. Implement unified error envelope utility (`run`, `ok`, `fail`).[Done]
   
   ## P1 (High)[DONE]
   1. Consolidate duplicated type enums: `types/index.ts` vs Prisma enums vs `types/itinerary.ts`.[Done]
   2. Generate shared DTO types from Zod schemas to eliminate divergence.[Done]
   3. Add unit tests for `computeOverlaps` (edge cases: touching intervals, null times, chained overlaps).[Done]
   4. Add optimistic update + rollback logic in `useDayItinerary` and/or Zustand store.[Done]
   5. Normalize location handling (creation stub uses placeholder lat/lng 0).[Done]
   6. Add role/permission integration tests for itinerary endpoints.[Done]
   7. Add input to clear times (support sending explicit null in PATCH UI).[Done]
   8. Build Places UI components: [Done]
      - Places list view at `/dashboard/places`
      - Add/edit place form with Google Maps URL parsing integration
      - Place selection dropdown for itinerary items
   9. Implement trip switching UI (current `useCurrentTrip` hook supports multiple trips but no UI to switch)[Done]
   10. Create dashboard overview page (currently shows placeholder; should show today's itinerary + weather + checklist summary)[Done]
   
   ## P0 (Critical User Journey - URGENT)
   **Note: These are the actual blockers preventing users from using the app**
   
   **Essential Mobile Components Build Order:**
   1. MobileLayout (bottom nav + safe areas) - Foundation
   2. BottomSheet (trip creation/selection) - Core modals
   3. TouchableCard (activity items) - Touch interactions
   4. MobileFormStepper (trip creation wizard) - Multi-step forms
   5. BottomNavigation, SwipeableViews, FAB, PullToRefresh - Advanced interactions
   
   ### **Phase 1: Mobile Navigation Foundation (Morning Priority)**
   
   1. **Add Vaul & Sonner Dependencies** - Modern UI Foundation
      - Install: `npm install vaul sonner`
      - Set up Sonner toaster in `app/layout.tsx`
      - Create base `components/ui/BottomSheet.tsx` wrapper around Vaul
      - Test basic bottom sheet functionality on mobile device
      - **Time: 30 minutes**
   
   2. **Mobile Navigation Foundation** - Required before any features work
      - Implement bottom tab navigation layout in `components/layout/`
      - Add mobile header with hamburger/back button
      - Create responsive dashboard layout with safe areas
      - Set up mobile breakpoints and container constraints in `tailwind.config.js`
      - Update `app/dashboard/layout.tsx` for mobile-first structure
      - Test navigation flow on actual mobile device
   
   3. **Mobile Dashboard Container** - Core layout structure
      - Update `components/layout/MainLayout.tsx` for mobile-first design
      - Implement safe area handling for notched screens
      - Add responsive grid system for dashboard sections
      - Create mobile-friendly header with trip context
   
   4. **Essential Mobile UI Components** - Foundation components
      - Enhance `components/ui/BottomSheet.tsx` with mobile-specific props
      - Create `components/ui/TouchableCard.tsx` for list items
      - Add `components/ui/MobileFormStepper.tsx` for wizards
      - Implement `components/ui/FloatingActionButton.tsx`
      - Add toast integration for user feedback using Sonner
   
   ### **Phase 2: Trip Creation & User Experience (Afternoon Priority)**
   
   5. **Trip Creation Flow** - Core functionality
      - Create trip creation API integration in existing `app/api/trips/`
      - Build trip creation wizard at `/dashboard/trips/new` using BottomSheet (Vaul)
      - Implement multi-step form with MobileFormStepper:
        - Step 1: Trip basics (name, destination, start/end dates)
        - Step 2: Generate days with native date picker
        - Step 3: Optional place import preview
      - Auto-generate days based on trip duration
      - Add success state with "Get Started" tour using Sonner toasts
   
   6. **First-Time User Experience** - Onboarding flow
      - Add comprehensive "no trips found" empty state with prominent "Create Your First Trip" CTA
      - Implement guided onboarding flow after trip creation
      - Update `app/dashboard/page.tsx` to handle empty state gracefully
      - Add feature discovery tooltips for first-time users
      - Create mobile-optimized onboarding flow with toast feedback
   
   7. **Drag & Drop Activity Reordering** - Core MVP Feature
      - Install: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
      - Implement drag & drop in existing `ItineraryItemCard` component
      - Add touch-friendly drag handles and long-press to initiate drag
      - Implement time recalculation on item reorder
      - Add haptic feedback and visual indicators during drag
      - Test smooth touch interactions on mobile device
      - Add Sonner toast confirmations for successful reorders
      - **Time: 2-3 hours**
   
   ### **Phase 3: Mobile Interaction Patterns (If Time Permits)**
   
   8. **Mobile-First Interaction Patterns** - Essential touch interactions
      - Implement swipe gestures for day navigation (left/right)
      - Add pull-to-refresh for itinerary updates
      - Use bottom sheets for forms/modals instead of center modals
      - Implement long-press for quick actions (edit/delete)
      - Add haptic feedback for confirmation actions
   
   9. **Day Management & Navigation UX** - Mobile day navigation
      - Fix day auto-generation during trip creation
      - Implement horizontal swipe between days (Instagram Stories pattern)
      - Add day pills/chips for quick selection
      - Use sticky date header that shows current day
      - Add Previous/Next day navigation with thumb-friendly buttons
      - Add "Today" highlight when viewing current date
   
   ### **Phase 4: Critical UX Infrastructure (Secondary)**
   
   10. **Essential UX States** - User feedback systems
       - Add loading states for all async operations (trip creation, day switching, etc.)
       - Implement comprehensive toast notifications for success/error feedback using Sonner
       - Add confirmation dialogs for destructive actions (delete trip, etc.)
       - Create proper error states with recovery actions
   
   11. **Trip Context & Navigation** - Users need constant awareness of current trip
       - Add trip name/dates in mobile dashboard header
       - Implement active trip indicator in bottom navigation
       - Create trip switcher as bottom sheet (not global navigation)
       - Remove breadcrumb navigation (anti-pattern on mobile)
   
   12. **Fix Broken Dashboard Sections** - Trip context propagation
       - Fix trip context propagation in `/dashboard/checklists`
       - Fix trip context propagation in `/dashboard/expenses`
       - Fix trip context propagation in `/dashboard/activities`
       - Ensure all sections work with trip selection
       - Add consistent empty states with actionable CTAs across all sections
   
   ## P2 (Medium - Post User Journey)
   1. **Overlap Detection UI** - Add visual overlap warnings in `ItineraryItemCard`
   2. **Weather Integration** - Full weather system implementation
      - Weather API endpoint with caching (6h staleness)
      - Daily weather display in itinerary views
      - Add location fields to trips table for fallback weather location
   3. **Advanced Trip Management**
      - Trip editing functionality
      - Trip deletion with confirmation
      - Trip duplication feature
   4. **Progressive Trip Setup Flow** - Guide users through logical sequence
      - After trip creation: "Add your first place" CTA
      - After place creation: "Plan your first day" prompts
      - Progressive feature discovery (don't overwhelm with all features)
      - Clear value proposition at each step
   5. Pagination or lazy loading for large day item lists
   6. Batch endpoint: move multiple items between days with overlap recompute
   7. Caching layer or ETag for day itinerary GET
   8. Add indexing (DB): `(day_id, start_time)` to optimize sorted queries
   9. Improve overlap algorithm to O(n log n) sweep if future constraints grow
   
   ## P3 (Future / Nice to Have - Post MVP)
   1. **Advanced Drag & Drop Features**
      - Multi-select drag operations
      - Drag between different days
      - Drag from places list to itinerary
      - Advanced reorder animations with Framer Motion
   2. **Modern React Features (Post-Launch)**
      - React 19 Actions for form handling
      - Next.js 15 + Turbopack migration
      - TanStack Query v5 for advanced data fetching
   3. **Progressive Web App**
      - Next-PWA implementation for installable app
      - Offline trip data caching
      - Push notifications for trip reminders
   4. Real‑time sync (WebSocket / SSE) broadcasting day updates
   5. Bulk operations (multi‑select delete, move)
   6. Advanced conflict resolution (detect concurrent edits on same item)
   7. Timeline / Gantt style visualization
   8. Calendar export (iCal) for dated items
   9. Add error boundaries around major sections
   10. Implement expenses system with FX conversion
   11. Add export/import functionality (JSON)
   12. Create print view at `/dashboard/print`
   13. Implement offline snapshot with LocalStorage fallback
   14. Make map functional at `/dashboard/map`
   15. Implement reservations system at `/dashboard/reservations`
   16. Keyboard navigation support
   17. Advanced search and filtering
   
   ## P4 (Housekeeping)
   1. Add ESLint rule to forbid direct Date serialization leakage
   2. Adopt consistent naming: `createdAt` / `created_at` mapping utility
   3. Storybook stories for itinerary cards & forms
   4. Monitoring & structured logging for API errors
   
   ## Current State Assessment
   - **APIs**: ✅ Fully built and functional
   - **Components**: ✅ Built but not integrated into mobile-first user flow
   - **Mobile Foundation**: ❌ **MISSING - No mobile navigation or layout structure**
   - **User Journey**: ❌ **BROKEN - Users cannot create/manage trips**
   - **Mobile UX**: ❌ **MISSING - No touch interactions, native patterns, or mobile testing**
   - **Actual Completion**: ~**55%** (mobile-first requirements significantly impact completion)
   
   ## Tomorrow's Priority (Mobile-First Execution Order)
   **Focus 100% on mobile foundation first, then user journey:**
   
   ### **Morning Session (9AM-12PM): Mobile Foundation**
   1. **Add Vaul & Sonner** (#1) - Modern UI foundation (30 mins)
   2. **Bottom Navigation Layout** (#2) - Core mobile navigation pattern
   3. **Mobile Dashboard Container** (#3) - Responsive layout with safe areas
   4. **Essential Mobile UI Components** (#4) - BottomSheet, TouchableCard, MobileFormStepper
   
   ### **Afternoon Session (1PM-5PM): Trip Creation & Core Features**
   5. **Trip Creation Flow** (#5) - Bottom sheet wizard with mobile-native patterns
   6. **First-Time User Experience** (#6) - Mobile onboarding and empty states
   7. **Drag & Drop Activity Reordering** (#7) - Core MVP feature for activity management (2-3 hours)
   
   ### **Mobile Testing Protocol (Throughout):**
   - Test every component on actual mobile device (not just browser resize)
   - Verify thumb reach for all primary actions (minimum 44px hit targets)
   - Check swipe gestures work smoothly on touch screens
   - Validate form inputs trigger correct mobile keyboards
   - Test bottom sheet interactions feel native (Vaul)
   - Test drag & drop feels smooth and responsive (@dnd-kit)
   - Verify safe area handling on notched devices
   - Test toast notifications appear correctly (Sonner)
   
   ### **Success Criteria for Tomorrow:**
   - ✅ Bottom navigation works natively on mobile
   - ✅ Trip creation flows smoothly via bottom sheet (Vaul)
   - ✅ Activity reordering works smoothly via touch drag & drop
   - ✅ Toast feedback provides clear user communication (Sonner)
   - ✅ New users can onboard without confusion
   - ✅ All interactions feel mobile-native (not desktop-responsive)
   - ✅ Core user journey: Sign up → Create trip → View dashboard → Add activity → Reorder activities
   
   ### **Weekend Goals (Saturday):**
   - ✅ Advanced mobile interactions (swipe navigation, pull-to-refresh)
   - ✅ Polish drag & drop animations and feedback
   - ✅ Comprehensive mobile testing on various devices
   - ✅ Performance optimization and final UX tweaks
   
   **Goal:** A new mobile user can complete the entire core journey without any desktop-centric friction, including the natural activity reordering behavior that makes trip planning feel intuitive. The foundation supports all future mobile-first features.
   
   ## Technology Stack (Updated)
   **Core Dependencies:**
   - ✅ Next.js 14 + React 18 (stable, production-ready)
   - ✅ TypeScript + Tailwind CSS
   - ✅ Prisma + Supabase
   - ✅ NextAuth.js for authentication
   
   **New MVP Dependencies:**
   - ✅ **Vaul** - Native mobile bottom sheets
   - ✅ **Sonner** - Mobile-optimized toast notifications  
   - ✅ **@dnd-kit** - Touch-friendly drag & drop reordering
   
   **Post-MVP Exploration:**
   - 🔮 React 19 + Next.js 15 (post-launch migration)
   - 🔮 Framer Motion 11 (advanced animations)
   - 🔮 Next-PWA (installable app experience)
   - 🔮 TanStack Query v5 (advanced data management)