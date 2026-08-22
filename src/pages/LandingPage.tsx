import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { HeroRoadVisual } from '../components/landing/HeroRoadVisual';
import { JourneyPreviewSection } from '../components/landing/JourneyPreviewSection';
import { DestinationsSection } from '../components/landing/DestinationsSection';
import { JourneyRouteSection } from '../components/landing/JourneyRouteSection';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const scrollToDestinations = () => {
    const elem = document.getElementById('destinations');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 overflow-hidden">
          {/* Subtle background ambient light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-radial from-zinc-800/15 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-300 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Modern Multi-City Travel Planner</span>
            </div>

            {/* Main Headline & Supporting Subtitle */}
            <div className="max-w-3xl mb-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                Your Journey. <br />
                <span className="text-zinc-400">Your World.</span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-400 mt-5 max-w-2xl leading-relaxed">
                Plan unforgettable journeys, discover incredible destinations, and turn your travel ideas into a perfectly organized itinerary.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm transition-all shadow-md active:scale-95"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={scrollToDestinations}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-sm font-medium border border-zinc-800 transition-colors cursor-pointer"
                >
                  <span>Explore Destinations</span>
                </button>
              </div>
            </div>

            {/* Hero Visual Composition */}
            <div className="mt-8">
              <HeroRoadVisual />
            </div>

          </div>
        </section>

        {/* SECTION 2: JOURNEY PREVIEW (01 Discover, 02 Plan, 03 Explore) */}
        <JourneyPreviewSection />

        {/* SECTION 3: DESTINATIONS */}
        <DestinationsSection />

        {/* SECTION 4: JOURNEY VISUALIZATION (Delhi to Goa Route) */}
        <JourneyRouteSection />

        {/* FINAL CTA SECTION */}
        <section className="py-20 border-t border-zinc-900 relative">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="p-10 sm:p-14 rounded-3xl bg-zinc-900/60 border border-zinc-800 relative overflow-hidden shadow-2xl">
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-[11px] font-semibold text-emerald-400">
                  <Sparkles className="w-3 h-3" />
                  <span>Begin Your Story</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Ready to map out your next adventure?
                </h2>
                <p className="text-sm text-zinc-400">
                  Join travelers creating structured, multi-destination itineraries across the world.
                </p>
                <div className="pt-2">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-semibold transition-all shadow-md active:scale-95"
                  >
                    <span>Create Your Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-10 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="font-semibold text-zinc-300">TheWorldView</span>
            <span className="text-zinc-600">•</span>
            <span>Discover → Plan → Journey → Destination</span>
          </div>

          <div className="flex items-center gap-6 text-zinc-400">
            <Link to="/login" className="hover:text-zinc-200">Login</Link>
            <Link to="/register" className="hover:text-zinc-200">Register</Link>
            <Link to="/dashboard" className="hover:text-zinc-200">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
