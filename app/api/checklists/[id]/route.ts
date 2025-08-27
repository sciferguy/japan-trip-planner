// app/api/checklists/[id]/route.ts
import { run, ok, fail } from '@/lib/api/response'
import { getCurrentUser } from '@/lib/auth-helpers'
import { requireTripRole } from '@/lib/authz'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ChecklistCategory } from '@prisma/client'

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  category: z.nativeEnum(ChecklistCategory).optional(),
  completed: z.boolean().optional()
})

// Fix: Replace 'any' with proper type
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

export const PATCH = (req: Request, { params }: { params: Promise<{ id: string }> }) =>
  run(async () => {
    const user = await getCurrentUser()
    const { id } = await params
    const body = await req.json().catch(() => null)

    if (!body) {
      return fail(400, 'BAD_JSON', 'Invalid JSON body')
    }

    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return fail(400, 'VALIDATION', 'Validation failed', {
        fieldErrors: parsed.error.flatten().fieldErrors
      })
    }

    const item = await prisma.checklist_items.findUnique({
      where: { id },
      select: { trip_id: true, user_id: true }
    })

    if (!item) {
      return fail(404, 'NOT_FOUND', 'Checklist item not found')
    }

    await requireTripRole(item.trip_id, user.id, 'EDITOR')

    if (item.user_id !== user.id) {
      return fail(403, 'FORBIDDEN', 'Can only edit your own checklist items')
    }

    const updated = await prisma.checklist_items.update({
      where: { id },
      data: parsed.data
    })

    return ok(mapChecklistItem(updated))
  })

export const DELETE = (req: Request, { params }: { params: Promise<{ id: string }> }) =>
  run(async () => {
    const user = await getCurrentUser()
    const { id } = await params

    const item = await prisma.checklist_items.findUnique({
      where: { id },
      select: { trip_id: true, user_id: true }
    })

    if (!item) {
      return fail(404, 'NOT_FOUND', 'Checklist item not found')
    }

    await requireTripRole(item.trip_id, user.id, 'EDITOR')

    if (item.user_id !== user.id) {
      return fail(403, 'FORBIDDEN', 'Can only delete your own checklist items')
    }

    await prisma.checklist_items.delete({
      where: { id }
    })

    return ok({ deleted: true })
  })