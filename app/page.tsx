import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-50 via-stone-50 to-bamboo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-stone-800 mb-4">
            Japan Trip Planner
          </h1>
          <p className="text-lg md:text-xl text-stone-600 text-zen max-w-2xl mx-auto">
            Modern trip planning application with comprehensive itinerary management, 
            collaborative features, and beautiful Japanese-inspired design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-zen hover:shadow-zen-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-tea-700 flex items-center gap-2">
                🗾 Itinerary Planning
              </CardTitle>
              <CardDescription>
                Create detailed daily itineraries with drag-and-drop reordering and time-based scheduling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• Daily & timeline views</li>
                <li>• Conflict detection</li>
                <li>• Activity linking</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-zen hover:shadow-zen-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-bamboo-700 flex items-center gap-2">
                🗺️ Hybrid Maps
              </CardTitle>
              <CardDescription>
                Interactive maps using Mapbox GL JS with Google Places integration and custom Japanese styling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• Custom pin types</li>
                <li>• Route planning</li>
                <li>• Offline support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-zen hover:shadow-zen-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-sakura-700 flex items-center gap-2">
                🎌 Reservations
              </CardTitle>
              <CardDescription>
                Manage all your bookings from flights to restaurants with QR code storage and reminders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• Flight & hotel bookings</li>
                <li>• Train passes & tickets</li>
                <li>• Restaurant reservations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-zen hover:shadow-zen-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-tea-700 flex items-center gap-2">
                ✅ Personal Checklists
              </CardTitle>
              <CardDescription>
                Separate checklists per person with pre-populated Japan travel essentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• Packing lists</li>
                <li>• Document preparation</li>
                <li>• Shopping reminders</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-zen hover:shadow-zen-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-bamboo-700 flex items-center gap-2">
                💰 Expense Tracking
              </CardTitle>
              <CardDescription>
                Private expense tracking with currency conversion and budget monitoring.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• USD/JPY conversion</li>
                <li>• Category tracking</li>
                <li>• Budget vs actual</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-zen hover:shadow-zen-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-sakura-700 flex items-center gap-2">
                🌸 Activities
              </CardTitle>
              <CardDescription>
                Discover and track sightseeing spots, cultural experiences, and must-visit locations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• Priority ranking</li>
                <li>• Duration estimates</li>
                <li>• Completion tracking</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="gradient-sakura inline-block p-8 rounded-2xl shadow-zen-lg">
            <h2 className="text-2xl font-heading font-bold text-stone-800 mb-4">
              Built with Modern Technology
            </h2>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-700 mb-6">
              <span className="bg-white/60 px-3 py-1 rounded-full">Next.js 15</span>
              <span className="bg-white/60 px-3 py-1 rounded-full">TypeScript</span>
              <span className="bg-white/60 px-3 py-1 rounded-full">Supabase</span>
              <span className="bg-white/60 px-3 py-1 rounded-full">Prisma</span>
              <span className="bg-white/60 px-3 py-1 rounded-full">Zustand</span>
              <span className="bg-white/60 px-3 py-1 rounded-full">Tailwind CSS</span>
              <span className="bg-white/60 px-3 py-1 rounded-full">Mapbox GL JS</span>
              <span className="bg-white/60 px-3 py-1 rounded-full">PWA Support</span>
            </div>
            <div className="space-x-4">
              <Link href="/sign-in">
                <Button className="bg-tea-600 hover:bg-tea-700 text-white">
                  Get Started
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" className="border-tea-600 text-tea-700 hover:bg-tea-50">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
