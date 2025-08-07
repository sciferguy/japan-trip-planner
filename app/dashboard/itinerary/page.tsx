import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ItineraryPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            🗾 Itinerary Planning
          </h1>
          <p className="text-stone-600 text-zen">
            Plan your daily activities and organize your Japan adventure
          </p>
        </div>
        <Button className="bg-tea-600 hover:bg-tea-700 w-fit">
          Add Activity
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="shadow-zen lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily Itinerary</CardTitle>
            <CardDescription>Drag and drop to reorder your activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-12 text-stone-500">
                <div className="text-4xl mb-4">📅</div>
                <p>No activities planned yet</p>
                <p className="text-sm">Click "Add Activity" to get started</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-zen">
            <CardHeader>
              <CardTitle>Trip Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-stone-600">Duration:</span>
                  <span className="font-medium">Not set</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Activities:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Cities:</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-zen">
            <CardHeader>
              <CardTitle>Popular Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  🗼 Tokyo Skytree
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  ⛩️ Fushimi Inari Shrine
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  🏯 Osaka Castle
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  🌸 Cherry Blossom Viewing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}