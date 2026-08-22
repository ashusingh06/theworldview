import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Map, 
  Wallet, 
  Check, 
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { FEATURED_DESTINATIONS, type DestinationItem } from '../data/destinations';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { trips, loading } = useTrips();
  const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(null);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = currentUser?.firstName || currentUser?.displayName?.split(' ')[0] || 'Traveler';

  // Budget calculations from real user trip data (in INR / ₹)
  const calculateBudgetStats = () => {
    if (!trips || trips.length === 0) {
      return null;
    }

    const totalPlanned = trips.reduce((acc, t) => acc + (t.totalBudget || 0), 0);
    
    // Calculate total spent from actual expenses recorded across trips
    const totalSpent = trips.reduce((acc, t) => {
      const tripExpenses = (t.expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0);
      return acc + tripExpenses;
    }, 0);

    const remaining = Math.max(0, totalPlanned - totalSpent);
    const totalDays = trips.reduce((acc, t) => {
      if (!t.startDate || !t.endDate) return acc + 1;
      const start = new Date(t.startDate).getTime();
      const end = new Date(t.endDate).getTime();
      const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
      return acc + days;
    }, 0);

    const avgDaily = totalDays > 0 ? Math.round(totalPlanned / totalDays) : 0;
    const spentPercentage = totalPlanned > 0 ? Math.min(100, Math.round((totalSpent / totalPlanned) * 100)) : 0;

    return {
      totalPlanned,
      totalSpent,
      remaining,
      avgDaily,
      spentPercentage,
      currencySymbol: '₹',
      currencyCode: 'INR'
    };
  };

  const budgetStats = calculateBudgetStats();

  return (
    <div className="space-y-10 pb-12">
      
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-emerald-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Traveler Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Ready to plan your next journey across India?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/create-trip"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Plan New Trip</span>
          </Link>
        </div>
      </div>

      {/* 2. QUICK ACTIONS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Link
          to="/create-trip"
          className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all group shadow-sm flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white">Plan New Trip</h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Create a multi-stop itinerary</p>
          </div>
        </Link>

        <Link
          to="/trips"
          className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all group shadow-sm flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-105 transition-transform">
            <Map className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white">My Trips</h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">{trips.length} saved itineraries</p>
          </div>
        </Link>

        <a
          href="#explore-destinations"
          className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all group shadow-sm flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white">Discover Cities</h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Browse Indian destinations</p>
          </div>
        </a>

        <a
          href="#explore-destinations"
          className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all group shadow-sm flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white">Explore Activities</h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Top local experiences</p>
          </div>
        </a>
      </div>

      {/* 3. YOUR JOURNEYS (UPCOMING / RECENT TRIPS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Your Journeys</span>
              <span className="text-xs font-medium text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                {trips.length}
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Manage your active and upcoming travel itineraries
            </p>
          </div>

          {trips.length > 0 && (
            <Link
              to="/trips"
              className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View all trips</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 sm:p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400 mx-auto shadow-inner">
              <Compass className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-white">Your next adventure starts here.</h3>
              <p className="text-xs text-zinc-400">
                You haven't planned any trips yet. Create your first itinerary with stops, dates, budgets in Rupees (₹), and daily activities.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/create-trip"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Plan Your First Trip</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Real User Trips Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((trip) => {
              const stopsCount = trip.stops?.length || 0;
              const activitiesCount = (trip.stops || []).reduce((acc, s) => acc + (s.activities?.length || 0), 0);
              
              const statusColors: Record<string, string> = {
                planning: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
                upcoming: 'bg-sky-950/80 text-sky-300 border-sky-800/80',
                ongoing: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
                completed: 'bg-zinc-800 text-zinc-300 border-zinc-700'
              };

              const statusBadge = statusColors[trip.status] || statusColors.planning;
              const currencySymbol = trip.currency === 'INR' || !trip.currency ? '₹' : trip.currency;

              return (
                <div
                  key={trip.id}
                  className="rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-xl group"
                >
                  {/* Card Cover */}
                  <div className="relative h-40 bg-zinc-950 overflow-hidden">
                    <img
                      src={
                        trip.coverImage ||
                        trip.stops?.[0]?.image ||
                        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80'
                      }
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border backdrop-blur-xs ${statusBadge}`}>
                      {trip.status || 'Planning'}
                    </div>

                    {/* Destinations Count */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white font-medium bg-zinc-950/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-zinc-800">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{stopsCount} {stopsCount === 1 ? 'Destination' : 'Destinations'}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {trip.title}
                      </h3>
                      
                      {/* Dates */}
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>
                          {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'Dates flexible'}
                          {trip.endDate ? ` – ${new Date(trip.endDate).toLocaleDateString()}` : ''}
                        </span>
                      </div>

                      {/* Progress info */}
                      <div className="mt-3 pt-3 border-t border-zinc-850 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>{activitiesCount} Activities scheduled</span>
                        <span className="font-semibold text-emerald-400">
                          {currencySymbol} {Number(trip.totalBudget || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/trips/${trip.id}`}
                      className="w-full py-2 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-750 text-zinc-200 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-700/60"
                    >
                      <span>View Journey</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. BUDGET HIGHLIGHTS (IN RUPEES / ₹) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Budget Highlights (INR ₹)</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Real-time financial summary in Indian Rupees across your planned itineraries
          </p>
        </div>

        {budgetStats ? (
          /* Actual Statistics from User Trips */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Total Planned Budget
              </span>
              <div className="text-2xl font-bold text-white">
                ₹ {budgetStats.totalPlanned.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-zinc-500">Across {trips.length} active journeys</div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Total Spending Recorded
              </span>
              <div className="text-2xl font-bold text-sky-400">
                ₹ {budgetStats.totalSpent.toLocaleString('en-IN')}
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-500 rounded-full transition-all"
                  style={{ width: `${budgetStats.spentPercentage}%` }}
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Remaining Budget
              </span>
              <div className="text-2xl font-bold text-emerald-400">
                ₹ {budgetStats.remaining.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-emerald-500/80">Available allocation</div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Average Daily Cost
              </span>
              <div className="text-2xl font-bold text-zinc-200">
                ₹ {budgetStats.avgDaily.toLocaleString('en-IN')}/day
              </div>
              <div className="text-[11px] text-zinc-500">Estimated daily pace</div>
            </div>
          </div>
        ) : (
          /* Empty / Default State for budget */
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-2">
            <p className="text-xs text-zinc-300 font-medium">No budget data available yet</p>
            <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
              Once you create trips with target budgets in Rupees (₹) and record expense items (transport, stay, activities), your summary will automatically populate here.
            </p>
          </div>
        )}
      </section>

      {/* 5. RECOMMENDED DESTINATIONS (INDIAN CATALOG) */}
      <section id="explore-destinations" className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Explore Destinations (India)</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Curated Indian destinations with daily cost estimates in Rupees (₹) and key highlights
            </p>
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED_DESTINATIONS.slice(0, 6).map((dest) => (
            <div
              key={dest.id}
              className="rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-md group"
            >
              {/* Image & Badges */}
              <div className="relative h-44 bg-zinc-950 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                
                {/* Cost Index Badge in INR */}
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md bg-zinc-950/85 backdrop-blur-xs text-[11px] font-semibold text-emerald-400 border border-zinc-800">
                  {dest.costIndex} • ~₹{dest.estimatedDailyCost.toLocaleString('en-IN')}/d
                </div>

                {/* Popularity Badge */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-zinc-900/80 backdrop-blur-xs text-[10px] font-medium text-zinc-300 border border-zinc-800">
                  {dest.popularity}
                </div>

                {/* City & State */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {dest.city}
                  </h3>
                  <p className="text-xs text-zinc-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{dest.state}, {dest.country}</span>
                  </p>
                </div>
              </div>

              {/* Description & Explore */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {dest.description}
                </p>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1">
                  {dest.highlights.slice(0, 2).map((h, idx) => (
                    <span key={idx} className="text-[10px] text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80">
                      {h}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedDestination(dest)}
                    className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>Explore details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  </button>

                  <Link
                    to="/create-trip"
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 transition-colors"
                    title={`Create Trip to ${dest.city}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Destination Modal */}
      {selectedDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="relative h-48 rounded-2xl overflow-hidden mb-2">
              <img src={selectedDestination.image} alt={selectedDestination.city} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4">
                <h3 className="text-xl font-bold text-white">{selectedDestination.city}, {selectedDestination.state}</h3>
                <p className="text-xs text-emerald-400">{selectedDestination.costIndex} • Estimated ~₹ {selectedDestination.estimatedDailyCost.toLocaleString('en-IN')}/day</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {selectedDestination.description}
            </p>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Recommended Highlights</h4>
              <div className="space-y-1.5">
                {selectedDestination.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-950 p-2 rounded-xl border border-zinc-850">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedDestination(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-medium cursor-pointer"
              >
                Close
              </button>
              <Link
                to="/create-trip"
                className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Plan Trip to {selectedDestination.city}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
