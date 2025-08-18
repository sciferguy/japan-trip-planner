# Japan Trip Planner – Focused 2‑Week MVP Summary

## Objective
Deliver a reliable personal trip assistant usable during the upcoming Japan trip: plan daily schedule, track essentials, record expenses, check weather, and export/backup data. Single user; collaboration and advanced automation deferred.

## In-Scope (MVP)
1. Itinerary (Days & Items)
- One trip seeded (hardcoded metadata).
- Days auto-generated between start/end.
- CRUD itinerary items with start/end times, title, optional place, note, status (planned | done).
- Overlap warning (same day, intersecting time ranges).

2. Places (Light)
- Manual add or paste Google Maps URL → parse name/address (best effort).
- Store: name, address, lat?, lng?, sourceUrl?, category? (light tag).
- Inline edit only.

3. Checklists
- Multiple lists (Packing, Pre‑trip, Tasks).
- Items: label, done flag.
- Reorder optional (can defer).

4. Expenses
- Fields: label, category?, amountOriginal, currencyOriginal.
- FX conversion to JPY (rates fetched once per ≥12h session).
- Store fxRate + computed amountJpy; total summary.

5. Weather
- Daily forecast summary (icon, hi/lo, condition) via OpenWeatherMap.
- Cache per day (DB table) for 6h; stale badge after expiry.

6. Theme & UI Shell
- Light/Dark toggle (system preference on first load, persisted).
- Core design tokens.
- Accessible focus + reduced motion.

7. Print / Export
- `/print` read‑only consolidated view (itinerary, checklists, expense total).
- JSON export & import for backup.

8. Offline Resilience (Light)
- LocalStorage snapshot of core entities + weather.
- On failure, load snapshot with warning banner.

9. Error & Loading UX
- Basic skeletons/spinners.
- Error boundaries per major widget.

10. Minimal Security / Auth
- Single user mode (no full auth). Optional simple passphrase (defer if time tight).

## Out of Scope (Deferred)
Multi-user roles, real-time collab, reminders, document vault, calendar export, advanced budgets, PDF/CSV, route times, mapping enhancements, offline maps, analytics, drag cross-day (optional later).

## Data Model (Prisma Sketch)
- Trip(id, title, startDate, endDate)
- Day(id, tripId, date, note)
- Place(id, name, address, lat?, lng?, sourceUrl?, category?)
- ItineraryItem(id, dayId, placeId?, title, startTime, endTime, note?, status)
- Checklist(id, tripId, title)
- ChecklistItem(id, checklistId, label, done)
- Expense(id, tripId, label, amountOriginal, currencyOriginal, amountJpy, fxRate, category?, date)
- WeatherCache(id, dayId, fetchedAt, json)

(Indexes: foreign keys, date; cascading deletes.)

## Routes / Pages
- `/` Dashboard (today items, weather snippet, checklist progress, expense total, quick add).
- `/itinerary`
- `/itinerary/[date]`
- `/places`
- `/checklists`
- `/checklists/[id]` (or inline)
- `/expenses`
- `/print`
- `/api/*` CRUD + parse + fx + weather endpoints.

## Key Flows
1. Add itinerary item → validate times → overlap check → persist (optimistic).
2. Paste Maps URL → parse → fallback manual edit.
3. Add expense → load/cache FX rates → compute JPY.
4. Load day view → parallel items + weather (cached).
5. Export JSON → all core entities (exclude internal meta).
6. Offline open → snapshot load → warning banner.

## Technical Priorities
- Prisma schema & migrations first.
- Zod validation at API boundaries (uniform error envelope).
- Lightweight route handlers / server actions.
- Caching: DB (weather, fx), memory (request), localStorage snapshot.
- Accessibility: semantic structure, focus-visible, contrast.
- Performance: minimal blocking assets, stable layout, small bundle.

## Acceptance Criteria
- CRUD itinerary items; overlap visibly flagged.
- Weather per day; stale indicator after 6h.
- Places added via paste or manual; graceful parse failure.
- Checklists persist across refresh & offline.
- Expenses convert reliably; total JPY visible.
- Theme toggle stable (no flash).
- Print view legible and omission of interactive controls.
- JSON export/import round-trips without data loss.
- No critical console errors; clear error states.

## Implementation Order
1. Schema + migrations + seed trip/days.
2. Itinerary CRUD + overlap detection.
3. Places + parse endpoint.
4. Checklists CRUD.
5. FX utility + expenses CRUD.
6. Weather fetch + cache.
7. Local snapshot + offline banner.
8. Theme tokens + toggle.
9. Print view + JSON export/import.
10. Hardening (error boundaries, reduced motion, contrast).
11. Final QA with real trip data.

## Time Guards
- Styling polish capped to ≤1 day.
- Refactor only after 3+ duplications.
- Daily scope check; defer creep to backlog.

## Risks & Mitigations
- Time overrun → drop lowest impact (expense categories, place categories, advanced filtering).
- API downtime → cached/stale display.
- Data loss → early export/import verification.

## Post-Trip Backlog
Multi-user auth, reminders, calendar/PDF export, document vault, drag across days, richer maps, analytics, collaboration real-time, offline maps.