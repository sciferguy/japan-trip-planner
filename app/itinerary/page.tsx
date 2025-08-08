import { StubPage } from "@/components/ui/stub-page"

export default function ItineraryPage() {
  return (
    <StubPage
      title="Itinerary Planning"
      emoji="🗾"
      description="Create detailed daily itineraries with drag-and-drop reordering and time-based scheduling for your perfect Japan trip."
      features={[
        "Daily & timeline views with intuitive drag-and-drop interface",
        "Automatic conflict detection between overlapping activities",
        "Activity linking with maps and reservations",
        "Travel time calculations between locations",
        "Collaborative planning with trip companions",
        "Export to PDF and mobile app integration"
      ]}
    />
  )
}