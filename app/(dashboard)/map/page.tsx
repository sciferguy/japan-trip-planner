import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function MapPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            Interactive Map
          </h1>
          <p className="text-stone-600 text-zen">
            Explore Japan with hybrid Mapbox & Google Maps integration
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Search Places
          </Button>
          <Button className="bg-tea-600 hover:bg-tea-700">
            Add Location
          </Button>
        </div>
      </div>

      <Card className="shadow-zen">
        <CardHeader>
          <CardTitle>🗺️ Hybrid Map Experience</CardTitle>
          <CardDescription>
            Mapbox GL JS with custom Japanese styling + Google Maps APIs for comprehensive data
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <div className="space-y-4">
            <div className="text-6xl opacity-50">🗾</div>
            <h3 className="text-xl font-semibold text-stone-800">Coming Soon</h3>
            <p className="text-stone-600 max-w-md mx-auto">
              Interactive maps with custom Japanese-inspired styling, 
              Google Places integration, route planning, and offline tile caching.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <div className="text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                Mapbox GL JS
              </div>
              <div className="text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                Google Places
              </div>
              <div className="text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                Route Planning
              </div>
              <div className="text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                Offline Support
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}