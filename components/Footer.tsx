import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 mt-auto">
      {/* Quick Links Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h3 className="text-lg font-heading font-semibold text-stone-800 mb-4">
            Quick Links
          </h3>
          <nav className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <Link 
              href="/" 
              className="text-stone-600 hover:text-tea-700 hover:underline text-sm transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/itinerary" 
              className="text-stone-600 hover:text-tea-700 hover:underline text-sm transition-colors"
            >
              Itinerary
            </Link>
            <Link 
              href="/reservations" 
              className="text-stone-600 hover:text-tea-700 hover:underline text-sm transition-colors"
            >
              Reservations
            </Link>
            <Link 
              href="/checklists" 
              className="text-stone-600 hover:text-tea-700 hover:underline text-sm transition-colors"
            >
              Checklists
            </Link>
            <Link 
              href="/expenses" 
              className="text-stone-600 hover:text-tea-700 hover:underline text-sm transition-colors"
            >
              Expenses
            </Link>
            <Link 
              href="/activities" 
              className="text-stone-600 hover:text-tea-700 hover:underline text-sm transition-colors"
            >
              Activities
            </Link>
            <Link 
              href="/docs" 
              className="text-stone-600 hover:text-tea-700 hover:underline text-sm transition-colors"
            >
              Docs
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-stone-100 border-t border-stone-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-stone-600">
            <div className="mb-2 md:mb-0">
              © Creatives City. All Rights Reserved 2025
            </div>
            <div>
              <Link 
                href="/built-with-modern-technology" 
                className="text-tea-700 hover:text-tea-800 hover:underline transition-colors"
              >
                Built with Modern Technology
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}