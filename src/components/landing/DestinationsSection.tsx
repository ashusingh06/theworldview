import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_DESTINATIONS, type DestinationItem } from '../../data/destinations';
import { MapPin, ArrowUpRight, Plus, Check } from 'lucide-react';

export const DestinationsSection: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedDest, setSelectedDest] = useState<DestinationItem | null>(null);

  const tags = [
    'All', 
    'Beaches & Coastal', 
    'Historic & Royal', 
    'Lakes & Heritage', 
    'Mountains & Adventure', 
    'Spiritual & Culture', 
    'Nature & Backwaters', 
    'High Altitude & Adventure', 
    'Yoga & Adventure'
  ];

  const filtered = selectedTag === 'All' 
    ? FEATURED_DESTINATIONS 
    : FEATURED_DESTINATIONS.filter(d => d.tag === selectedTag);

  return (
    <section id="destinations" className="py-20 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400 block mb-2">
              Incredible India Atlas
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Featured Indian Destinations
            </h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl">
              Add iconic stops across India directly to your upcoming itinerary with realistic daily cost estimates in Indian Rupees (₹).
            </p>
          </div>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-200 hover:text-white pb-1 border-b border-zinc-700 hover:border-zinc-400 transition-colors w-fit"
          >
            <span>Start Building Itinerary</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="group rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl"
            >
              {/* Image Container */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-zinc-950">
                <img
                  src={dest.image}
                  alt={`${dest.city}, ${dest.country}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                
                {/* Cost Badge in INR */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-zinc-950/85 backdrop-blur-xs text-[11px] font-semibold text-emerald-400 border border-zinc-800">
                  ~₹{dest.estimatedDailyCost.toLocaleString('en-IN')}/day
                </div>

                {/* Tag */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-zinc-900/80 backdrop-blur-xs text-[10px] font-medium text-zinc-300 border border-zinc-800">
                  {dest.tag}
                </div>

                {/* City & Country on Image */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {dest.city}
                  </h3>
                  <p className="text-xs text-zinc-300 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{dest.state}, {dest.country}</span>
                  </p>
                </div>
              </div>

              {/* Description & Action */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {dest.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-1 pt-1 border-t border-zinc-850">
                  <div className="text-[10px] uppercase font-semibold text-zinc-500">Highlights</div>
                  <div className="flex flex-wrap gap-1">
                    {dest.highlights.slice(0, 2).map((h, i) => (
                      <span key={i} className="text-[11px] text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedDest(dest)}
                    className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>Explore details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  </button>

                  <Link
                    to="/register"
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                    title={`Add ${dest.city} to Trip`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Detail Modal */}
      {selectedDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <img src={selectedDest.image} alt={selectedDest.city} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4">
                <h3 className="text-xl font-bold text-white">{selectedDest.city}, {selectedDest.state}</h3>
                <p className="text-xs text-emerald-400">Daily Estimate: ~₹ {selectedDest.estimatedDailyCost.toLocaleString('en-IN')}/day</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {selectedDest.description}
            </p>

            <div>
              <h4 className="text-xs font-semibold uppercase text-zinc-400 mb-2">Key Experiences</h4>
              <ul className="space-y-1.5">
                {selectedDest.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedDest(null)}
                className="flex-1 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-medium cursor-pointer"
              >
                Close
              </button>
              <Link
                to="/register"
                className="flex-1 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold text-center"
              >
                Add to My Itinerary
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
