import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-stone-100 border-t border-stone-200 mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Quick Links Section */}
        <div className="mb-8">
          <h2 className="text-xl font-heading font-bold text-stone-800 mb-6">
            Quick Links
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link 
              href="/itinerary" 
              className="text-stone-600 hover:text-tea-700 transition-colors duration-200"
            >
              Itinerary
            </Link>
            <Link 
              href="/expenses" 
              className="text-stone-600 hover:text-bamboo-700 transition-colors duration-200"
            >
              Expenses
            </Link>
            <Link 
              href="/activities" 
              className="text-stone-600 hover:text-sakura-700 transition-colors duration-200"
            >
              Activities
            </Link>
            <Link 
              href="/docs" 
              className="text-stone-600 hover:text-tea-700 transition-colors duration-200"
            >
              Docs
            </Link>
            <Link 
              href="/checklists" 
              className="text-stone-600 hover:text-bamboo-700 transition-colors duration-200"
            >
              Checklists
            </Link>
            <Link 
              href="/reservations" 
              className="text-stone-600 hover:text-sakura-700 transition-colors duration-200"
            >
              Reservations
            </Link>
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div className="border-t border-stone-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-stone-600 mb-4 md:mb-0">
              © Creatives City. All Rights Reserved 2025
            </p>
            <Link 
              href="/built-with-modern-technology"
              className="text-stone-600 hover:text-tea-700 transition-colors duration-200 underline"
            >
              Built with Modern Technology
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}