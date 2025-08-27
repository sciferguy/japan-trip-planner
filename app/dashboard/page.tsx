'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useCurrentTrip } from "@/hooks/useCurrentTrip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  Calendar, 
  MapPin, 
  CheckSquare, 
  CalendarDays,
  Target,
  Clock, 
  Plus, 
  Receipt
} from "lucide-react"
import { toast } from 'sonner'

interface ChecklistStats {
  total: number
  completed: number
}

interface ItineraryGaps {
  emptyDays: number[]
  totalDays: number
}

interface TodayData {
  phase: 'planning' | 'traveling' | 'completed'
  todayActivities: any[]
  nextAction: string
  currentDay: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { currentTrip, loading: tripLoading } = useCurrentTrip()
  const [checklistStats, setChecklistStats] = useState<ChecklistStats>({ total: 0, completed: 0 })
  const [itineraryGaps, setItineraryGaps] = useState<ItineraryGaps>({ emptyDays: [], totalDays: 0 })
  const [todayData, setTodayData] = useState<TodayData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentTrip?.id) {
      fetchDashboardData()
    } else {
      setLoading(false)
    }
  }, [currentTrip?.id])

  const fetchDashboardData = async () => {
    if (!currentTrip?.id) return

    try {
      setLoading(true)

      // Fetch all dashboard data in parallel
      const [checklistRes, itineraryRes] = await Promise.all([
        // Fetch checklist data - handle 404 gracefully
        fetch(`/api/trips/${currentTrip.id}/checklist`).then(res => 
          res.ok ? res : null
        ).catch(() => null),
        // Fetch itinerary items to calculate gaps
        fetch(`/api/trips/${currentTrip.id}/itinerary-items`).then(res =>
          res.ok ? res : null  
        ).catch(() => null)
      ])

      // Process checklist data
      if (checklistRes && checklistRes.ok) {
        const checklistData = await checklistRes.json()
        const items = checklistData.items || []
        setChecklistStats({
          total: items.length,
          completed: items.filter((item: any) => item.completed).length
        })
      } else {
        setChecklistStats({ total: 0, completed: 0 })
      }

      // Process itinerary data to find gaps
      if (itineraryRes && itineraryRes.ok) {
        const itineraryData = await itineraryRes.json()
        const itemsByDay = itineraryData.data || {}
        
        // Calculate total days in trip
        const start = new Date(currentTrip.start_date)
        const end = new Date(currentTrip.end_date)
        const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
        
        // Find days with no activities
        const emptyDays: number[] = []
        for (let i = 1; i <= totalDays; i++) {
          if (!itemsByDay[i] || itemsByDay[i].length === 0) {
            emptyDays.push(i)
          }
        }
        
        setItineraryGaps({ emptyDays, totalDays })

        // Calculate today's data
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        start.setHours(0, 0, 0, 0)
        end.setHours(0, 0, 0, 0)

        let phase: 'planning' | 'traveling' | 'completed' = 'planning'
        let todayActivities: any[] = []
        let nextAction = ''
        let currentDay = 0

        if (today > end) {
          phase = 'completed'
          nextAction = 'Trip completed! Time to add photos and memories'
        } else if (today >= start) {
          phase = 'traveling'
          currentDay = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
          todayActivities = itemsByDay[currentDay] || []
          if (todayActivities.length === 0) {
            nextAction = 'No activities planned for today'
          }
        } else {
          phase = 'planning'
          const daysUntil = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          
          if (emptyDays.length > 0) {
            nextAction = `Add activities to Day ${emptyDays[0]}`
          } else if (checklistStats.total === 0) {
            nextAction = 'Create your pre-trip checklist'
          } else if (checklistStats.completed < checklistStats.total) {
            nextAction = `Complete checklist items (${checklistStats.total - checklistStats.completed} remaining)`
          } else {
            nextAction = `Ready for your trip in ${daysUntil} days!`
          }
        }

        setTodayData({
          phase,
          todayActivities,
          nextAction,
          currentDay
        })
      } else {
        // No itinerary data
        setItineraryGaps({ emptyDays: [], totalDays: 0 })
        setTodayData({
          phase: 'planning',
          todayActivities: [],
          nextAction: 'Start planning your itinerary',
          currentDay: 0
        })
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getTripProgress = () => {
    if (!currentTrip) return 0
    const today = new Date()
    const start = new Date(currentTrip.start_date)
    const end = new Date(currentTrip.end_date)

    today.setHours(0, 0, 0, 0)
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    const total = end.getTime() - start.getTime()
    const current = today.getTime() - start.getTime()
    return Math.max(0, Math.min(100, (current / total) * 100))
  }

  const getDaysUntilTrip = () => {
    if (!currentTrip) return null
    const today = new Date()
    const start = new Date(currentTrip.start_date)

    today.setHours(0, 0, 0, 0)
    start.setHours(0, 0, 0, 0)

    const diff = start.getTime() - today.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  if (status === "loading" || tripLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-stone-600 dark:text-stone-300">Loading...</div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-stone-600 dark:text-stone-300">Please sign in to access the dashboard.</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const daysUntilTrip = getDaysUntilTrip()
  const tripProgress = getTripProgress()

  return (
    <div className="space-y-6 pb-safe">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-stone-800 dark:text-white sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base">
            {currentTrip ? `Overview of ${currentTrip.title || 'your current trip'}` : 'Welcome to your trip planner'}
          </p>
        </div>
        <Button
          asChild
          className="bg-tea-600 hover:bg-tea-700 dark:bg-tea-500 dark:hover:bg-tea-600 w-full sm:w-auto"
          size="lg"
        >
          <Link href="/trips/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Trip
          </Link>
        </Button>
      </div>

      {/* Trip Status Card with gradient header */}
      {currentTrip && (
        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-sakura-500 to-tea-500 relative">
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-xl font-bold">{currentTrip.title || 'Current Trip'}</h2>
              <p className="text-sm opacity-90">
                {new Date(currentTrip.start_date).toLocaleDateString()} - {new Date(currentTrip.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-stone-600 dark:text-stone-300">Trip Progress</span>
                <span className="text-sm font-medium dark:text-white">{Math.round(tripProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-tea-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${tripProgress}%` }}
                />
              </div>
              {daysUntilTrip !== null && (
                <div className="text-sm text-center sm:text-left">
                  <span className="text-stone-600 dark:text-stone-300">
                    {daysUntilTrip > 0 ? `${daysUntilTrip} days until trip` :
                     daysUntilTrip === 0 ? 'Trip starts today!' :
                     `Day ${Math.abs(daysUntilTrip) + 1} of trip`}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

{/* Stats Cards - 2x2 Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Today Card - Context Aware */}
        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {todayData?.phase === 'traveling' ? "Today's Plans" : "Today's Focus"}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {!currentTrip ? (
              <>
                <div className="text-lg font-bold">Get Started</div>
                <p className="text-xs text-muted-foreground">Create your first trip</p>
              </>
            ) : loading ? (
              <div className="text-2xl font-bold">...</div>
            ) : todayData?.phase === 'traveling' ? (
              <>
                <div className="text-lg font-bold">
                  Day {todayData.currentDay}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {todayData.todayActivities.length} activities planned
                </p>
                {todayData.todayActivities.length > 0 && (
                  <Link href={`/dashboard/itinerary/day/${todayData.currentDay}`}>
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      View Day
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <div className="text-sm font-semibold mb-1">
                  {todayData?.nextAction || 'Just getting started'}
                </div>
                {todayData?.nextAction.includes('Day') && (
                  <Link href="/dashboard/itinerary">
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      Take Action
                    </Button>
                  </Link>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Itinerary Gaps Card with warning border */}
        <Card className={`shadow-zen dark:bg-gray-800 dark:border-gray-700 ${itineraryGaps.emptyDays.length > 7 ? 'border-2 border-orange-400' : ''}`}>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${itineraryGaps.emptyDays.length > 7 ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}>
            <CardTitle className="text-sm font-medium">
              {itineraryGaps.emptyDays.length > 7 ? '⚠️ Itinerary Gaps' : 'Itinerary Gaps'}
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {!currentTrip ? (
              <div className="text-2xl font-bold">No trip</div>
            ) : loading ? (
              <div className="text-2xl font-bold">...</div>
            ) : itineraryGaps.emptyDays.length === 0 ? (
              <>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ✓ All planned
                </div>
                <p className="text-xs text-muted-foreground">
                  Every day has activities
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {itineraryGaps.emptyDays.length === 1 
                    ? `Day ${itineraryGaps.emptyDays[0]}` 
                    : `${itineraryGaps.emptyDays.length} days`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {itineraryGaps.emptyDays.length === 1 ? 'needs activities' : 'need activities'}
                </p>
                <Link href={`/dashboard/itinerary/day/${itineraryGaps.emptyDays[0]}`}>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    Plan Day {itineraryGaps.emptyDays[0]} Now
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        {/* Pre-Trip Checklist Card */}
        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pre-Trip Checklist
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {!currentTrip ? (
              <div className="text-2xl font-bold">No trip</div>
            ) : loading ? (
              <div className="text-2xl font-bold">...</div>
            ) : checklistStats.total === 0 ? (
              <>
                <div className="text-sm text-muted-foreground mb-2">No items yet</div>
                <Link href="/dashboard/checklists">
                  <Button variant="outline" size="sm" className="w-full">
                    Start your checklist →
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {checklistStats.completed}/{checklistStats.total}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((checklistStats.completed / checklistStats.total) * 100)}% complete
                </p>
                <Link href="/dashboard/checklists">
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    View Checklist
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card - Compact Version */}
        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quick Actions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/dashboard/itinerary" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="h-3 w-3 mr-2" />
                  Itinerary
                </Button>
              </Link>
              <Link href="/dashboard/checklists" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <CheckSquare className="h-3 w-3 mr-2" />
                  Checklist
                </Button>
              </Link>
              <Link href="/dashboard/places" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MapPin className="h-3 w-3 mr-2" />
                  Places
                </Button>
              </Link>
              <Link href="/dashboard/expenses" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Receipt className="h-3 w-3 mr-2" />
                  Expenses
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Today's Itinerary - Shows during travel */}
        {todayData?.phase === 'traveling' && (
          <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Itinerary
              </CardTitle>
              <CardDescription className="dark:text-stone-300">
                Day {todayData.currentDay} activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayData.todayActivities.length > 0 ? (
                <div className="space-y-3">
                  {todayData.todayActivities.slice(0, 4).map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium dark:text-white truncate">{item.title}</p>
                        {item.location && (
                          <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{item.location}</p>
                        )}
                      </div>
                      {item.startTime && (
                        <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                          {new Date(item.startTime).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </Badge>
                      )}
                    </div>
                  ))}
                  {todayData.todayActivities.length > 4 && (
                    <Link href={`/dashboard/itinerary/day/${todayData.currentDay}`} className="block">
                      <Button variant="outline" size="sm" className="w-full">
                        View all {todayData.todayActivities.length} activities
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="mb-4">No activities planned for today</p>
                  <Link href="/dashboard/itinerary">
                    <Button variant="outline" size="sm">
                      Plan your day
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* No Trip Selected State */}
      {!currentTrip && !tripLoading && (
        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-6">🗾</div>
            <h3 className="text-xl font-semibold dark:text-white mb-2">Get Started</h3>
            <p className="text-stone-600 dark:text-stone-300 mb-6 max-w-md mx-auto">
              No trip selected. Create or select a trip to see your dashboard overview.
            </p>
            <Button
              asChild
              className="bg-tea-600 hover:bg-tea-700 dark:bg-tea-500 dark:hover:bg-tea-600"
              size="lg"
            >
              <Link href="/trips/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Trip
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}