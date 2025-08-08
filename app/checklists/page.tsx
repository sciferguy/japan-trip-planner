import { StubPage } from "@/components/ui/stub-page"

export default function ChecklistsPage() {
  return (
    <StubPage
      title="Personal Checklists"
      emoji="✅"
      description="Separate checklists per person with pre-populated Japan travel essentials."
      features={[
        "Comprehensive packing lists with weather considerations",
        "Document preparation checklist (passport, visa, insurance)",
        "Pre-trip shopping reminders and travel gear suggestions",
        "Individual checklists for each trip member",
        "Category organization (clothing, electronics, documents, etc.)",
        "Progress tracking and completion notifications"
      ]}
    />
  )
}