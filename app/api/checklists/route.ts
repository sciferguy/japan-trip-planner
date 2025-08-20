// app/api/checklists/route.ts
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ChecklistCategory } from '@prisma/client'
import { run, ok, fail } from '@/lib/api/response'
import { requireMembership } from '@/lib/authz'

const createSchema = z.object({
  tripId: z.string().min(1, 'tripId required'),
  title: z.string().min(1, 'title required').max(200),
  category: z.nativeEnum(ChecklistCategory),
  completed: z.boolean().optional()
})

function mapChecklistItem(db: any) {
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

export const GET = async (req: Request) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) {
      return fail(401, 'UNAUTH', 'Unauthorized')
    }

    const { searchParams } = new URL(req.url)
    const tripId = searchParams.get('tripId')
    if (!tripId) {
      return fail(400, 'BAD_REQUEST', 'tripId query param required')
    }

    await requireMembership(tripId, session.user.id)

    // For now we scope to items created by the requesting user (per existing model)
    const items = await prisma.checklist_items.findMany({
      where: { trip_id: tripId, user_id: session.user.id },
      orderBy: { created_at: 'asc' }
    })

    return ok(items.map(mapChecklistItem))
  })

export const POST = async (req: Request) =>
  run(async () => {
    const session = await auth()
    if (!session?.user?.id) {
      return fail(401, 'UNAUTH', 'Unauthorized')
    }

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
    await requireMembership(tripId, session.user.id)

    const created = await prisma.checklist_items.create({
      data: {
        id: crypto.randomUUID(),
        trip_id: tripId,
        user_id: session.user.id,
        title,
        category,
        completed: completed ?? false
      }
    })

    return ok(mapChecklistItem(created), { status: 201 })
  })