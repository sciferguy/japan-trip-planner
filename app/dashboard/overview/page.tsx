import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            Dashboard
          </h1>
          <p className="text-stone-600 text-zen">
            Welcome back! Here&apos;s an overview of your Japan trip planning progress.
          </p>
        </div>
        <Button className="bg-tea-600 hover:bg-tea-700 w-fit">
          Create New Trip
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-zen">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Total Trips</CardTitle>
            <span className="text-2xl">🗾</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">3</div>
            <p className="text-xs text-stone-500">2 active, 1 completed</p>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Upcoming Reservations</CardTitle>
            <span className="text-2xl">🎌</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">12</div>
            <p className="text-xs text-stone-500">Next: Hotel check-in in 2 days</p>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Activities Planned</CardTitle>
            <span className="text-2xl">🌸</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">45</div>
            <p className="text-xs text-stone-500">23 must-visit, 22 optional</p>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Budget Status</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">¥425K</div>
            <p className="text-xs text-stone-500">68% of budget used</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to help you plan your trip</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              📅 Add Itinerary Item
            </Button>
            <Button variant="outline" className="w-full justify-start">
              🏨 Make Reservation
            </Button>
            <Button variant="outline" className="w-full justify-start">
              📍 Add Location to Map
            </Button>
            <Button variant="outline" className="w-full justify-start">
              ✅ Update Checklist
            </Button>
          </CardContent>
        </Card>

        {/* Weather Widget */}
        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle>Japan Weather</CardTitle>
            <CardDescription>Current weather in your destinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🏙️</span>
                  <span className="font-medium">Tokyo</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">22°C</div>
                  <div className="text-sm text-stone-500">Partly cloudy</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⛩️</span>
                  <span className="font-medium">Kyoto</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">19°C</div>
                  <div className="text-sm text-stone-500">Clear</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🗻</span>
                  <span className="font-medium">Osaka</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">24°C</div>
                  <div className="text-sm text-stone-500">Sunny</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-zen">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your trip planning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-tea-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Added Tokyo Skytree to itinerary</p>
                <p className="text-xs text-stone-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-bamboo-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Hotel reservation confirmed</p>
                <p className="text-xs text-stone-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-sakura-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Updated packing checklist</p>
                <p className="text-xs text-stone-500">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}