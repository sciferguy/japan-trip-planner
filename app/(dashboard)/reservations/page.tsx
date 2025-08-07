import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ReservationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            Reservations
          </h1>
          <p className="text-stone-600 text-zen">
            Manage flights, hotels, trains, and restaurant bookings
          </p>
        </div>
        <Button className="bg-tea-600 hover:bg-tea-700">
          Add Reservation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-zen">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-stone-600">Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">✈️ 4</div>
          </CardContent>
        </Card>
        <Card className="shadow-zen">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-stone-600">Hotels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">🏨 7</div>
          </CardContent>
        </Card>
        <Card className="shadow-zen">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-stone-600">Trains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">🚅 12</div>
          </CardContent>
        </Card>
        <Card className="shadow-zen">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-stone-600">Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">🍱 15</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-zen">
        <CardHeader>
          <CardTitle>🎌 Reservation Management</CardTitle>
          <CardDescription>
            Comprehensive booking management with QR code storage and automated reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <div className="space-y-4">
            <div className="text-6xl opacity-50">📋</div>
            <h3 className="text-xl font-semibold text-stone-800">Coming Soon</h3>
            <p className="text-stone-600 max-w-md mx-auto">
              Complete reservation management system with confirmation tracking, 
              QR code storage, automated reminders, and seat/room preferences.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}