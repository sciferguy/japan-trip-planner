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
    const result = await parseGoogleMapsUrl(url)

    return ok(result)
  })

async function parseGoogleMapsUrl(url: string) {
  try {
    const urlObj = new URL(url)

    let lat: number | undefined
    let lng: number | undefined
    let name: string | undefined
    let address: string | undefined

    // Try to extract from URL
    const placeMatch = url.match(/\/maps\/place\/([^/]+)\/@([-\d.]+),([-\d.]+)/)
    if (placeMatch) {
      name = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
      lat = parseFloat(placeMatch[2])
      lng = parseFloat(placeMatch[3])
    }

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

    if (!lat || !lng) {
      const coordMatch = url.match(/@([-\d.]+),([-\d.]+)/)
      if (coordMatch) {
        lat = parseFloat(coordMatch[1])
        lng = parseFloat(coordMatch[2])
      }
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    // If we have coordinates, fetch address from Geocoding API
    if (lat && lng && !address && apiKey) {
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      )
      const geoData = await geoRes.json()
      if (geoData.results && geoData.results[0]) {
        address = geoData.results[0].formatted_address
      }
    }

    // If only name, use Places API to get place_id, then details
    if ((!lat || !lng) && name && apiKey) {
      // 1. Autocomplete to get place_id
      const autoRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(name)}&key=${apiKey}&language=en`
      )
      const autoData = await autoRes.json()
      const prediction = autoData.predictions?.[0]
      if (prediction?.place_id) {
        // 2. Details to get full info
        const detailsRes = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&key=${apiKey}&language=en`
        )
        const detailsData = await detailsRes.json()
        const result = detailsData.result
        if (result) {
          name = result.name || name
          address = result.formatted_address || address
          lat = result.geometry?.location?.lat
          lng = result.geometry?.location?.lng
        }
      }
    }

    // Fallback: Geocode by name if still missing
    if ((!lat || !lng) && name && apiKey && !address) {
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(name)}&key=${apiKey}`
      )
      const geoData = await geoRes.json()
      if (geoData.results && geoData.results[0]) {
        address = geoData.results[0].formatted_address
        lat = geoData.results[0].geometry.location.lat
        lng = geoData.results[0].geometry.location.lng
      }
    }

    return {
      name: name || '',
      address: address || '',
      lat: lat || null,
      lng: lng || null,
      source_url: url,
      parsed: !!(lat && lng && name)
    }
  } catch (error) {
    return {
      name: '',
      address: '',
      lat: null,
      lng: null,
      source_url: url,
      parsed: false,
      error: 'Failed to parse URL'
    }
  }
}