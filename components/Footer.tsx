import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="mt-16">
      {/* Pink banner section with pill-style links */}
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-2xl shadow-zen border bg-sakura-100/80 p-8 text-center">
          <h2 className="text-lg font-heading font-semibold text-stone-800 mb-6">
            Quick Links
          </h2>
          <nav aria-label="Quick Links">
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Link href="/itinerary" className="bg-white/70 border border-stone-200 px-3 py-1 rounded-full shadow-zen text-sm hover:bg-white/90 transition-colors">
                Itinerary
              </Link>
              <Link href="/checklists" className="bg-white/70 border border-stone-200 px-3 py-1 rounded-full shadow-zen text-sm hover:bg-white/90 transition-colors">
                Checklists
              </Link>
              <Link href="/expenses" className="bg-white/70 border border-stone-200 px-3 py-1 rounded-full shadow-zen text-sm hover:bg-white/90 transition-colors">
                Expenses
              </Link>
              <Link href="/reservations" className="bg-white/70 border border-stone-200 px-3 py-1 rounded-full shadow-zen text-sm hover:bg-white/90 transition-colors">
                Reservations
              </Link>
              <Link href="/activities" className="bg-white/70 border border-stone-200 px-3 py-1 rounded-full shadow-zen text-sm hover:bg-white/90 transition-colors">
                Activities
              </Link>
              <Link href="/dashboard" className="bg-white/70 border border-stone-200 px-3 py-1 rounded-full shadow-zen text-sm hover:bg-white/90 transition-colors">
                Dashboard
              </Link>
            </div>
            <Link href="/get-started">
              <Button className="bg-tea-600 hover:bg-tea-700 text-white">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom copyright bar */}
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