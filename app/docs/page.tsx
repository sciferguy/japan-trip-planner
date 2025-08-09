import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-50 via-stone-50 to-bamboo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-stone-800 mb-4">
            Documentation
          </h1>
          <p className="text-lg md:text-xl text-stone-600 text-zen max-w-2xl mx-auto">
            Learn how to make the most of your Japan Trip Planner
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-zen">
              <CardHeader>
                <CardTitle className="text-bamboo-700">🗾 Planning Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-stone-600">
                  <li>• Interactive itinerary builder</li>
                  <li>• Map integration with custom pins</li>
                  <li>• Reservation management</li>
                  <li>• Expense tracking with currency conversion</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-zen">
              <CardHeader>
                <CardTitle className="text-sakura-700">⚙️ Technical Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-stone-600">
                  <li>• Next.js 15 with App Router</li>
                  <li>• NextAuth.js for authentication</li>
                  <li>• Supabase for database</li>
                  <li>• Mapbox for interactive maps</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/">
              <Button className="bg-tea-600 hover:bg-tea-700 text-white mr-4">
                Back to Home
              </Button>
            </Link>
            <Link href="/get-started">
              <Button variant="outline" className="border-tea-600 text-tea-700 hover:bg-tea-50">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}