import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function MapPage() {
  // Mock map data
  const locations = [
    { id: 1, name: "Tokyo Skytree", type: "ATTRACTION", lat: 35.7101, lng: 139.8107, pinType: "🗼", added: true },
    { id: 2, name: "Sensoji Temple", type: "ATTRACTION", lat: 35.7148, lng: 139.7967, pinType: "⛩️", added: true },
    { id: 3, name: "Shibuya Crossing", type: "ATTRACTION", lat: 35.6598, lng: 139.7006, pinType: "🏙️", added: true },
    { id: 4, name: "Park Hotel Tokyo", type: "HOTEL", lat: 35.6762, lng: 139.7678, pinType: "🏨", added: true },
    { id: 5, name: "Tsukiji Outer Market", type: "RESTAURANT", lat: 35.6654, lng: 139.7706, pinType: "🍽️", added: false },
    { id: 6, name: "Harajuku Station", type: "TRAIN_STATION", lat: 35.6702, lng: 139.7026, pinType: "🚅", added: false },
  ]

  const routes = [
    { id: 1, name: "Day 1: Airport to Hotel", distance: "68 km", duration: "1h 15m", status: "planned" },
    { id: 2, name: "Day 2: Temple Hopping", distance: "12 km", duration: "45m", status: "active" },
    { id: 3, name: "Day 3: Shopping Districts", distance: "8 km", duration: "30m", status: "completed" },
  ]

  const getPinTypeColor = (type: string) => {
    switch (type) {
      case 'ATTRACTION': return 'bg-green-100 text-green-800 border-green-200'
      case 'HOTEL': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'RESTAURANT': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'TRAIN_STATION': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-stone-100 text-stone-800 border-stone-200'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            Interactive Map
          </h1>
          <p className="text-stone-600 text-zen">
            Explore Japan with interactive maps and route planning
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

      {/* Map Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-stone-800">Saved Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-tea-600">{locations.filter(l => l.added).length}</div>
            <div className="text-sm text-stone-500">On your map</div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-stone-800">Planned Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bamboo-600">{routes.length}</div>
            <div className="text-sm text-stone-500">Route optimizations</div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-stone-800">Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sakura-600">88 km</div>
            <div className="text-sm text-stone-500">Trip coverage</div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-stone-800">Travel Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-600">2h 30m</div>
            <div className="text-sm text-stone-500">Total transit</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Map Placeholder */}
        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle>Interactive Map View</CardTitle>
            <CardDescription>
              Mapbox GL JS with custom Japanese styling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gradient-to-br from-tea-100 via-bamboo-100 to-sakura-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Map Placeholder */}
              <div className="absolute inset-4 bg-white/50 rounded-lg border-2 border-dashed border-stone-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🗾</div>
                  <div className="text-lg font-semibold text-stone-700 mb-1">Interactive Map</div>
                  <div className="text-sm text-stone-500">MapBox integration coming soon</div>
                </div>
              </div>
              
              {/* Mock pins */}
              <div className="absolute top-8 left-12 text-2xl animate-bounce">🗼</div>
              <div className="absolute bottom-16 right-8 text-2xl animate-pulse">⛩️</div>
              <div className="absolute top-1/2 left-8 text-2xl animate-bounce delay-300">🏨</div>
              <div className="absolute top-1/3 right-1/3 text-2xl animate-pulse delay-500">🏙️</div>
            </div>
          </CardContent>
        </Card>

        {/* Locations List */}
        <div className="space-y-6">
          <Card className="shadow-zen">
            <CardHeader>
              <CardTitle>Your Locations</CardTitle>
              <CardDescription>Saved places on your Japan trip</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {locations.map((location) => (
                  <div key={location.id} className="flex items-center justify-between p-3 border border-stone-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{location.pinType}</span>
                      <div>
                        <div className="font-medium text-stone-800">{location.name}</div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPinTypeColor(location.type)}>
                            {location.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-stone-500">
                            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {location.added ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Added
                        </Badge>
                      ) : (
                        <Button variant="outline" size="sm">Add</Button>
                      )}
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-zen">
            <CardHeader>
              <CardTitle>Route Planning</CardTitle>
              <CardDescription>Optimized travel routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {routes.map((route) => (
                  <div key={route.id} className="flex items-center justify-between p-3 border border-stone-200 rounded-lg">
                    <div>
                      <div className="font-medium text-stone-800">{route.name}</div>
                      <div className="text-sm text-stone-600">
                        {route.distance} • {route.duration}
                      </div>
                    </div>
                    <Badge className={
                      route.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                      route.status === 'active' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-stone-100 text-stone-800 border-stone-200'
                    }>
                      {route.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map Features */}
      <Card className="shadow-zen">
        <CardHeader>
          <CardTitle>Map Features</CardTitle>
          <CardDescription>Planned interactive mapping capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🗾", title: "Custom Pins", desc: "Categorized location markers" },
              { icon: "🛣️", title: "Route Planning", desc: "Optimized travel paths" },
              { icon: "📱", title: "Offline Maps", desc: "Download for offline use" },
              { icon: "📍", title: "Google Places", desc: "Rich location data" },
              { icon: "🚅", title: "Transit Info", desc: "Public transport routes" },
              { icon: "📷", title: "Street View", desc: "360° location preview" },
              { icon: "⏱️", title: "Real-time", desc: "Live traffic & updates" },
              { icon: "🔄", title: "Sync", desc: "Cross-device synchronization" }
            ].map((feature, index) => (
              <div key={index} className="text-center p-4 bg-stone-50 rounded-lg">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <div className="font-medium text-stone-800 text-sm mb-1">{feature.title}</div>
                <div className="text-xs text-stone-500">{feature.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}