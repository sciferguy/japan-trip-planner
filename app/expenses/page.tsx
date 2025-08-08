import { StubPage } from "@/components/ui/stub-page"

export default function ExpensesPage() {
  return (
    <StubPage
      title="Expense Tracking"
      emoji="💰"
      description="Private expense tracking with currency conversion and budget monitoring."
      features={[
        "Real-time USD/JPY currency conversion with live rates",
        "Category-based expense tracking (food, transport, shopping)",
        "Budget vs actual spending analysis with visual charts",
        "Receipt photo capture and OCR text extraction",
        "Shared expenses splitting for group trips",
        "Export reports for tax purposes and trip summaries"
      ]}
    />
  )
}