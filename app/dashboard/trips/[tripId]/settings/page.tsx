export default function TripSettingsPage({ params }: { params: { tripId: string } }) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Trip Settings</h1>
        <p>Edit trip name, dates, and other settings for trip {params.tripId}</p>
        {/* Add form to edit trip name and dates */}
      </div>
    )
  }