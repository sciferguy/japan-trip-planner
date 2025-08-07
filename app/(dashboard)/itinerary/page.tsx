import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ItineraryPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            Itinerary
          </h1>
          <p className="text-stone-600 text-zen">
            Plan your daily activities with drag-and-drop scheduling
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Daily View
          </Button>
          <Button className="bg-tea-600 hover:bg-tea-700">
            Add Activity
          </Button>
        </div>
      </div>

      <Card className="shadow-zen">
        <CardHeader>
          <CardTitle>🗓️ Itinerary Management</CardTitle>
          <CardDescription>
            Advanced itinerary planning with timeline views and conflict detection
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <div className="space-y-4">
            <div className="text-6xl opacity-50">📅</div>
            <h3 className="text-xl font-semibold text-stone-800">Coming Soon</h3>
            <p className="text-stone-600 max-w-md mx-auto">
              Interactive itinerary builder with drag-and-drop functionality, 
              time-based scheduling, and real-time collaboration features.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <div className="text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                Daily & Timeline Views
              </div>
              <div className="text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                Drag-and-Drop
              </div>
              <div className="text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                Conflict Detection
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}