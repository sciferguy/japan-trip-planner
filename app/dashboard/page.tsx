"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-stone-600 dark:text-stone-300">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-stone-600 dark:text-stone-300 text-zen">
            Here's an overview of your Japan trip planning progress.
          </p>
        </div>
        <Button className="bg-tea-600 hover:bg-tea-700 dark:bg-tea-500 dark:hover:bg-tea-600 w-fit">
          Create New Trip
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600 dark:text-stone-300">Total Trips</CardTitle>
            <span className="text-2xl">🗾</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800 dark:text-white">3</div>
            <p className="text-xs text-stone-500 dark:text-stone-400">2 active, 1 completed</p>
          </CardContent>
        </Card>

        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600 dark:text-stone-300">Upcoming Reservations</CardTitle>
            <span className="text-2xl">🎌</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800 dark:text-white">12</div>
            <p className="text-xs text-stone-500 dark:text-stone-400">Next: Hotel check-in in 2 days</p>
          </CardContent>
        </Card>

        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600 dark:text-stone-300">Activities Planned</CardTitle>
            <span className="text-2xl">🌸</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800 dark:text-white">45</div>
            <p className="text-xs text-stone-500 dark:text-stone-400">23 must-visit, 22 optional</p>
          </CardContent>
        </Card>

        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600 dark:text-stone-300">Budget Status</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800 dark:text-white">¥425K</div>
            <p className="text-xs text-stone-500 dark:text-stone-400">68% of budget used</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Quick Actions</CardTitle>
            <CardDescription className="dark:text-stone-300">Common tasks to help you plan your trip</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start dark:border-gray-600 dark:text-stone-300 dark:hover:bg-gray-700">
              📅 Add Itinerary Item
            </Button>
            <Button variant="outline" className="w-full justify-start dark:border-gray-600 dark:text-stone-300 dark:hover:bg-gray-700">
              🏨 Make Reservation
            </Button>
            <Button variant="outline" className="w-full justify-start dark:border-gray-600 dark:text-stone-300 dark:hover:bg-gray-700">
              📍 Add Location to Map
            </Button>
            <Button variant="outline" className="w-full justify-start dark:border-gray-600 dark:text-stone-300 dark:hover:bg-gray-700">
              ✅ Update Checklist
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Japan Weather</CardTitle>
            <CardDescription className="dark:text-stone-300">Current weather in your destinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🏙️</span>
                  <span className="font-medium dark:text-white">Tokyo</span>
                </div>
                <div className="text-right">
                  <div className="font-bold dark:text-white">22°C</div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">Partly cloudy</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⛩️</span>
                  <span className="font-medium dark:text-white">Kyoto</span>
                </div>
                <div className="text-right">
                  <div className="font-bold dark:text-white">19°C</div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">Clear</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🗻</span>
                  <span className="font-medium dark:text-white">Osaka</span>
                </div>
                <div className="text-right">
                  <div className="font-bold dark:text-white">24°C</div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">Sunny</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-zen dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Recent Activity</CardTitle>
          <CardDescription className="dark:text-stone-300">Latest updates from your trip planning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-tea-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium dark:text-white">Added Tokyo Skytree to itinerary</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-bamboo-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium dark:text-white">Hotel reservation confirmed</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-sakura-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium dark:text-white">Updated packing checklist</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}