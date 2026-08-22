import React from 'react';
import { MapPin, Navigation, Compass, Sparkles } from 'lucide-react';

export const HeroRoadVisual: React.FC = () => {
  return (
    <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px] rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800/80 overflow-hidden shadow-2xl p-6 select-none">
      
      {/* Subtle topographic grid background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 600"
      >
        <defs>
          <pattern id="topoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-zinc-600" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topoGrid)" />
        
        {/* Subtle contour lines */}
        <path d="M-50,200 Q200,100 450,250 T900,180" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-700" strokeDasharray="4 6" />
        <path d="M-50,350 Q250,450 500,320 T900,420" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-700" strokeDasharray="4 6" />
      </svg>

      {/* Main Stylized Curved Road / Journey Path */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 800 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Road Bed outer shadow */}
        <path
          d="M 60 440 C 180 430, 220 310, 320 280 C 420 250, 460 380, 560 270 C 660 160, 680 120, 740 80"
          stroke="#18181b"
          strokeWidth="32"
          strokeLinecap="round"
        />

        {/* Road Surface */}
        <path
          d="M 60 440 C 180 430, 220 310, 320 280 C 420 250, 460 380, 560 270 C 660 160, 680 120, 740 80"
          stroke="#27272a"
          strokeWidth="20"
          strokeLinecap="round"
        />

        {/* Route glowing accent guideline */}
        <path
          d="M 60 440 C 180 430, 220 310, 320 280 C 420 250, 460 380, 560 270 C 660 160, 680 120, 740 80"
          stroke="#0ea5e9"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          strokeLinecap="round"
          className="opacity-75"
        />
      </svg>

      {/* Origin Point: Departure */}
      <div className="absolute left-8 bottom-12 z-20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-lg">
          <Navigation className="w-4 h-4 text-sky-400 rotate-45" />
        </div>
        <div>
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
            Starting Point
          </span>
          <span className="text-xs font-semibold text-zinc-200">Origin Departure</span>
        </div>
      </div>

      {/* Stop 1 Marker: Waypoint */}
      <div className="absolute left-[34%] top-[48%] -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="group relative cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-zinc-600 flex items-center justify-center text-zinc-300 shadow-md group-hover:scale-110 transition-transform">
            <span className="text-[10px] font-bold">01</span>
          </div>
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-zinc-950/90 border border-zinc-800 text-[10px] text-zinc-300 font-medium">
            Alpine Pass
          </div>
        </div>
      </div>

      {/* Highlighted Destination Card (Floating alongside the route) */}
      <div className="absolute left-[54%] top-[34%] -translate-x-1/2 -translate-y-1/2 z-30 w-64 sm:w-72 rounded-2xl bg-zinc-900/95 border border-zinc-700/80 shadow-2xl p-3.5 backdrop-blur-md">
        <div className="relative h-32 rounded-xl overflow-hidden mb-3">
          <img
            src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80"
            alt="Tokyo Destination"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-800/80 text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Featured Stop</span>
          </div>
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between">
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">Kyoto & Tokyo</h4>
              <p className="text-[10px] text-zinc-300">Japan • 5 Days</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400">$160/day</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Route Progress</span>
            <span className="text-zinc-200 font-medium">Stop 02 of 04</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div className="w-1/2 h-full bg-sky-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Stop 3 Marker: Destination Terminal */}
      <div className="absolute right-12 top-14 z-20 flex items-center gap-3">
        <div className="text-right">
          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
            Final Destination
          </span>
          <span className="text-xs font-semibold text-zinc-200">The World Unlocked</span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-600/60 flex items-center justify-center text-emerald-300 shadow-xl ring-4 ring-emerald-500/10">
          <MapPin className="w-5 h-5 text-emerald-400 animate-bounce" />
        </div>
      </div>

      {/* Floating Meta Tag: Coordinates */}
      <div className="absolute bottom-4 right-6 text-[10px] font-mono text-zinc-600 tracking-wider hidden sm:block">
        LAT 35.6762° N • LON 139.6503° E // WORLDVIEW ROUTE v2
      </div>

      {/* Compass Badge in Corner */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-400">
        <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '20s' }} />
        <span className="text-[11px] font-medium text-zinc-300">Live Journey Visualizer</span>
      </div>

    </div>
  );
};
