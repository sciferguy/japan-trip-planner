import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/auth"

export default async function ActivitiesPage() {
  const session = await auth()

  // Mock data for demonstration
  const activities = [
    {
      id: 1,
      title: "Visit Sensoji Temple",
      description: "Ancient Buddhist temple in Asakusa district",
      location: "Asakusa, Tokyo",
      priority: "HIGH",
      estimatedDuration: 120,
      completed: true,
      category: "Cultural"
    },
    {
      id: 2,
      title: "Tokyo Skytree Observation",
      description: "360-degree views from Japan's tallest tower",
      location: "Sumida, Tokyo",
      priority: "HIGH",
      estimatedDuration: 180,
      completed: false,
      category: "Sightseeing"
    },
    {
      id: 3,
      title: "Shibuya Crossing Experience",
      description: "World's busiest pedestrian crossing",
      location: "Shibuya, Tokyo",
      priority: "MEDIUM",
      estimatedDuration: 60,
      completed: true,
      category: "Urban"
    },
    {
      id: 4,
      title: "Meiji Shrine Visit",
      description: "Shinto shrine dedicated to Emperor Meiji",
      location: "Shibuya, Tokyo",
      priority: "MEDIUM",
      estimatedDuration: 90,
      completed: false,
      category: "Cultural"
    },
    {
      id: 5,
      title: "Tsukiji Outer Market Food Tour",
      description: "Fresh sushi and street food experience",
      location: "Tsukiji, Tokyo",
      priority: "HIGH",
      estimatedDuration: 150,
      completed: false,
      category: "Food"
    },
    {
      id: 6,
      title: "Harajuku Fashion District",
      description: "Youth culture and fashion shopping",
      location: "Harajuku, Tokyo",
      priority: "LOW",
      estimatedDuration: 120,
      completed: false,
      category: "Shopping"
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-stone-100 text-stone-800 border-stone-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cultural': return '⛩️'
      case 'Sightseeing': return '🗼'
      case 'Urban': return '🏙️'
      case 'Food': return '🍣'
      case 'Shopping': return '🛍️'
      default: return '📍'
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

  const completedActivities = activities.filter(a => a.completed).length
  const highPriorityPending = activities.filter(a => !a.completed && a.priority === 'HIGH').length
  const totalDuration = activities.reduce((sum, activity) => sum + activity.estimatedDuration, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            Activities & Attractions
          </h1>
          <p className="text-stone-600 text-zen">
            Discover and track must-visit locations for your Japan adventure
          </p>
        </div>
        <Button className="bg-tea-600 hover:bg-tea-700 w-fit">
          Add Activity
        </Button>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-stone-800">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-tea-600">{completedActivities}</span>
              <span className="text-stone-500">/ {activities.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-stone-800">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-red-600">{highPriorityPending}</span>
              <span className="text-stone-500">pending</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-stone-800">Total Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bamboo-600">
              {formatDuration(totalDuration)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-zen">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-stone-800">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-sakura-600">
                {Math.round((completedActivities / activities.length) * 100)}%
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-sakura-400 to-sakura-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedActivities / activities.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activities List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-semibold text-stone-800">Your Activities</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">Filter</Button>
            <Button variant="outline" size="sm">Sort</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((activity) => (
            <Card key={activity.id} className={`shadow-zen transition-all duration-200 hover:shadow-zen-lg ${activity.completed ? 'opacity-75' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryIcon(activity.category)}</span>
                    <div>
                      <CardTitle className={`text-lg ${activity.completed ? 'line-through text-stone-500' : 'text-stone-800'}`}>
                        {activity.title}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2 mt-1">
                        <span>📍 {activity.location}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getPriorityColor(activity.priority)}>
                      {activity.priority}
                    </Badge>
                    {activity.completed && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        ✓ Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-stone-600 text-sm mb-3">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-stone-500">
                    <span>⏱️ {formatDuration(activity.estimatedDuration)}</span>
                    <span>🏷️ {activity.category}</span>
                  </div>
                  <Button 
                    variant={activity.completed ? "outline" : "default"} 
                    size="sm"
                    className={activity.completed ? "" : "bg-tea-600 hover:bg-tea-700"}
                  >
                    {activity.completed ? "Revisit" : "Mark Complete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Add Suggestions */}
      <Card className="shadow-zen">
        <CardHeader>
          <CardTitle>Popular Japan Activities</CardTitle>
          <CardDescription>Quick add suggestions based on your location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Fushimi Inari Shrine", icon: "⛩️" },
              { name: "Mount Fuji View", icon: "🗻" },
              { name: "Osaka Castle", icon: "🏯" },
              { name: "Bamboo Forest", icon: "🎋" },
              { name: "Robot Restaurant", icon: "🤖" },
              { name: "Cherry Blossom Viewing", icon: "🌸" },
              { name: "Onsen Experience", icon: "♨️" },
              { name: "Karaoke Night", icon: "🎤" }
            ].map((suggestion, index) => (
              <Button key={index} variant="outline" className="justify-start h-auto p-3">
                <span className="mr-2">{suggestion.icon}</span>
                <span className="text-sm">{suggestion.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}