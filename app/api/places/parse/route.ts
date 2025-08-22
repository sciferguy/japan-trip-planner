// app/api/places/parse/route.ts
import { run, ok, fail } from '@/lib/api/response'
import { parseGoogleUrlSchema } from '@/lib/validation/places'

export const POST = (req: Request) =>
  run(async () => {
    const body = await req.json().catch(() => null)
    if (!body) return fail(400, 'BAD_JSON', 'Invalid JSON')

    const parsed = parseGoogleUrlSchema.safeParse(body)
    if (!parsed.success) {
      return fail(400, 'VALIDATION', 'Validation failed', {
        fieldErrors: parsed.error.flatten().fieldErrors
      })
    }

    const { url } = parsed.data
    const result = parseGoogleMapsUrl(url)

    return ok(result)
  })

function parseGoogleMapsUrl(url: string) {
  try {
    const urlObj = new URL(url)

    // Handle different Google Maps URL formats
    let lat: number | undefined
    let lng: number | undefined
    let name: string | undefined
    let address: string | undefined

    // Format 1: /maps/place/Name/@lat,lng,zoom
    const placeMatch = url.match(/\/maps\/place\/([^/]+)\/@([-\d.]+),([-\d.]+)/)
    if (placeMatch) {
      name = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
      lat = parseFloat(placeMatch[2])
      lng = parseFloat(placeMatch[3])
    }

    // Format 2: ?q=lat,lng or ?q=place+name
    const qParam = urlObj.searchParams.get('q')
    if (qParam) {
      const coordMatch = qParam.match(/^([-\d.]+),([-\d.]+)$/)
      if (coordMatch) {
        lat = parseFloat(coordMatch[1])
        lng = parseFloat(coordMatch[2])
      } else {
        name = name || decodeURIComponent(qParam.replace(/\+/g, ' '))
      }
    }

    // Try to extract coordinates from URL path
    if (!lat || !lng) {
      const coordMatch = url.match(/@([-\d.]+),([-\d.]+)/)
      if (coordMatch) {
        lat = parseFloat(coordMatch[1])
        lng = parseFloat(coordMatch[2])
      }
    }

      return {
          name: name || '',
          address: address || '',
          lat: lat || null,
          lng: lng || null,
          source_url: url, // ✅ Changed from sourceUrl to source_url
          parsed: !!(lat && lng && name)
      }
  } catch (error) {
      return {
          name: '',
          address: '',
          lat: null,
          lng: null,
          source_url: url, // ✅ Changed from sourceUrl to source_url
          parsed: false,
          error: 'Failed to parse URL'
      }
  }
}