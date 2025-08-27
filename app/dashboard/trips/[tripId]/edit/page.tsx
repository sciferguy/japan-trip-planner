export default function EditTripPage({ params }: { params: { tripId: string } }) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Trip</h1>
        <p>Edit trip form for {params.tripId} goes here</p>
      </div>
    )
  }