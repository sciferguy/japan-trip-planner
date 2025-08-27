import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CalendarViewPage() {
  return (
    <>
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-3">
          <Link href="/dashboard/itinerary" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Itinerary
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Calendar View</h1>
        <div className="bg-gray-100 rounded-lg p-12 text-center text-gray-500">
          <p>Calendar view coming soon</p>
          <p className="text-sm mt-2">This will show your itinerary in a monthly calendar format</p>
        </div>
      </div>
    </>
  )
}