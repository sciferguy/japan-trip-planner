import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StubPageProps {
  title: string
  emoji: string
  description: string
  features: string[]
}

export function StubPage({ title, emoji, description, features }: StubPageProps) {
  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-8xl mb-4">{emoji}</div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-stone-800 mb-4">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-stone-600 text-zen max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          <Card className="shadow-zen-lg mb-8">
            <CardHeader>
              <CardTitle className="text-tea-700 flex items-center gap-2">
                🚧 Coming Soon
              </CardTitle>
              <CardDescription>
                This feature is currently under development. Check back soon for updates!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-stone-800 mb-3">Planned Features:</h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-stone-600">
                    <span className="w-2 h-2 bg-tea-400 rounded-full"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/">
              <Button variant="outline" className="border-tea-600 text-tea-700 hover:bg-tea-50">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}