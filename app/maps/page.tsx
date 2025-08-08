import { StubPage } from "@/components/ui/stub-page"

export default function MapsPage() {
  return (
    <StubPage
      title="Hybrid Maps"
      emoji="🗺️"
      description="Interactive maps using Mapbox GL JS with Google Places integration and custom Japanese styling."
      features={[
        "Custom pin types for different activity categories",
        "Route planning with public transport integration",
        "Offline map support for areas with poor connectivity",
        "Google Places integration for restaurant and attraction data",
        "Real-time location sharing with trip companions",
        "Custom Japanese-inspired map styling and themes"
      ]}
    />
  )
}