import { StubPage } from "@/components/ui/stub-page"

export default function ReservationsPage() {
  return (
    <StubPage
      title="Reservations"
      emoji="🎌"
      description="Manage all your bookings from flights to restaurants with QR code storage and reminders."
      features={[
        "Flight & hotel bookings with confirmation tracking",
        "Japan Rail Pass and regional train pass management",
        "Restaurant reservations with OpenTable integration",
        "QR code and barcode storage for easy access",
        "Automated reminder notifications before travel",
        "Integration with calendar apps and expense tracking"
      ]}
    />
  )
}