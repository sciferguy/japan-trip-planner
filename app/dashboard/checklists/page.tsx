import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ChecklistsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            ✅ Personal Checklists
          </h1>
          <p className="text-stone-600 text-zen">
            Keep track of everything you need for your Japan trip
          </p>
        </div>
        <Button className="bg-tea-600 hover:bg-tea-700 w-fit">
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎒 Packing List
            </CardTitle>
            <CardDescription>Essential items to pack for Japan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Passport</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">JR Pass</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Comfortable shoes</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Power adapter</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cash (Yen)</span>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Progress</span>
                <span className="font-medium">0/5 completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📄 Documents
            </CardTitle>
            <CardDescription>Important paperwork and preparations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Travel insurance</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Hotel confirmations</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Flight tickets</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Emergency contacts</span>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Progress</span>
                <span className="font-medium">0/4 completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🛍️ Shopping List
            </CardTitle>
            <CardDescription>Things to buy before or during your trip</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pocket WiFi device</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Guidebook</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Omamori (good luck charms)</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Japanese snacks</span>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Progress</span>
                <span className="font-medium">0/4 completed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-zen">
        <CardHeader>
          <CardTitle>Pre-Trip Preparation</CardTitle>
          <CardDescription>Complete these tasks before your departure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Download translation app</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Learn basic Japanese phrases</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Research local customs</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Book restaurant reservations</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Check weather forecast</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Notify bank of travel</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Arrange pet/house sitting</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Pack carry-on essentials</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}