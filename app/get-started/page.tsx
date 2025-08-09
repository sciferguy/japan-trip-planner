import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-50 via-stone-50 to-bamboo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-stone-800 mb-4">
            Get Started
          </h1>
          <p className="text-lg md:text-xl text-stone-600 text-zen max-w-2xl mx-auto">
            Follow these steps to begin planning your Japan adventure
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-zen mb-8">
            <CardHeader>
              <CardTitle className="text-tea-700">🚀 Getting Started</CardTitle>
              <CardDescription>
                Follow these steps to begin planning your Japan adventure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-stone-600">
                <li>Create an account or sign in</li>
                <li>Create your first trip with dates</li>
                <li>Add destinations and plan your itinerary</li>
                <li>Track expenses and manage reservations</li>
                <li>Use checklists to prepare for your journey</li>
              </ol>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/itinerary">
              <Button className="bg-tea-600 hover:bg-tea-700 text-white mr-4">
                Start Planning
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-tea-600 text-tea-700 hover:bg-tea-50">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}