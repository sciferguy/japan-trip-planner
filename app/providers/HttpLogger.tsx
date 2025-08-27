"use client"

import { useEffect } from 'react'

function instrumentFetch() {
  const k = '__fetch_instrumented__'
  if ((globalThis as any)[k]) return
  const orig = globalThis.fetch
  ;(globalThis as any)[k] = true
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const start = performance.now()
    try {
      const res = await orig(input, init)
      const dur = Math.round(performance.now() - start)
      if (!res.ok) {
        let body = ''
        try {
          body = await res.clone().text()
        } catch {}
        console.error('[HTTP]', res.status, res.statusText, String(input), {
          method: init?.method ?? 'GET',
          durMs: dur,
          bodyPreview: body.slice(0, 500)
        })
      }
      return res
    } catch (e: any) {
      const dur = Math.round(performance.now() - start)
      console.error('[HTTP_ERR]', String(input), {
        method: init?.method ?? 'GET',
        durMs: dur,
        error: e?.message || e
      })
      throw e
    }
  }
}

export default function HttpLogger() {
  useEffect(() => {
    instrumentFetch()
  }, [])
  return null
}
