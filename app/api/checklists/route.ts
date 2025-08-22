// app/api/checklists/route.ts
import { run, ok, fail } from '@/lib/api/response'
import { getCurrentUser } from '@/lib/auth-helpers'
import { requireTripRole } from '@/lib/authz'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ChecklistCategory } from '@prisma/client'

const createSchema = z.object({
  tripId: z.string().min(1, 'tripId required'),
  title: z.string().min(1, 'title required').max(200),
  category: z.nativeEnum(ChecklistCategory),
  completed: z.boolean().optional()
})

interface ChecklistItemDB {
  id: string
  trip_id: string
  user_id: string
  title: string
  category: ChecklistCategory
  completed: boolean
  created_at: Date
}

function mapChecklistItem(db: ChecklistItemDB) {
  return {
    id: db.id,
    tripId: db.trip_id,
    userId: db.user_id,
    title: db.title,
    category: db.category,
    completed: db.completed,
    createdAt: db.created_at
  }
}

export const GET = (req: Request) =>
  run(async () => {
    const user = await getCurrentUser()
    const { searchParams } = new URL(req.url)
    const tripId = searchParams.get('tripId')

    if (!tripId) {
      return fail(400, 'BAD_REQUEST', 'tripId query param required')
    }

    await requireTripRole(user.id, tripId, 'VIEWER')

    const items = await prisma.checklist_items.findMany({
      where: { trip_id: tripId, user_id: user.id },
      orderBy: { created_at: 'asc' }
    })

    return ok(items.map(mapChecklistItem))
  })

export const POST = (req: Request) =>
  run(async () => {
    const user = await getCurrentUser()
    const body = await req.json().catch(() => null)

    if (!body) {
      return fail(400, 'BAD_JSON', 'Invalid JSON body')
    }

    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return fail(400, 'VALIDATION', 'Validation failed', {
        fieldErrors: parsed.error.flatten().fieldErrors
      })
    }

    const { tripId, title, category, completed } = parsed.data
    await requireTripRole(user.id, tripId, 'EDITOR')

    const created = await prisma.checklist_items.create({
      data: {
        id: crypto.randomUUID(),
        trip_id: tripId,
        user_id: user.id,
        title,
        category,
        completed: completed ?? false
      }
    })

    return ok(mapChecklistItem(created), { status: 201 })
  })