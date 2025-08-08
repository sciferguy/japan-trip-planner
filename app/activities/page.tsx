import { StubPage } from "@/components/ui/stub-page"

export default function ActivitiesPage() {
  return (
    <StubPage
      title="Activities"
      emoji="🌸"
      description="Discover and track sightseeing spots, cultural experiences, and must-visit locations."
      features={[
        "Priority ranking system for must-see vs nice-to-see locations",
        "Accurate duration estimates for each activity",
        "Completion tracking with photos and notes",
        "Seasonal recommendations (cherry blossoms, autumn leaves)",
        "Cultural experience booking (tea ceremony, cooking classes)",
        "Integration with local event calendars and festivals"
      ]}
    />
  )
}