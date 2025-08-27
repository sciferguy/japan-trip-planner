import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const input = searchParams.get('input')
  const components = searchParams.get('components') || ''

  if (!input) {
    return NextResponse.json({ error: 'Input required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&components=${components}&key=${process.env.GOOGLE_PLACES_API_KEY}`
    )

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 })
  }
}