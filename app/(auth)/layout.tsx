import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-50 via-stone-50 to-bamboo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-stone-800 mb-2">
            Japan Trip Planner
          </h1>
          <p className="text-stone-600">
            Plan your perfect journey to Japan
          </p>
        </div>
        {children}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-tea-600 hover:text-tea-700">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}