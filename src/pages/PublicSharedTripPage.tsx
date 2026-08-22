import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Globe, Copy, Check } from 'lucide-react';
import { tripService } from '../services/tripService';

export const PublicSharedTripPage: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [copied, setCopied] = React.useState(false);

  const trip = shareId ? tripService.getTripById(shareId) : null;

  if (!trip) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
        <Globe className="w-8 h-8 text-zinc-500 mb-3" />
        <h1 className="text-base font-semibold mb-1">Itinerary Not Found</h1>
        <p className="text-zinc-500 text-xs mb-4">This shared itinerary is either private or unavailable.</p>
        <Link to="/login" className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 text-xs font-medium">
          Sign In
        </Link>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <Globe className="w-4 h-4 text-zinc-400" />
            <span>TheWorldView</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 text-xs font-medium hover:bg-white"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Title */}
        <div>
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Public Itinerary
          </span>
          <h1 className="text-2xl font-bold text-zinc-100 mt-1">{trip.title}</h1>
          <p className="text-xs text-zinc-400 mt-1">
            {trip.startDate} – {trip.endDate} • Budget: {(trip.currency === 'INR' || !trip.currency) ? '₹' : trip.currency} {Number(trip.totalBudget).toLocaleString('en-IN')}
          </p>
          {trip.description && (
            <p className="text-xs text-zinc-300 mt-2">{trip.description}</p>
          )}
        </div>

        {/* Stops */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Scheduled Stops ({trip.stops.length})
          </h2>

          {trip.stops.map((stop, idx) => (
            <div key={stop.id} className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-100">
                  {idx + 1}. {stop.cityName} {stop.country ? `(${stop.country})` : ''}
                </h3>
                <span className="text-[11px] text-zinc-500">
                  {stop.arrivalDate} – {stop.departureDate}
                </span>
              </div>

              {stop.activities && stop.activities.length > 0 && (
                <div className="pt-2 border-t border-zinc-850 space-y-1.5">
                  {stop.activities.map((act) => (
                    <div key={act.id} className="flex items-center justify-between text-xs text-zinc-400">
                      <span>• {act.title} (Day {act.dayNumber})</span>
                      <span>{(trip.currency === 'INR' || !trip.currency) ? '₹' : trip.currency} {Number(act.cost).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
