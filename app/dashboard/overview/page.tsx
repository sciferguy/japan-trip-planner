"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const { data: session } = useSession()
  
  const userName = session?.user?.name || session?.user?.email || 'traveler'
  const firstName = userName.split(' ')[0] || userName.split('@')[0] || 'traveler'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-stone-600 text-zen">
            Here&apos;s your Japan trip planning dashboard. Ready to continue your adventure?
          </p>
        </div>
        <Button className="bg-tea-600 hover:bg-tea-700 w-fit">
          Create New Trip
        </Button>
      </div>

      {/* Getting Started Message */}
      <Card className="shadow-zen border-tea-200 bg-gradient-to-r from-tea-50 to-bamboo-50">
        <CardHeader>
          <CardTitle className="text-tea-700 flex items-center gap-2">
            🎌 Welcome to Your Japan Trip Planner!
          </CardTitle>
          <CardDescription>
            Your account is set up and ready! Start planning your perfect journey to Japan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">🗾 Plan Your Itinerary</div>
                <div className="text-xs text-stone-500">Add destinations and activities</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">🏨 Book Reservations</div>
                <div className="text-xs text-stone-500">Hotels, restaurants, and experiences</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-zen">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Total Trips</CardTitle>
            <span className="text-2xl">🗾</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">0</div>
            <p className="text-xs text-stone-500">Ready to create your first trip!</p>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Upcoming Reservations</CardTitle>
            <span className="text-2xl">🎌</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">0</div>
            <p className="text-xs text-stone-500">No reservations yet</p>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Activities Planned</CardTitle>
            <span className="text-2xl">🌸</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">0</div>
            <p className="text-xs text-stone-500">Time to explore Japan!</p>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Budget Status</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">¥0</div>
            <p className="text-xs text-stone-500">Set your travel budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with these essential planning tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => alert('Feature coming soon!')}>
              📅 Add Itinerary Item
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => alert('Feature coming soon!')}>
              🏨 Make Reservation
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => alert('Feature coming soon!')}>
              📍 Add Location to Map
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => alert('Feature coming soon!')}>
              ✅ Update Checklist
            </Button>
          </CardContent>
        </Card>

        {/* Weather Widget */}
        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle>Japan Weather</CardTitle>
            <CardDescription>Current weather in popular destinations</CardDescription>
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

      {/* Getting Started Guide */}
      <Card className="shadow-zen">
        <CardHeader>
          <CardTitle>Your Next Steps</CardTitle>
          <CardDescription>Follow this guide to get the most out of your Japan trip planner</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-tea-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div className="flex-1">
                <p className="text-sm font-medium">Create Your First Trip</p>
                <p className="text-xs text-stone-500">Set your travel dates and destinations</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-bamboo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div className="flex-1">
                <p className="text-sm font-medium">Plan Your Itinerary</p>
                <p className="text-xs text-stone-500">Add activities and organize your daily schedule</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-sakura-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div className="flex-1">
                <p className="text-sm font-medium">Book Reservations</p>
                <p className="text-xs text-stone-500">Secure your accommodations and restaurant bookings</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}