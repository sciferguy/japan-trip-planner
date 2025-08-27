'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePlaces } from '@/hooks/usePlaces'
import { Loader2, Plus } from 'lucide-react'
import { QuickPlaceForm } from '@/components/trips/QuickPlaceForm'

type BasicPlace = {
  id: string
  name: string
  trip_id: string
  address?: string | null
  category?: string | null
  lat?: number | null
  lng?: number | null
  source_url?: string | null
}

interface PlaceSelectorProps {
  activeTripId: string
  value?: BasicPlace | null
  onChange?: (place: BasicPlace | null) => void
  onCrossTripSelect?: (place: BasicPlace) => void
  placeholder?: string
}

export default function PlaceSelector(props: PlaceSelectorProps) {
  const { activeTripId, value, onChange, onCrossTripSelect, placeholder = 'Search places' } = props

  const { createPlace } = usePlaces()
  const [query, setQuery] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [results, setResults] = useState<{ thisTrip: BasicPlace[]; otherTrips: BasicPlace[] }>({
    thisTrip: [],
    otherTrips: [],
  })
  const [showQuickForm, setShowQuickForm] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!query.trim()) {
      setResults({ thisTrip: [], otherTrips: [] })
      return
    }
    setLoading(true)
    fetch(
      `/api/places/search?q=${encodeURIComponent(query)}&tripId=${encodeURIComponent(
        activeTripId
      )}&group=1`
    )
      .then(async (res) => {
        const payload = await res.json().catch(() => null)
        if (cancelled) return
        if (res.ok && payload?.ok) {
          setResults(payload.data || { thisTrip: [], otherTrips: [] })
        } else {
          setResults({ thisTrip: [], otherTrips: [] })
        }
      })
      .catch(() => {
        if (!cancelled) setResults({ thisTrip: [], otherTrips: [] })
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [query, activeTripId])

  const handleSelect = (p: BasicPlace) => {
    if (p.trip_id !== activeTripId) {
      onCrossTripSelect?.(p)
      return
    }
    onChange?.(p)
  }

  const handleQuickPlaceSubmit = async (data: any) => {
    const newPlace = await createPlace({
      name: data.name,
      address: data.address,
      category: data.category,
      lat: data.lat,
      lng: data.lng,
    })
    if (newPlace) {
      onChange?.({
        id: newPlace.id,
        name: newPlace.name,
        trip_id: newPlace.trip_id,
        address: newPlace.address ?? null,
        category: newPlace.category ?? null,
        lat: newPlace.lat ?? null,
        lng: newPlace.lng ?? null,
        source_url: newPlace.source_url ?? null,
      })
      setQuery(newPlace.name || '')
    }
    setShowQuickForm(false)
  }

  const handleClear = () => {
    onChange?.(null)
    setQuery('')
  }

  return (
    <>
      <div className="space-y-2">
        {value ? (
          <div className="flex items-center justify-between rounded-md border p-2">
            <div className="min-w-0">
              <div className="font-medium truncate">{value.name}</div>
              <div className="text-xs text-muted-foreground">Trip: {value.trip_id}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
        ) : null}

        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
          />
          <Button type="button" variant="outline" onClick={() => setShowQuickForm(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        <div className="rounded-md border p-2">
          {loading && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Searching…
            </div>
          )}

          {!loading && query.trim().length > 0 && results.thisTrip.length === 0 && results.otherTrips.length === 0 && (
            <div className="text-xs text-muted-foreground">No results</div>
          )}

          {results.thisTrip.length > 0 && (
            <div className="mb-2">
              <div className="text-xs text-muted-foreground mb-1">This Trip</div>
              <ul className="space-y-1">
                {results.thisTrip.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-accent"
                      onClick={() => handleSelect(p)}
                    >
                      <div className="font-medium">{p.name}</div>
                      {p.address ? (
                        <div className="text-xs text-muted-foreground truncate">{p.address}</div>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.otherTrips.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">Other Trips</div>
              <ul className="space-y-1">
                {results.otherTrips.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-accent"
                      onClick={() => handleSelect(p)}
                    >
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">Trip: {p.trip_id}</div>
                      {p.address ? (
                        <div className="text-xs text-muted-foreground truncate">{p.address}</div>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

     <Dialog open={showQuickForm} onOpenChange={setShowQuickForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Place</DialogTitle>
          </DialogHeader>
          <QuickPlaceForm onSubmit={handleQuickPlaceSubmit} onCancel={() => setShowQuickForm(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

