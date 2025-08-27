# Database Naming Conventions

## Critical: Model vs Foreign Key Naming
- **Model/Table names**: ALWAYS plural (`trips`, `days`, `places`, `itinerary_items`)
- **Foreign key fields**: ALWAYS singular + `_id` (`trip_id`, `day_id`, `place_id`)

## Examples:
- ✅ `prisma.trips.findMany()` (plural model)
- ✅ `trip_id: "abc123"` (singular foreign key)
- ❌ `prisma.trip.findMany()` (wrong - model is plural)

## Schema Pattern:
```prisma
model trips {
  id    String @id @default(cuid())
  // ... other fields
}

model days {
  id      String @id @default(cuid())
  trip_id String  // Foreign key to trips.id
  trips   trips   @relation(fields: [trip_id], references: [id])
}

## Prisma Field Mapping: snake_case to camelCase

- Database fields use `snake_case` (e\.g\., `start_date`, `end_date`).
- **Prisma automatically maps these to `camelCase` in TypeScript/JavaScript** (e\.g\., `startDate`, `endDate`).
- **Always use `camelCase` in your application code** when accessing Prisma model properties.

### Example

- Database: `start_date`
- Prisma Client: `trip.startDate`

> Do **not** use `@map()` unless you need to override the default mapping.