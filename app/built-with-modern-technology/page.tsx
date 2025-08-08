import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Built with Modern Technology",
  description: "Discover the modern technologies powering Japan Trip Planner: Next.js 15, TypeScript, Supabase, Prisma, Zustand, Tailwind CSS, Mapbox GL JS, and PWA support.",
};

export default function BuiltWithModernTechnologyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-stone-800 mb-8">
        Built with Modern Technology
      </h1>

      <div className="text-stone-700">
        <p className="mb-6">
          The app is built on a modern, scalable stack to deliver a smooth planning experience.
        </p>

        <div className="flex flex-wrap gap-3">
          <span className="bg-white/70 border border-stone-200 px-3 py-1 rounded-full shadow-zen text-sm">Next.js 15</span>
          <span className="bg-white/70 border border-stone-200 px-3 py-1 rounded-full shadow-zen text-sm">TypeScript</span>
          <span className="bg-white/70 border border-stone-200 px-3 py-1 rounded-full shadow-zen text-sm">Tailwind CSS</span>
          <span className="bg-white/70 border border-stone-200 px-3 py-1 rounded-full shadow-zen text-sm">Supabase</span>
          <span className="bg-white/70 border border-stone-200 px-3 py-1 rounded-full shadow-zen text-sm">Prisma</span>
          <span className="bg-white/70 border border-stone-200 px-3 py-1 rounded-full shadow-zen text-sm">Zustand</span>
          <span className="bg-white/70 border border-stone-200 px-3 py-1 rounded-full shadow-zen text-sm">Mapbox GL JS</span>
          <span className="bg-white/70 border border-stone-200 px-3 py-1 rounded-full shadow-zen text-sm">PWA Support</span>
        </div>
      </div>
    </div>
  );
}