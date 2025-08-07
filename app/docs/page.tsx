import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-50 via-stone-50 to-bamboo-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-stone-800 mb-4">
            Documentation
          </h1>
          <p className="text-lg md:text-xl text-stone-600 text-zen max-w-2xl mx-auto">
            Complete guide to using the Japan Trip Planner application
          </p>
        </div>

        {/* Navigation Back */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="border-tea-600 text-tea-700 hover:bg-tea-50">
              ← Back to Home
            </Button>
          </Link>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="shadow-zen hover:shadow-zen-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-tea-700">Getting Started</CardTitle>
              <CardDescription>
                Learn how to create your account and start planning your first trip to Japan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-stone-600 space-y-2">
                <li>• Create an account with Google</li>
                <li>• Set up your first trip</li>
                <li>• Add trip members and collaborators</li>
                <li>• Configure your preferences</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-zen hover:shadow-zen-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-bamboo-700">Itinerary Planning</CardTitle>
              <CardDescription>
                Master the art of creating detailed daily itineraries for your Japan trip.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-stone-600 space-y-2">
                <li>• Add activities to your daily schedule</li>
                <li>• Drag and drop to reorder items</li>
                <li>• Set time constraints and duration</li>
                <li>• Link activities to map locations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-zen hover:shadow-zen-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-sakura-700">Maps & Navigation</CardTitle>
              <CardDescription>
                Use interactive maps to visualize your trip and plan efficient routes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-stone-600 space-y-2">
                <li>• Add custom pins for locations</li>
                <li>• Plan efficient routes between spots</li>
                <li>• View distance and travel times</li>
                <li>• Use offline map features</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-zen hover:shadow-zen-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-tea-700">Reservations Management</CardTitle>
              <CardDescription>
                Keep track of all your bookings in one centralized location.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-stone-600 space-y-2">
                <li>• Store flight and hotel confirmations</li>
                <li>• Track restaurant reservations</li>
                <li>• Manage train passes and tickets</li>
                <li>• Set up booking reminders</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Technical Information */}
        <Card className="shadow-zen mb-8">
          <CardHeader>
            <CardTitle className="text-stone-800">Technical Stack</CardTitle>
            <CardDescription>
              Built with modern web technologies for the best user experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <h3 className="font-semibold text-stone-800 mb-2">Frontend</h3>
                <ul className="text-sm text-stone-600 space-y-1">
                  <li>Next.js 15</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>React 19</li>
                </ul>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-stone-800 mb-2">Backend</h3>
                <ul className="text-sm text-stone-600 space-y-1">
                  <li>Supabase</li>
                  <li>Prisma ORM</li>
                  <li>NextAuth.js v5</li>
                  <li>PostgreSQL</li>
                </ul>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-stone-800 mb-2">State Management</h3>
                <ul className="text-sm text-stone-600 space-y-1">
                  <li>Zustand</li>
                  <li>React Query</li>
                  <li>React Hook Form</li>
                  <li>Zod Validation</li>
                </ul>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-stone-800 mb-2">Integrations</h3>
                <ul className="text-sm text-stone-600 space-y-1">
                  <li>Mapbox GL JS</li>
                  <li>Google Places API</li>
                  <li>OpenWeatherMap</li>
                  <li>Exchange Rate API</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <div className="gradient-sakura inline-block p-8 rounded-2xl shadow-zen-lg">
            <h2 className="text-2xl font-heading font-bold text-stone-800 mb-4">
              Ready to Start Planning?
            </h2>
            <p className="text-stone-600 mb-6">
              Create your account and begin planning your perfect Japan trip today.
            </p>
            <Link href="/sign-in">
              <Button className="bg-tea-600 hover:bg-tea-700 text-white">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}