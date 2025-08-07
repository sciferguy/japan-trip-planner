import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ActivitiesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            🌸 Activities & Sightseeing
          </h1>
          <p className="text-stone-600 text-zen">
            Discover and track amazing experiences across Japan
          </p>
        </div>
        <Button className="bg-tea-600 hover:bg-tea-700 w-fit">
          Add Activity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">🏔️ Must-Visit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">0</div>
            <p className="text-sm text-stone-500">High priority activities</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">⭐ Optional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">0</div>
            <p className="text-sm text-stone-500">If time permits</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">✅ Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-tea-600">0</div>
            <p className="text-sm text-stone-500">Activities done</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">⏱️ Total Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">0h</div>
            <p className="text-sm text-stone-500">Estimated duration</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-zen">
            <CardHeader>
              <CardTitle>Your Activity List</CardTitle>
              <CardDescription>Organize and prioritize your Japan experiences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-stone-500">
                <div className="text-4xl mb-4">🎌</div>
                <p>No activities added yet</p>
                <p className="text-sm">Start building your Japan adventure list</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-zen">
            <CardHeader>
              <CardTitle>Popular in Tokyo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm p-3">
                <div className="flex items-center space-x-3">
                  <span className="text-base">🗼</span>
                  <div className="text-left">
                    <div className="font-medium">Tokyo Skytree</div>
                    <div className="text-xs text-stone-500">2-3 hours</div>
                  </div>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm p-3">
                <div className="flex items-center space-x-3">
                  <span className="text-base">⛩️</span>
                  <div className="text-left">
                    <div className="font-medium">Senso-ji Temple</div>
                    <div className="text-xs text-stone-500">1-2 hours</div>
                  </div>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm p-3">
                <div className="flex items-center space-x-3">
                  <span className="text-base">🍣</span>
                  <div className="text-left">
                    <div className="font-medium">Tsukiji Market</div>
                    <div className="text-xs text-stone-500">2-4 hours</div>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-zen">
            <CardHeader>
              <CardTitle>Popular in Kyoto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm p-3">
                <div className="flex items-center space-x-3">
                  <span className="text-base">🦌</span>
                  <div className="text-left">
                    <div className="font-medium">Fushimi Inari</div>
                    <div className="text-xs text-stone-500">2-4 hours</div>
                  </div>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm p-3">
                <div className="flex items-center space-x-3">
                  <span className="text-base">🎋</span>
                  <div className="text-left">
                    <div className="font-medium">Bamboo Grove</div>
                    <div className="text-xs text-stone-500">1-2 hours</div>
                  </div>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm p-3">
                <div className="flex items-center space-x-3">
                  <span className="text-base">🏮</span>
                  <div className="text-left">
                    <div className="font-medium">Gion District</div>
                    <div className="text-xs text-stone-500">2-3 hours</div>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-zen">
            <CardHeader>
              <CardTitle>Seasonal Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-3 bg-sakura-50 rounded-lg">
                <div className="text-2xl mb-1">🌸</div>
                <div className="text-sm font-medium">Cherry Blossoms</div>
                <div className="text-xs text-stone-600">March - May</div>
              </div>
              <div className="text-center p-3 bg-tea-50 rounded-lg">
                <div className="text-2xl mb-1">🍂</div>
                <div className="text-sm font-medium">Autumn Foliage</div>
                <div className="text-xs text-stone-600">October - November</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}