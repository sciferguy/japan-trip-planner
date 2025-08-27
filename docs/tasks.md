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
15. Add Vaul & Sonner Dependencies - Modern UI Foundation[Done]
16. Mobile Navigation Foundation - Core mobile navigation pattern[Done]
17. Mobile Dashboard Container - Responsive layout with safe areas[Done]
18. Essential Mobile UI Components - BottomSheet, TouchableCard, MobileFormStepper[Done]

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
11. Trip Creation Flow - Bottom sheet wizard with mobile-native patterns[Done]
12. First-Time User Experience - Mobile onboarding and empty states[Done]
13. Drag & Drop Activity Reordering - Core MVP feature for activity management[Done]

## P0 (Critical User Journey - URGENT)
1. MobileLayout (bottom nav + safe areas) - Foundation [Done]
2. BottomSheet (trip creation/selection) - Core modals [Done]
3. TouchableCard (activity items) - Touch interactions [Done]
4. MobileFormStepper (trip creation wizard) - Multi-step forms [Done]
5. BottomNavigation, SwipeableViews, FAB, PullToRefresh - Advanced interactions
6. Mobile Dashboard Container - Core layout structure [Done]
7. Essential Mobile UI Components - Foundation components [Done]
8. Trip Creation Flow - Core functionality [Done]
9. First-Time User Experience - Onboarding flow [Done]
10. Drag & Drop Activity Reordering - Core MVP Feature [Done]
11. Mobile-First Interaction Patterns - Essential touch interactions
12. Day Management & Navigation UX - Mobile day navigation [Done]
13. Essential UX States - User feedback systems
14. Trip Context & Navigation - Users need constant awareness of current trip [Done]
15. Fix Broken Dashboard Sections - Trip context propagation [Done]
    - [Done] **Pre-Trip Checklist Card**: Show real checklist count (x/y tasks • x% complete), empty state "Start your checklist →", CTA to /dashboard/checklists
    - [Done] **Itinerary Gaps Card**: Show "X days need activities" or "Day X is empty", empty state "Add your first activity →", CTA to /dashboard/itinerary
    - [Done] **Today Card (Context-Aware)**: 
      - Planning phase: Show "Today's Focus" with next action (e.g., "Add activities to Day 3")
      - Travel phase: Show "Today's Plans" with actual day itinerary
      - Empty states: "Just getting started" 
    - [Done] Remove misleading boilerplate data (fake 3/8, pending 5, "Active" status)
    - [Done] Implement getTripPhase() logic for contextual card content
    - [Done] Add proper CTAs to each card linking to relevant pages
16. Implement expenses system with FX conversion at /dashboard/expenses 
17. **Places Hub Consolidation - Unified places experience (MAP + LIST + SAVED)**
    - [Done] Create unified `/dashboard/places/page.tsx` combining map and list functionality
    - [Done] Implement view toggle (Map View / List View / Saved)
    - [Done] Integrate existing interactive map as primary view with filterable layers
    - [ ] Auto-pull itinerary locations into map
    - [ ] Add place details sidebar/modal on marker click
    - [ ] Create structured list view with sections (From Itinerary, Saved, Popular)
    - [ ] Implement save/unsave functionality with personal notes
    - [ ] Remove separate "Explore Places" from dashboard
    - [ ] Update navigation to point to single Places section

## P2 (Medium - Post User Journey)
1. Overlap Detection UI - Add visual overlap warnings in `ItineraryItemCard`
2. Weather Integration - Full weather system implementation
3. Advanced Trip Management
4. Progressive Trip Setup Flow - Guide users through logical sequence
5. Pagination or lazy loading for large day item lists
6. Batch endpoint: move multiple items between days with overlap recompute
7. Caching layer or ETag for day itinerary GET
8. Add indexing (DB): `(day_id, start_time)` to optimize sorted queries
9. Improve overlap algorithm to O(n log n) sweep if future constraints grow
10. Calendar View - Visual calendar display of itinerary at /dashboard/itinerary/calendar
11. **Places Hub Phase 2 - Enhanced Features**
    - [ ] Time-based contextual suggestions (breakfast/lunch/dinner)
    - [ ] Proximity-based recommendations (near other itinerary items)
    - [ ] Two-way sync between map and itinerary
    - [ ] Show routing/distances between places
    - [ ] Custom categorization/tags for saved places

