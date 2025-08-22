// lib/auth-helpers.ts
import { auth } from '@/lib/auth'
import { getSessionUser } from '@/lib/authz'

export async function getCurrentUser() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('No session found')
  }

  return getSessionUser(session.user.id)
}