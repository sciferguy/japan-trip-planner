import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function MapPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            🗺️ Interactive Map
          </h1>
          <p className="text-stone-600 text-zen">
            Visualize your Japan destinations and plan your routes
          </p>
        </div>
        <Button className="bg-tea-600 hover:bg-tea-700 w-fit">
          Add Location
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="shadow-zen">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-tea-100 to-bamboo-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-stone-600">
                  <div className="text-6xl mb-4">🗾</div>
                  <h3 className="text-xl font-semibold mb-2">Interactive Map Coming Soon</h3>
                  <p className="text-sm">MapBox integration will display your Japan locations here</p>
                  <div className="mt-4 space-y-2 text-xs">
                    <p>🏙️ Tokyo • ⛩️ Kyoto • 🏯 Osaka</p>
                    <p>🗻 Mount Fuji • 🦌 Nara • 🌸 Yoshino</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-zen">
            <CardHeader>
              <CardTitle className="text-lg">Map Layers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">🏨 Hotels</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">🍱 Restaurants</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">⛩️ Attractions</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">🚃 Train Stations</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">🛍️ Shopping</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-zen">
            <CardHeader>
              <CardTitle className="text-lg">Saved Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-stone-500">
                <div className="text-3xl mb-3">📍</div>
                <p className="text-sm">No locations saved</p>
                <p className="text-xs">Add pins to see them here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-zen">
            <CardHeader>
              <CardTitle className="text-lg">Quick Add</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  🏙️ Tokyo Station
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  ⛩️ Senso-ji Temple
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  🗼 Tokyo Skytree
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  🌸 Ueno Park
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-zen">
        <CardHeader>
          <CardTitle>Map Features</CardTitle>
          <CardDescription>What you can do with the interactive map</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📍</div>
              <h4 className="font-medium mb-1">Custom Pins</h4>
              <p className="text-sm text-stone-600">Add and categorize your destinations with custom markers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🛣️</div>
              <h4 className="font-medium mb-1">Route Planning</h4>
              <p className="text-sm text-stone-600">Plan efficient routes between your destinations</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📱</div>
              <h4 className="font-medium mb-1">Offline Access</h4>
              <p className="text-sm text-stone-600">Download maps for offline use while traveling</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}