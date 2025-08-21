# Task Backlog

## P0 (Critical / Fix Now)[DONE]
1. Unify itinerary item API: deprecate `api/itinerary-items` POST (raw response) in favor of `api/days/[dayId]/itinerary-items` (standard `{ ok: true }` envelope + overlap recomputation).[Done]
2. Implement missing PUT (or migrate UI to PATCH) for `EditActivityForm`; current form calls PUT but only PATCH exists.[Done]
3. Standardize time serialization: always return ISO strings (current duplicate route file has raw Date vs ISO).[Done]
4. Remove duplicate route file variant with differing `mapItem` (ensure single source with `toIso` helper).[Done]
5. Prevent cross‑trip item creation/move in create route (already enforced in update).[Done]
6. Add validation (Zod) to legacy `/api/itinerary-items` or remove it after UI migration.[Done]
7. Ensure client components (`AddActivityForm`, `EditActivityForm`) send `startTime` / `endTime` matching schema (`start_time` vs `startTime` mismatch).[Done]

## P1 (High)[IN PROGRESS]
1. Consolidate duplicated type enums: `types/index.ts` vs Prisma enums vs `types/itinerary.ts`.
2. Generate shared DTO types from Zod schemas to eliminate divergence.
3. Add unit tests for `computeOverlaps` (edge cases: touching intervals, null times, chained overlaps).
4. Add optimistic update + rollback logic in `useDayItinerary` and/or Zustand store.
5. Normalize location handling (creation stub uses placeholder lat/lng 0).
6. Add role/permission integration tests for itinerary endpoints.
7. Add input to clear times (support sending explicit null in PATCH UI).

## P2 (Medium)
1. Pagination or lazy loading for large day item lists.
2. Batch endpoint: move multiple items between days with overlap recompute.
3. Caching layer or ETag for day itinerary GET.
4. Add indexing (DB): `(day_id, start_time)` to optimize sorted queries.
5. Improve overlap algorithm to O(n log n) sweep if future constraints grow (current O(n^2) worst when many active intervals).
6. Refactor store: derive `overlap` badge styling centrally.

## P3 (Future / Nice to Have)
1. Real‑time sync (WebSocket / SSE) broadcasting day updates.
2. Bulk operations (multi‑select delete, move).
3. Advanced conflict resolution (detect concurrent edits on same item).
4. Timeline / Gantt style visualization.
5. Calendar export (iCal) for dated items.

## P4 (Housekeeping)
1. Add ESLint rule to forbid direct Date serialization leakage.
2. Adopt consistent naming: `createdAt` / `created_at` mapping utility.
3. Storybook stories for itinerary cards & forms.
4. Monitoring & structured logging for API errors.

## Migration Plan (API Unification)
1. Update forms to call POST `/api/days/{dayId}/itinerary-items` with `{ title, type, startTime, ... }`.
2. Remove legacy `/api/itinerary-items` route.
3. Adjust `AddActivityForm` & `EditActivityForm` to use hook / store flows.
4. Delete duplicate `app/api/days/[dayId]/itinerary-items/route.ts` version keeping ISO output.

## Testing Targets
1. `computeOverlaps`: null boundaries, identical intervals, cascade chains, non-overlapping adjacency.
2. Authorization: VIEWER cannot POST/PATCH/DELETE.
3. Validation: endTime before startTime rejected.
4. Cross‑trip move attempt rejected (PATCH dayId).

## Open Questions
1. Should items without both times ever mark overlap? (Currently always false.) Yes if either time is missing.
2. Do we need soft delete for audit/history? (Soft delete would allow restoring items, but complicates queries and storage.)
3. Should day boundary enforce containment of start/end? (Yes, to prevent items spanning days.) Need to figure out how to handle if something is at 1am or goes through 1am so it doesnt show as next day items or activities.
4. Should we allow items without times to be created? (Yes, and the user should be allowed to put it in the timeline between, before or after other items.)
5. Should we allow items without times to be moved? (Yes they should.)
6. Should we allow items without times to be deleted? (Yes, they should be allowed)
7. Should we allow items without times to be edited? (Yes, they should be allowed)
8. 