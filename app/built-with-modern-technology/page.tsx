import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BuiltWithModernTechnology() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-50 via-stone-50 to-bamboo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-stone-800 mb-4">
            Built with Modern Technology
          </h1>
          <p className="text-lg md:text-xl text-stone-600 text-zen max-w-2xl mx-auto">
            This Japan Trip Planner is built using the latest web technologies
            to provide a fast, reliable, and beautiful experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="gradient-sakura p-8 rounded-2xl shadow-zen-lg mb-8">
            <h2 className="text-2xl font-heading font-bold text-stone-800 mb-6 text-center">
              Technology Stack
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/60 px-4 py-3 rounded-full text-center">
                <span className="font-semibold text-stone-700">Next.js 15</span>
              </div>
              <div className="bg-white/60 px-4 py-3 rounded-full text-center">
                <span className="font-semibold text-stone-700">TypeScript</span>
              </div>
              <div className="bg-white/60 px-4 py-3 rounded-full text-center">
                <span className="font-semibold text-stone-700">Supabase</span>
              </div>
              <div className="bg-white/60 px-4 py-3 rounded-full text-center">
                <span className="font-semibold text-stone-700">Prisma</span>
              </div>
              <div className="bg-white/60 px-4 py-3 rounded-full text-center">
                <span className="font-semibold text-stone-700">Zustand</span>
              </div>
              <div className="bg-white/60 px-4 py-3 rounded-full text-center">
                <span className="font-semibold text-stone-700">Tailwind CSS</span>
              </div>
              <div className="bg-white/60 px-4 py-3 rounded-full text-center">
                <span className="font-semibold text-stone-700">Mapbox GL JS</span>
              </div>
              <div className="bg-white/60 px-4 py-3 rounded-full text-center">
                <span className="font-semibold text-stone-700">PWA Support</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/80 p-6 rounded-xl shadow-zen">
              <h3 className="text-xl font-heading font-bold text-tea-700 mb-3">
                Frontend Framework
              </h3>
              <p className="text-stone-600 mb-4">
                Built with Next.js 15 and React 19 for server-side rendering,
                optimal performance, and modern development experience.
              </p>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• App Router with TypeScript</li>
                <li>• Server Components & Client Components</li>
                <li>• Optimized image loading</li>
                <li>• Progressive Web App capabilities</li>
              </ul>
            </div>

            <div className="bg-white/80 p-6 rounded-xl shadow-zen">
              <h3 className="text-xl font-heading font-bold text-bamboo-700 mb-3">
                Backend & Database
              </h3>
              <p className="text-stone-600 mb-4">
                Powered by Supabase for authentication, real-time features,
                and PostgreSQL database with Prisma ORM for type safety.
              </p>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• Supabase PostgreSQL database</li>
                <li>• Prisma ORM with type generation</li>
                <li>• NextAuth.js authentication</li>
                <li>• Real-time subscriptions</li>
              </ul>
            </div>

            <div className="bg-white/80 p-6 rounded-xl shadow-zen">
              <h3 className="text-xl font-heading font-bold text-sakura-700 mb-3">
                State Management & UI
              </h3>
              <p className="text-stone-600 mb-4">
                Zustand for lightweight state management and Tailwind CSS
                with Radix UI components for beautiful, accessible design.
              </p>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• Zustand for client state</li>
                <li>• Tailwind CSS with custom theme</li>
                <li>• Radix UI component library</li>
                <li>• Japanese-inspired color palette</li>
              </ul>
            </div>

            <div className="bg-white/80 p-6 rounded-xl shadow-zen">
              <h3 className="text-xl font-heading font-bold text-tea-700 mb-3">
                Maps & Visualization
              </h3>
              <p className="text-stone-600 mb-4">
                Interactive maps using Mapbox GL JS with custom styling
                and Recharts for data visualization and analytics.
              </p>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• Mapbox GL JS with custom styles</li>
                <li>• React Map GL integration</li>
                <li>• Recharts for expense tracking</li>
                <li>• Responsive design patterns</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <div className="space-x-4">
              <Link href="/itinerary">
                <Button className="bg-tea-600 hover:bg-tea-700 text-white">
                  Start Planning Your Trip
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-tea-600 text-tea-700 hover:bg-tea-50">
                  Back to Homepage
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}