// lib/api/response.ts
import { NextResponse } from 'next/server'
import { ApiError } from '@/lib/authz'

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, { status: init?.status ?? 200 })
}

export function fail(status: number, code: string, message: string, extra?: any) {
  return NextResponse.json(
    { ok: false, error: { code, message, ...extra } },
    { status }
  )
}

export async function run(handler: () => Promise<Response>) {
  try {
    return await handler()
  } catch (e: any) {
    if (e instanceof ApiError) {
      return fail(e.status, e.code, e.message)
    }
    console.error('Unhandled API error', e)
    return fail(500, 'INTERNAL', 'Internal server error')
  }
}