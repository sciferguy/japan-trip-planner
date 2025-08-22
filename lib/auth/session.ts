// lib/auth/session.ts
import { auth } from '@/lib/auth'
import { getSessionUser } from '@/lib/authz'

export async function getServerSession() {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  return {
    user: await getSessionUser(session.user.id),
    session
  }
}

export async function requireServerSession() {
  const result = await getServerSession()
  if (!result) {
    throw new Error('Authentication required')
  }
  return result
}