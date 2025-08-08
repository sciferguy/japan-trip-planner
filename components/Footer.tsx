import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-white/70 backdrop-blur border-t border-stone-200">
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-lg font-heading font-semibold text-stone-800 mb-6">
          Quick Links
        </h2>
        <nav aria-label="Quick Links">
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-stone-700">
            <li><Link href="/itinerary" className="hover:text-tea-700">Itinerary</Link></li>
            <li><Link href="/expenses" className="hover:text-tea-700">Expenses</Link></li>
            <li><Link href="/activities" className="hover:text-tea-700">Activities</Link></li>
            <li><Link href="/docs" className="hover:text-tea-700">Docs</Link></li>
            <li><Link href="/checklists" className="hover:text-tea-700">Checklists</Link></li>
            <li><Link href="/reservations" className="hover:text-tea-700">Reservations</Link></li>
            <li><Link href="/dashboard" className="hover:text-tea-700">Dashboard</Link></li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-stone-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between text-sm text-stone-600">
          <span>© Creatives City. All Rights Reserved 2025</span>
          <Link href="/built-with-modern-technology" className="text-tea-700 hover:text-tea-800">
            Built with Modern Technology
          </Link>
        </div>
      </div>
    </footer>
  );
}