## P3 (Future / Nice to Have - Post MVP)
1. Advanced Drag & Drop Features
2. Modern React Features (Post-Launch)
3. Progressive Web App
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
14. **Places Hub Phase 3 - Global Scalability**
    - [ ] Google Places API integration for global coverage
    - [ ] Foursquare/Yelp API for recommendations
    - [ ] ML-based suggestions from user patterns
    - [ ] Collaborative filtering from similar trips
    - [ ] Weather-aware recommendations
    - [ ] Geocoding for address search
15. Implement reservations system at `/dashboard/reservations`
16. Keyboard navigation support
17. Advanced search and filtering
18. Create print view at /dashboard/print (if not already listed)
19. Implement cross-day drag and drop (more complex)
20. Implement reservations system at /dashboard/reservations

## P4 (Housekeeping)
1. Add ESLint rule to forbid direct Date serialization leakage
2. Adopt consistent naming: `createdAt` / `created_at` mapping utility
3. Storybook stories for itinerary cards & forms
4. Monitoring & structured logging for API errors
5. **Places Hub Technical Debt**
    - [ ] Add `saved_places` table for user bookmarks
    - [ ] Add `place_notes` for user annotations
    - [ ] Implement caching strategy for external API data
    - [ ] Optimize map performance with clustering
    - [ ] Add Places API rate limiting and error handling

---

## Reference: Process Notes & Checklists

### Mobile Testing Protocol
- Test every component on actual mobile device (not just browser resize)
- Verify thumb reach for all primary actions (minimum 44px hit targets)
- Check swipe gestures work smoothly on touch screens
- Validate form inputs trigger correct mobile keyboards
- Test bottom sheet interactions feel native (Vaul)
- Test drag & drop feels smooth and responsive (@dnd-kit)
- Verify safe area handling on notched devices
- Test toast notifications appear correctly (Sonner)

### Success Criteria for Mobile Foundation
- Bottom navigation works natively on mobile
- Trip creation flows smoothly via bottom sheet (Vaul)
- Activity reordering works smoothly via touch drag & drop
- Toast feedback provides clear user communication (Sonner)
- New users can onboard without confusion
- All interactions feel mobile-native (not desktop-responsive)
- Core user journey: Sign up → Create trip → View dashboard → Add activity → Reorder activities

### Places Hub Success Metrics
- Reduced navigation confusion (single Places entry point)
- Increased place discovery to itinerary addition conversion
- Faster task completion for "finding things to do"
- Seamless transition from discovery to planning
- Clear distinction between saved and suggested places
- Intuitive map interaction with mobile-friendly controls

### Weekend Goals (Saturday)
- Advanced mobile interactions (swipe navigation, pull-to-refresh)
- Polish drag & drop animations and feedback
- Comprehensive mobile testing on various devices
- Performance optimization and final UX tweaks

---

## Current State Assessment
- **APIs**: ✅ Fully built and functional
- **Components**: ✅ Built but not integrated into mobile-first user flow
- **Mobile Foundation**: ❌ **MISSING - No mobile navigation or layout structure**
- **User Journey**: ❌ **BROKEN - Users cannot create/manage trips**
- **Mobile UX**: ❌ **MISSING - No touch interactions, native patterns, or mobile testing**
- **Places Experience**: ❌ **FRAGMENTED - Multiple disconnected place-related pages**
- **Actual Completion**: ~**55%** (mobile-first requirements significantly impact completion)

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