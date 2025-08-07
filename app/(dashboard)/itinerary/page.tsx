import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/auth"

export default async function ItineraryPage() {
  const session = { user: { name: "Demo User" } } // Mock session

  // Mock itinerary data
  const itinerary = {
    "Day 1 - March 15": [
      {
        id: 1,
        time: "09:00",
        duration: 120,
        title: "Arrival at Narita Airport",
        type: "TRANSPORT",
        location: "Narita International Airport",
        notes: "Flight arrives at 8:30 AM. Allow time for customs and immigration."
      },
      {
        id: 2,
        time: "12:00",
        duration: 90,
        title: "Hotel Check-in & Lunch",
        type: "ACCOMMODATION",
        location: "Shibuya District",
        notes: "Check in at Park Hotel Tokyo. Grab lunch nearby."
      },
      {
        id: 3,
        time: "15:00",
        duration: 180,
        title: "Explore Shibuya Crossing",
        type: "ACTIVITY",
        location: "Shibuya Crossing",
        notes: "Visit the famous crossing, explore shops, and get dinner."
      }
    ],
    "Day 2 - March 16": [
      {
        id: 4,
        time: "08:00",
        duration: 60,
        title: "Breakfast at Hotel",
        type: "MEAL",
        location: "Park Hotel Tokyo",
        notes: "Traditional Japanese breakfast included."
      },
      {
        id: 5,
        time: "09:30",
        duration: 240,
        title: "Tokyo Skytree Visit",
        type: "ACTIVITY",
        location: "Tokyo Skytree",
        notes: "Skip-the-line tickets booked. Visit both decks."
      },
      {
        id: 6,
        time: "14:00",
        duration: 150,
        title: "Asakusa Temple & Market",
        type: "ACTIVITY",
        location: "Sensoji Temple",
        notes: "Explore traditional temple and Nakamise shopping street."
      }
    ],
    "Day 3 - March 17": [
      {
        id: 7,
        time: "07:30",
        duration: 300,
        title: "Day Trip to Mount Fuji",
        type: "ACTIVITY",
        location: "Mount Fuji",
        notes: "Full day tour with bus transport. Weather permitting."
      },
      {
        id: 8,
        time: "18:00",
        duration: 90,
        title: "Return to Tokyo",
        type: "TRANSPORT",
        location: "Tokyo",
        notes: "Bus returns to Shinjuku station."
      }
    ]
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'TRANSPORT': return '🚅'
      case 'ACCOMMODATION': return '🏨'
      case 'ACTIVITY': return '🗾'
      case 'MEAL': return '🍽️'
      default: return '📍'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TRANSPORT': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ACCOMMODATION': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'ACTIVITY': return 'bg-green-100 text-green-800 border-green-200'
      case 'MEAL': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-stone-100 text-stone-800 border-stone-200'
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (hours > 0) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
    }
    return `${minutes}m`
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            Trip Itinerary
          </h1>
          <p className="text-stone-600 text-zen">
            Your detailed day-by-day Japan adventure plan
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Timeline View
          </Button>
          <Button className="bg-tea-600 hover:bg-tea-700">
            Add Activity
          </Button>
        </div>
      </div>

      {/* Trip Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-stone-800">Trip Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-tea-600">7 Days</div>
            <div className="text-sm text-stone-500">March 15-21, 2024</div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-stone-800">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bamboo-600">18</div>
            <div className="text-sm text-stone-500">Planned activities</div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-stone-800">Free Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sakura-600">25%</div>
            <div className="text-sm text-stone-500">Flexible schedule</div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-stone-800">Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-600">12</div>
            <div className="text-sm text-stone-500">Cities & attractions</div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Itinerary */}
      <div className="space-y-6">
        {Object.entries(itinerary).map(([day, activities]) => (
          <Card key={day} className="shadow-zen">
            <CardHeader>
              <CardTitle className="text-xl text-stone-800">{day}</CardTitle>
              <CardDescription>
                {activities.length} activities planned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border border-stone-200 rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="text-sm font-semibold text-stone-600 mb-1">
                        {activity.time}
                      </div>
                      <div className="text-2xl">{getTypeIcon(activity.type)}</div>
                      {index < activities.length - 1 && (
                        <div className="w-px h-12 bg-stone-200 mt-2"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-stone-800">{activity.title}</h3>
                          <p className="text-sm text-stone-600">📍 {activity.location}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getTypeColor(activity.type)}>
                            {activity.type}
                          </Badge>
                          <span className="text-sm text-stone-500">
                            {formatDuration(activity.duration)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-stone-600 mb-3">{activity.notes}</p>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View on Map</Button>
                        <Button variant="outline" size="sm">Add Note</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-zen">
        <CardHeader>
          <CardTitle>Quick Add Activities</CardTitle>
          <CardDescription>Popular Japan experiences to add to your itinerary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Sushi Experience", icon: "🍣", duration: "2h" },
              { name: "Temple Visit", icon: "⛩️", duration: "1h 30m" },
              { name: "Onsen Relaxation", icon: "♨️", duration: "3h" },
              { name: "Shopping District", icon: "🛍️", duration: "2h 30m" },
              { name: "Cherry Blossom Viewing", icon: "🌸", duration: "1h" },
              { name: "Traditional Tea Ceremony", icon: "🍵", duration: "1h 30m" },
              { name: "Karaoke Night", icon: "🎤", duration: "2h" },
              { name: "Castle Tour", icon: "🏯", duration: "2h" }
            ].map((activity, index) => (
              <Button key={index} variant="outline" className="justify-start h-auto p-3">
                <div className="flex items-center space-x-2">
                  <span>{activity.icon}</span>
                  <div className="text-left">
                    <div className="text-sm font-medium">{activity.name}</div>
                    <div className="text-xs text-stone-500">{activity.duration}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}