import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, ArrowRight, Share2, Trash2 } from 'lucide-react';
import { useTrips } from '../context/TripContext';

export const MyTripsPage: React.FC = () => {
  const { trips, deleteTrip } = useTrips();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">My Trips</h1>
          <p className="text-xs text-zinc-400">All planned itineraries</p>
        </div>
        <Link
          to="/create-trip"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Itinerary</span>
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
          <MapPin className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <h2 className="text-sm font-medium text-zinc-200 mb-1">No trips found</h2>
          <p className="text-xs text-zinc-400 mb-5 max-w-sm mx-auto">
            You haven't planned any trips yet.
          </p>
          <Link
            to="/create-trip"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Itinerary</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {trip.startDate}
                  </span>
                  <span>
                    {(trip.currency === 'INR' || !trip.currency) ? '₹' : trip.currency} {Number(trip.totalBudget || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-zinc-100">{trip.title}</h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  {trip.description || 'No description added'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                <Link
                  to={`/trips/${trip.id}`}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Edit</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <Link
                  to={`/share/${trip.shareId || trip.id}`}
                  title="Share"
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => {
                    if (confirm(`Delete trip "${trip.title}"?`)) {
                      deleteTrip(trip.id);
                    }
                  }}
                  title="Delete"
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
