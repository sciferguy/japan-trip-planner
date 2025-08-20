# Japan Trip Planner – Multi‑User MVP Summary (Revised)

## Objective
Deliver a focused multi‑user trip planning tool suitable for coordinating a single Japan trip among invited participants: plan itinerary by day, manage places, checklists, expenses (with FX conversion), daily weather, print/export, and remain usable offline in a degraded mode. Collaboration is asynchronous (no real‑time cursors), with role‑based access (OWNER / EDITOR / VIEWER).

## In‑Scope (MVP)
1. Authentication & Authorization
    - NextAuth session (email / password now; OAuth later).
    - Trip membership model with roles.
    - Access control on all trip‑scoped resources.
2. Trips (single active trip UI; multiple supported in schema)
    - OWNER can invite/add members (manual add form; no email send).
3. Days
    - Auto‑generate inclusive range [startDate, endDate] on trip creation.
4. Itinerary
    - CRUD itinerary items (title, start/end times, optional place, note, status planned|done).
    - Overlap detection (same day, intersecting time range) → visual warning.
5. Places (Light)
    - CRUD.
    - Parse pasted Google Maps URL (best‑effort extract: name, address, lat/lng).
6. Checklists
    - Multiple lists; items with label + done.
7. Expenses
    - CRUD with (label, category?, amountOriginal, currencyOriginal, fxRate, amountJpy, date).
    - FX rates cached ≥12h (per base currency set needed).
8. Weather
    - Daily forecast summary (hi/lo, condition icon).
    - Cached per Day (DB) with 6h staleness flag.
9. Export / Import
    - JSON export of a trip (OWNER only).
    - JSON import (upsert entities; preserve IDs if free; reject foreign trip mixing).
10. Print View
    - Consolidated read‑only `/print` (itinerary by day, checklist status, expense totals).
11. Offline Snapshot
    - LocalStorage snapshot per `userId:tripId`.
    - Fallback load with warning if API fails.
12. Theming & Accessibility
    - Light/Dark with system preference initial.
    - Focus visible, reduced motion respect.
13. Error & Loading UX
    - Skeletons for itinerary / checklists / expenses.
    - Error boundaries per major module.
14. Audit & Logging (Light)
    - `createdAt`, `createdByUserId` attribution.
    - No verbose server logs beyond errors in production.

## Out of Scope (Deferred)
- Real‑time presence / live sync.
- Push notifications / reminders.
- Calendar export, PDF/CSV.
- Advanced budgeting, per‑user checklist states.
- Drag between days.
- Route optimization / transit times.
- Rich mapping (cluster, directions).
- File/document vault.
- Mobile app packaging.
- Analytics / usage metrics.

## Current Status Snapshot (Aug 2025)
- Auth shell present (needs role enforcement): Partial
- Layout / theming core: Done (polish pending)
- Prisma schema (multi‑user partially present, membership & attribution incomplete): In progress
- Itinerary backend CRUD: Missing
- Overlap detection logic: Missing
- Places parse endpoint: Missing
- Checklists API: Basic (extend for auth + validation)
- Expenses + FX: Missing
- Weather model & API: Missing
- Export / import: Missing
- Print view: Missing
- Offline snapshot: Missing
- Validation (Zod) + unified error envelope: Missing
- Authorization guards (TripMember): Missing
- Error boundaries & skeleton states: Partial
- Accessibility pass: Minimal

## Data Model (Target Prisma Entities)
- User(id, name?, email, image?)
- Trip(id, title, startDate, endDate, ownerId)
- TripMember(id, tripId, userId, role[OWNER|EDITOR|VIEWER], joinedAt)
- Day(id, tripId, date, note?)
- Place(id, tripId, name, address?, lat?, lng?, sourceUrl?, category?, createdByUserId, createdAt)
- ItineraryItem(id, dayId, placeId?, title, startTime, endTime, note?, status, createdByUserId)
- Checklist(id, tripId, title)
- ChecklistItem(id, checklistId, label, done)
- Expense(id, tripId, label, amountOriginal, currencyOriginal, fxRate, amountJpy, category?, date, createdByUserId)
- WeatherCache(id, dayId(unique), fetchedAt, json)

Indexes: (tripId,date) on Day; (dayId,startTime) on ItineraryItem; (tripId,date) on Expense; (tripId) on Place / Checklist / Expense; unique (tripId,userId) on TripMember.

## Authorization Rules
- Session required for all `/api/*` except auth endpoints.
- Resource access always constrained by membership.
- OWNER: manage trip, members, import/export, delete anything.
- EDITOR: CRUD core entities (cannot delete trip / manage members).
- VIEWER: read‑only.
- Defensive cross‑trip validation (e.g., dayId must belong to trip of itinerary item).

## Validation & Error Envelope
- Zod schemas per entity in `lib/validation/*`.
- Standard response shape: `{ ok: boolean, data?: T, error?: { code, message, fieldErrors? } }`.
- 400: validation; 401: unauth; 403: forbidden; 404: not found; 409: conflict (overlap or unique); 500: generic.

