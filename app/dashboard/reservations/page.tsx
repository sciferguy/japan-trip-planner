import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ReservationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            🎌 Reservations
          </h1>
          <p className="text-stone-600 text-zen">
            Manage all your bookings and confirmations in one place
          </p>
        </div>
        <Button className="bg-tea-600 hover:bg-tea-700 w-fit">
          Add Reservation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              ✈️ Flights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">0</div>
            <p className="text-sm text-stone-500">No flights booked</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              🏨 Hotels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">0</div>
            <p className="text-sm text-stone-500">No hotels booked</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              🚄 Trains
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">0</div>
            <p className="text-sm text-stone-500">No train passes</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              🍱 Dining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">0</div>
            <p className="text-sm text-stone-500">No reservations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle>Upcoming Reservations</CardTitle>
            <CardDescription>Your next scheduled bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-stone-500">
              <div className="text-4xl mb-4">📅</div>
              <p>No upcoming reservations</p>
              <p className="text-sm">Add your first booking to get started</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader>
            <CardTitle>Quick Book</CardTitle>
            <CardDescription>Popular reservation types for Japan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-3">🏮</span>
                Traditional Ryokan
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-3">🍣</span>
                Sushi Restaurant
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-3">🎭</span>
                Kabuki Theatre
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-3">♨️</span>
                Onsen Experience
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-3">🗻</span>
                Mount Fuji Tour
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-zen">
        <CardHeader>
          <CardTitle>Reservation Tips for Japan</CardTitle>
          <CardDescription>Important information for booking in Japan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">📞 Restaurant Reservations</h4>
              <p className="text-sm text-stone-600">Many high-end restaurants require reservations. Book well in advance, especially for omakase experiences.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🚄 JR Pass</h4>
              <p className="text-sm text-stone-600">Purchase your JR Pass before arriving in Japan. It must be bought outside of Japan by foreign tourists.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🏨 Accommodation</h4>
              <p className="text-sm text-stone-600">Book hotels early, especially during cherry blossom season (March-May) and autumn foliage (October-November).</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎌 Cultural Events</h4>
              <p className="text-sm text-stone-600">Popular temples and cultural sites may require timed entry tickets during peak seasons.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}