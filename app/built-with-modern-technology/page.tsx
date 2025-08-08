import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BuiltWithModernTechnology() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-50 via-stone-50 to-bamboo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-stone-800 mb-4">
            Built with Modern Technology
          </h1>
          <p className="text-lg text-stone-600 max-w-3xl mx-auto">
            Our Japan Trip Planner is crafted using cutting-edge web technologies 
            to deliver a fast, reliable, and beautiful user experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <Card className="shadow-zen-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-tea-700 mb-4">Technology Stack</CardTitle>
              <CardDescription className="text-base">
                Each technology is carefully chosen to enhance performance, developer experience, and user satisfaction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-sakura-50 to-sakura-100 px-4 py-3 rounded-lg text-center shadow-zen">
                  <div className="font-semibold text-sakura-700">Next.js 15</div>
                  <div className="text-xs text-sakura-600 mt-1">React Framework</div>
                </div>
                <div className="bg-gradient-to-br from-bamboo-50 to-bamboo-100 px-4 py-3 rounded-lg text-center shadow-zen">
                  <div className="font-semibold text-bamboo-700">TypeScript</div>
                  <div className="text-xs text-bamboo-600 mt-1">Type Safety</div>
                </div>
                <div className="bg-gradient-to-br from-tea-50 to-tea-100 px-4 py-3 rounded-lg text-center shadow-zen">
                  <div className="font-semibold text-tea-700">Supabase</div>
                  <div className="text-xs text-tea-600 mt-1">Backend & Auth</div>
                </div>
                <div className="bg-gradient-to-br from-stone-50 to-stone-100 px-4 py-3 rounded-lg text-center shadow-zen">
                  <div className="font-semibold text-stone-700">Prisma</div>
                  <div className="text-xs text-stone-600 mt-1">Database ORM</div>
                </div>
                <div className="bg-gradient-to-br from-sakura-50 to-sakura-100 px-4 py-3 rounded-lg text-center shadow-zen">
                  <div className="font-semibold text-sakura-700">Zustand</div>
                  <div className="text-xs text-sakura-600 mt-1">State Management</div>
                </div>
                <div className="bg-gradient-to-br from-bamboo-50 to-bamboo-100 px-4 py-3 rounded-lg text-center shadow-zen">
                  <div className="font-semibold text-bamboo-700">Tailwind CSS</div>
                  <div className="text-xs text-bamboo-600 mt-1">Styling</div>
                </div>
                <div className="bg-gradient-to-br from-tea-50 to-tea-100 px-4 py-3 rounded-lg text-center shadow-zen">
                  <div className="font-semibold text-tea-700">Mapbox GL JS</div>
                  <div className="text-xs text-tea-600 mt-1">Interactive Maps</div>
                </div>
                <div className="bg-gradient-to-br from-stone-50 to-stone-100 px-4 py-3 rounded-lg text-center shadow-zen">
                  <div className="font-semibold text-stone-700">PWA Support</div>
                  <div className="text-xs text-stone-600 mt-1">Mobile Ready</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-zen-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-tea-700 mb-2">Why This Stack?</CardTitle>
              <CardDescription className="text-base">
                Our technology choices are driven by performance, developer experience, and user needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-stone-700">
                <div>
                  <strong className="text-tea-700">Next.js 15 & React 19:</strong> Provides server-side rendering, 
                  excellent performance, and the latest React features for a smooth user experience.
                </div>
                <div>
                  <strong className="text-bamboo-700">TypeScript:</strong> Ensures code reliability and catches 
                  errors during development, making the application more stable and maintainable.
                </div>
                <div>
                  <strong className="text-sakura-700">Supabase & Prisma:</strong> Modern backend-as-a-service with 
                  real-time capabilities and type-safe database interactions for reliable data management.
                </div>
                <div>
                  <strong className="text-tea-700">Tailwind CSS:</strong> Utility-first CSS framework enables rapid 
                  UI development while maintaining consistent design and Japanese-inspired aesthetics.
                </div>
                <div>
                  <strong className="text-bamboo-700">Mapbox GL JS:</strong> Powerful mapping solution for interactive 
                  location planning with custom styling and offline support.
                </div>
                <div>
                  <strong className="text-stone-700">PWA Features:</strong> Progressive Web App capabilities provide 
                  app-like experience with offline functionality for travel scenarios.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}