## Routes / Pages (App Router)
Implemented layout pattern uses `/dashboard/*`.
Target mapping:
- `/dashboard` Overview (today + weather snippet + checklist + expense summary)
- `/dashboard/itinerary` (multi-day overview)
- `/dashboard/itinerary/[date]`
- `/dashboard/places`
- `/dashboard/checklists`
- `/dashboard/expenses`
- `/dashboard/print`
  Auth pages under `(auth)` retained.

## API Endpoints (Planned)
- `/api/trips` (GET list, POST create)
- `/api/trips/[tripId]` (GET, PATCH, DELETE OWNER)
- `/api/trips/[tripId]/members` (GET, POST OWNER, PATCH role OWNER, DELETE OWNER)
- `/api/days/[dayId]/itinerary-items` (POST)
- `/api/itinerary-items/[id]` (PATCH, DELETE)
- `/api/places` (CRUD scoped by trip query param)
- `/api/places/parse` (POST { url })
- `/api/checklists` (CRUD)
- `/api/checklist-items` (POST/PATCH/DELETE)
- `/api/expenses` (CRUD)
- `/api/fx` (GET rates summary)
- `/api/weather/[dayId]` (GET)
- `/api/export/[tripId]` (GET OWNER)
- `/api/import/[tripId]` (POST OWNER)

## Key Flows
1. Create itinerary item → validate → overlap check → persist → optimistic UI.
2. Paste place URL → parse → prefill form → user confirms.
3. Add expense → fetch/cached FX → compute amountJpy server side → return updated totals.
4. View day itinerary → parallel fetch (items + weather) → mark weather stale if >6h.
5. Export trip → OWNER triggers download JSON.
6. Import trip data (same trip) → validate IDs & ownership → atomic upsert.
7. Offline open → API fail → load snapshot → banner indicates degraded mode.

## Caching Layers
- DB: WeatherCache, stored FX rates (optionally as Expense.fxRate per item).
- Memory (per request): FX rate map.
- LocalStorage: snapshot `{ version, trip, days, places, itineraryItems, checklists(+items), expenses, weather }`.
- Staleness thresholds: FX 12h; Weather 6h.

## Overlap Detection
- Query items for day ordered by startTime.
- Linear scan; if `current.startTime < previous.endTime` → flag both.
- Return `overlapGroupId` or simple boolean for each item.

## Offline Strategy
- After successful fetch sets, serialize snapshot.
- On boot: attempt live load; if network / 5xx → fallback snapshot + banner.
- Mutations blocked (or queued future) while offline (MVP: block with notice).

## Print View
- Route `/dashboard/print`.
- CSS: hide buttons/interactive, page-break before each day, summary totals at end.
- Trigger print via window.print() button.

## Security & Privacy
- Never return other users outside membership list minimal fields (name, image, email only to OWNER).
- Prevent ID enumeration by always scoping with membership filter.
- Hash passwords (already in auth flow).
- Rate-limit auth endpoints (post-MVP optional).

## Acceptance Criteria
- Role‑based access enforced (manual test with different users).
- CRUD itinerary with visible overlap warnings.
- Places parse success for typical Google Maps share links; graceful failure path.
- FX conversion stable; JPY totals accurate (rounding 2 decimals).
- Weather cache refresh on staleness.
- Export/import round‑trip preserves entity relations.
- Print view legible; no interactive controls.
- Offline snapshot loads with banner when backend unreachable.
- No PII leakage across trips.
- Lighthouse a11y score ≥90 (manual focus check).

## Implementation Sequence (Revised)
1. Finalize Prisma schema (add TripMember + attribution + WeatherCache + Expense fields).
2. Migration + seed (users, one trip, memberships, days).
3. Auth / authorization helpers (`getSessionUser`, `requireTripRole`).
4. Zod validation layer & error envelope utility.
5. Itinerary CRUD + overlap detection + frontend integration.
6. Places CRUD + parse endpoint + UI.
7. Checklists solidify (API + UI updates with auth).
8. FX service + expenses CRUD + totals.
9. Weather fetch/cache + day view integration.
10. Export / import endpoints + client triggers.
11. Offline snapshot service + banner.
12. Print view route & styling.
13. Error boundaries + skeletons + a11y polish.
14. Final QA / data export rehearsal.

## Risk & Mitigations
- Scope creep → locked backlog; additions require explicit defer decision.
- FX / Weather API downtime → stale data display with badge.
- Over‑engineering auth → minimal role checks only.
- Data inconsistency on import → strict schema validation; transaction wrap.
- Offline stale data confusion → clear timestamp + banner.

## Post‑MVP Backlog
Real‑time updates, drag between days, calendar export, PDF/CSV, richer mapping (routes, transit time), per‑user checklist states, document vault, reminders, analytics, mobile packaging.

---
Generated: Revision aligning original single‑user spec to current multi‑user architecture and repo structure.