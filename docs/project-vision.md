# Japan Trip Planner – Comprehensive Project Vision

## Project Vision

Japan Trip Planner is a modern, thoughtfully designed **mobile-first web application** that streamlines the process of planning a trip to Japan, making it comprehensive yet minimal and user-friendly. The core mission is to consolidate all aspects of trip planning—scheduling, logistics, budgeting, navigation, documentation, and collaboration—into a seamless, all-in-one experience.

---

## Minimum Viable Product (MVP) Features

1. **Itinerary Management**
    - Create, edit, and reorder daily schedules and activities.
    - Drag-and-drop events/places between days or time slots.
    - Lock/unlock days or events (e.g., finalized flights) with the ability to unlock for changes as needed.

2. **Places & Notes**
    - Add places manually or paste Google Maps links for automatic extraction of name, address, and map details (Google Maps API + Mapbox UI).
    - Assign categories/tags (e.g., food, shrine, shopping) and status toggles (wishlist, planned, visited) for each place.
    - Filter/search places by category or tag.
    - Per-user ratings and private/shareable notes for each place (no aggregation or photos in MVP).
    - Add notes/recaps per day and per activity/place.

3. **User Roles & Collaboration**
    - Support for multiple user roles: Owner/Admin (full control), Editors (suggest/add/edit), Viewers (read-only).
    - Share itineraries and notes with collaborators.
    - Basic sync model (send/save to update others, not real-time editing).
    - Collaborative planning safeguards (warn on double-booking, prevent overlapping events, lock finalized days/places).

4. **Budgets & Expenses**
    - Set and track trip budgets.
    - Add and categorize expenses (manual entry, JPY and major currencies).
    - Automatic exchange rate conversion using [app.exchangerate-api.com](https://app.exchangerate-api.com/).
    - Export spending reports (CSV, PDF) in future phases.

5. **Reminders & Notifications**
    - Set reminders for key events, bookings, and checklist items.
    - Customizable frequency and timing (before or at event).
    - Receive reminders via in-app notification and email/push (user-selected).
    - Automatic reminders for critical travel actions (e.g., check-in, luggage ship, booking deadlines).

6. **Maps & Navigation**
    - Interactive map view using Google Maps API with Mapbox UI.
    - Save, view, and filter places on the map.
    - Show travel times (walking, train, etc.) between linked places on itinerary/timeline.
    - No offline maps in MVP, but printable/downloadable/email itineraries with embedded maps are supported.

7. **Travel Docs & Info Vault**
    - Encrypted cloud storage for sensitive travel documents (passport scans, confirmations, insurance, etc.).
    - Role-based access controls for viewing sensitive documents.
    - Quick links to provider sites, digital tickets, maps.
    - Tagging/categorization for docs (e.g., "Transport," "Docs," "Tickets").
    - Compliance: Full data deletion support (e.g., GDPR) and 2FA for security.

8. **Checklists & Tasks**
    - Customizable packing lists, pre-trip, and in-trip tasks.
    - Shareable or personal checklists.
    - Reminders for checklist items.
    - Option to assign tasks to users (future phase).

9. **Weather Integration**
    - Real-time weather data for each destination and itinerary day using [openweathermap.org](https://openweathermap.org/).
    - Display weather icon/summary in itinerary and at-a-glance in the UI.
    - Option for weather-based reminders or alerts (future phase).

10. **Integration & Import/Export**
    - Google Maps integration (places, routes, time estimation).
    - Google Calendar integration for itinerary export/sharing.
    - CSV import for initial data migration (addresses, schedule).
    - Export options (CSV, PDF, Google Calendar) for future releases.

11. **Dashboard & Overview**
    - Centralized dashboard showing upcoming events, outstanding tasks, weather, budget status, and quick access to all features.
    - Visual cues for conflicts, missing info, or expiring documents.

---

## Design Principles

- **Mobile-first responsive design** for optimal experience on smartphones and tablets, with expansion to desktop and native app in the future.
- Minimal, distraction-free interface with clear navigation.
- Pastel “sakura” pink and “tea” green color palette, soft shadows, and clean typography.
- Accessibility features to be scoped for public/broad release.

---

## Advanced Features (Future Phases)

- Aggregate/shared place ratings and photo uploads.
- Real-time collaborative editing.
- Additional export formats (PDF, iCal).
- In-app booking APIs.
- Audio/photo notes.
- Advanced analytics (trip reviews, spend breakdowns, etc.).
- Offline mode and mobile app.

---

## Example Workflow (Based on Current Sheets/Notes)

1. Planner creates a trip, sets user roles, and invites collaborators.
2. Add itinerary items day-by-day, pasting in Google Maps links for places.
3. Assign roles for days/events (editor, viewer).
4. Attach notes, reminders, and checklists as needed.
5. Lock finalized plans, but allow unlocking for changes (e.g., flight reschedules).
6. Track expenses and budget, with automatic currency conversion.
7. Store key travel documents securely.
8. Export/print/email the itinerary as needed.
9. Collaborate seamlessly, avoiding double-bookings and confusion, all in one platform.
10. See up-to-date weather for each itinerary location/day.

---

## Key Pain Points Solved

- Everything in one place: itinerary, docs, places, notes, budget, reminders, weather, and currency conversion.
- No more scattered Google Sheets, Docs, places, or email chains.
- Seamless collaboration with clear roles and change management.
- Secure, easy access to all critical info, including sensitive documents.

---

**Integrations at Launch:**
- Google Maps API (with Mapbox UI)
- OpenWeatherMap (weather)
- app.exchangerate-api.com (currency conversion)
- Google Calendar export (MVP or future)
- No booking APIs in MVP

---

**Reference PR:**  
---