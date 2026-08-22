import React, { useState } from 'react';
import { GOLDEN_TRIANGLE_COAST_ROUTE, type RouteStop } from '../../data/destinations';
import { ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const JourneyRouteSection: React.FC = () => {
  const [activeStop, setActiveStop] = useState<RouteStop>(GOLDEN_TRIANGLE_COAST_ROUTE[0]);

  const totalDays = GOLDEN_TRIANGLE_COAST_ROUTE.reduce((acc, s) => acc + s.days, 0);

  return (
    <section id="discover" className="py-20 border-t border-zinc-900 bg-zinc-950/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400 block mb-2">
            Multi-City Route Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            Visualized Example: Grand Heritage & Coastal Trail
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            See how TheWorldView orchestrates multi-destination journeys from Delhi down to Goa with unified dates, travel legs, and daily experiences.
          </p>
        </div>

        {/* Route Timeline & Stop Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Top: Interactive Route Path (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Horizontal Road Route Visualization */}
            <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-xl relative">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-zinc-200">14-Day Multi-City Itinerary</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">5 Cities • {totalDays} Total Days</span>
              </div>

              {/* Connected Route Map Line */}
              <div className="relative my-4">
                {/* Connecting road track */}
                <div className="absolute top-1/2 left-4 right-4 h-1.5 -translate-y-1/2 bg-zinc-800 rounded-full" />
                <div className="absolute top-1/2 left-4 w-3/4 h-1.5 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full" />

                {/* Stop Nodes */}
                <div className="relative flex items-center justify-between z-10">
                  {GOLDEN_TRIANGLE_COAST_ROUTE.map((stop, idx) => {
                    const isSelected = activeStop.id === stop.id;
                    return (
                      <button
                        key={stop.id}
                        type="button"
                        onClick={() => setActiveStop(stop)}
                        className="group flex flex-col items-center focus:outline-none cursor-pointer"
                      >
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 shadow-lg ${
                            isSelected
                              ? 'bg-zinc-100 text-zinc-950 scale-110 ring-4 ring-emerald-500/20'
                              : 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-zinc-500'
                          }`}
                        >
                          0{idx + 1}
                        </div>
                        <span className={`text-[11px] mt-2 font-medium transition-colors ${
                          isSelected ? 'text-white font-semibold' : 'text-zinc-500 group-hover:text-zinc-300'
                        }`}>
                          {stop.city}
                        </span>
                        <span className="text-[10px] text-zinc-500 hidden sm:block">
                          {stop.days}d
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Route Summary Badges */}
              <div className="mt-8 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Delhi</span>
                  <ArrowRight className="w-3 h-3 text-zinc-600" />
                  <span>Jaipur</span>
                  <ArrowRight className="w-3 h-3 text-zinc-600" />
                  <span>Udaipur</span>
                  <ArrowRight className="w-3 h-3 text-zinc-600" />
                  <span>Mumbai</span>
                  <ArrowRight className="w-3 h-3 text-zinc-600" />
                  <span>Goa</span>
                </div>
                <span className="text-emerald-400 font-medium">Auto-calculated routing</span>
              </div>
            </div>

            {/* Feature comparison bullet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-850">
                <h4 className="text-xs font-semibold text-zinc-200 mb-1">Single Seamless View</h4>
                <p className="text-[11px] text-zinc-400">No disjointed spreadsheets. All stops, dates, and transport legs stay synchronized.</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-850">
                <h4 className="text-xs font-semibold text-zinc-200 mb-1">One-Click Sharing</h4>
                <p className="text-[11px] text-zinc-400">Generate public read-only road itineraries for friends and travel companions.</p>
              </div>
            </div>

          </div>

          {/* Right / Bottom: Active Stop Card Highlight (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 overflow-hidden shadow-2xl p-6 space-y-6">
              
              {/* Header with image */}
              <div className="relative h-52 rounded-2xl overflow-hidden">
                <img
                  src={activeStop.image}
                  alt={activeStop.city}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-zinc-950/80 backdrop-blur-xs text-[10px] font-semibold text-emerald-400 border border-zinc-800">
                  {activeStop.dateRange}
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      {activeStop.city}
                    </h3>
                    <p className="text-xs text-zinc-300">{activeStop.stateOrCountry} • {activeStop.days} Days</p>
                  </div>
                </div>
              </div>

              {/* Scheduled Highlights for the active stop */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <span>Planned Experiences</span>
                  <span className="text-emerald-400">{activeStop.highlights.length} Activities</span>
                </div>

                <div className="space-y-2">
                  {activeStop.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-400">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-zinc-200">{item}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">Scheduled</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <Link
                  to="/register"
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Customize This Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
