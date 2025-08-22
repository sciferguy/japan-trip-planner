// app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCurrentTrip } from "@/hooks/useCurrentTrip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, MapPin, CheckSquare, Activity, Clock } from "lucide-react";

interface DashboardStats {
  totalItems: number;
  completedItems: number;
  todayItems: number;
  upcomingItems: number;
}

interface TodayItinerary {
  id: string;
  title: string;
  time: string | null;
  category: string;
  location?: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentTrip, loading: tripLoading } = useCurrentTrip();
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    completedItems: 0,
    todayItems: 0,
    upcomingItems: 0
  });
  const [todayItinerary, setTodayItinerary] = useState<TodayItinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  useEffect(() => {
    if (currentTrip?.id) {
      fetchDashboardData();
    }
  }, [currentTrip?.id]);

  const fetchDashboardData = async () => {
    if (!currentTrip?.id) return;

    try {
      setLoading(true);

      // Fetch checklist stats
      const checklistResponse = await fetch(`/api/checklists?trip_id=${currentTrip.id}`);
      const checklistResult = await checklistResponse.json();

      // Fetch today's itinerary
      const today = new Date();
      const tripStart = new Date(currentTrip.start_date);
      const dayNumber = Math.floor((today.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const itineraryResponse = await fetch(`/api/itinerary?trip_id=${currentTrip.id}&day=${dayNumber}`);
      const itineraryResult = await itineraryResponse.json();

      if (checklistResult.success) {
        const items = checklistResult.data;
        setStats({
          totalItems: items.length,
          completedItems: items.filter((item: any) => item.completed).length,
          todayItems: itineraryResult.success ? itineraryResult.data.length : 0,
          upcomingItems: items.filter((item: any) => !item.completed).length
        });
      }

      if (itineraryResult.success) {
        setTodayItinerary(itineraryResult.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTripProgress = () => {
    if (!currentTrip) return 0;
    const today = new Date();
    const start = new Date(currentTrip.start_date);
    const end = new Date(currentTrip.end_date);
    const total = end.getTime() - start.getTime();
    const current = today.getTime() - start.getTime();
    return Math.max(0, Math.min(100, (current / total) * 100));
  };

  const getDaysUntilTrip = () => {
    if (!currentTrip) return null;
    const today = new Date();
    const start = new Date(currentTrip.start_date);
    const diff = start.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  if (status === "loading" || tripLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-stone-600 dark:text-stone-300">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const daysUntilTrip = getDaysUntilTrip();
  const tripProgress = getTripProgress();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-stone-600 dark:text-stone-300 text-zen">
            {currentTrip ? `Overview of ${currentTrip.title || 'your current trip'}` : 'Welcome to your trip planner'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/trips/new">
            <Button className="bg-tea-600 hover:bg-tea-700 dark:bg-tea-500 dark:hover:bg-tea-600">
              Create New Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* Trip Status */}
      {currentTrip && (
        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {currentTrip.title || 'Current Trip'}
            </CardTitle>
            <CardDescription className="dark:text-stone-300">
              {new Date(currentTrip.start_date).toLocaleDateString()} - {new Date(currentTrip.end_date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-stone-600 dark:text-stone-300">Trip Progress</span>
                <span className="text-sm font-medium dark:text-white">{Math.round(tripProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-tea-500 h-2 rounded-full transition-all"
                  style={{ width: `${tripProgress}%` }}
                />
              </div>
              {daysUntilTrip !== null && (
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-300">
                    {daysUntilTrip > 0 ? `${daysUntilTrip} days until trip` :
                     daysUntilTrip === 0 ? 'Trip starts today!' :
                     `Day ${Math.abs(daysUntilTrip)} of trip`}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600 dark:text-stone-300">Today's Plans</CardTitle>
            <Calendar className="h-4 w-4 text-stone-600 dark:text-stone-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800 dark:text-white">
              {loading ? '...' : stats.todayItems}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {stats.todayItems === 1 ? 'activity planned' : 'activities planned'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600 dark:text-stone-300">Checklist Progress</CardTitle>
            <CheckSquare className="h-4 w-4 text-stone-600 dark:text-stone-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800 dark:text-white">
              {loading ? '...' : `${stats.completedItems}/${stats.totalItems}`}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {stats.totalItems > 0 ? `${Math.round((stats.completedItems / stats.totalItems) * 100)}% complete` : 'No items yet'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600 dark:text-stone-300">Pending Tasks</CardTitle>
            <Activity className="h-4 w-4 text-stone-600 dark:text-stone-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800 dark:text-white">
              {loading ? '...' : stats.upcomingItems}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">items to complete</p>
          </CardContent>
        </Card>

        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600 dark:text-stone-300">Current Trip</CardTitle>
            <MapPin className="h-4 w-4 text-stone-600 dark:text-stone-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800 dark:text-white">
              {currentTrip ? '✅' : '❌'}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {currentTrip ? 'Trip selected' : 'No trip selected'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Itinerary & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Itinerary
            </CardTitle>
            <CardDescription className="dark:text-stone-300">
              {todayItinerary.length > 0 ? `${todayItinerary.length} activities planned` : 'No activities scheduled'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-gray-200 rounded h-12 w-full" />
                ))}
              </div>
            ) : todayItinerary.length > 0 ? (
              <div className="space-y-3">
                {todayItinerary.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex-1">
                      <p className="font-medium dark:text-white">{item.title}</p>
                      {item.location && (
                        <p className="text-xs text-stone-500 dark:text-stone-400">{item.location}</p>
                      )}
                    </div>
                    {item.time && (
                      <Badge variant="outline" className="text-xs">
                        {item.time}
                      </Badge>
                    )}
                  </div>
                ))}
                {todayItinerary.length > 4 && (
                  <Link href="/dashboard/itinerary" className="block text-center">
                    <Button variant="outline" size="sm" className="w-full">
                      View all {todayItinerary.length} activities
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No activities planned for today</p>
                <Link href="/dashboard/itinerary">
                  <Button variant="outline" size="sm" className="mt-2">
                    Plan your day
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Quick Actions</CardTitle>
            <CardDescription className="dark:text-stone-300">Jump to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/itinerary">
              <Button variant="outline" className="w-full justify-start dark:border-gray-600 dark:text-stone-300 dark:hover:bg-gray-700">
                📅 Manage Itinerary
              </Button>
            </Link>
            <Link href="/dashboard/checklists">
              <Button variant="outline" className="w-full justify-start dark:border-gray-600 dark:text-stone-300 dark:hover:bg-gray-700">
                ✅ Update Checklist
              </Button>
            </Link>
            <Link href="/dashboard/map">
              <Button variant="outline" className="w-full justify-start dark:border-gray-600 dark:text-stone-300 dark:hover:bg-gray-700">
                📍 Explore Places
              </Button>
            </Link>
            <Link href="/dashboard/expenses">
              <Button variant="outline" className="w-full justify-start dark:border-gray-600 dark:text-stone-300 dark:hover:bg-gray-700">
                💰 Track Expenses
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* No Trip Selected State */}
      {!currentTrip && !tripLoading && (
        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Get Started</CardTitle>
            <CardDescription className="dark:text-stone-300">Create your first trip to begin planning</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="text-6xl mb-4">🗾</div>
            <p className="text-stone-600 dark:text-stone-300 mb-4">
              No trip selected. Create or select a trip to see your dashboard overview.
            </p>
            <Link href="/dashboard/trips/new">
              <Button className="bg-tea-600 hover:bg-tea-700 dark:bg-tea-500 dark:hover:bg-tea-600">
                Create Your First Trip
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}