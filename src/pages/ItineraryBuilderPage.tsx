import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Share2, 
  Check, 
  Plane, 
  Train, 
  Car, 
  Bus, 
  Hotel, 
  Sparkles, 
  Calendar, 
  MapPin, 
  DollarSign,
  Edit3
} from 'lucide-react';
import { useTrips } from '../context/TripContext';
import type { TripStop, TripActivity } from '../types';

export const ItineraryBuilderPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { getTrip, updateTrip } = useTrips();

  const trip = tripId ? getTrip(tripId) : null;

  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals state
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showEditTransportModal, setShowEditTransportModal] = useState(false);
  const [showEditLodgingModal, setShowEditLodgingModal] = useState(false);

  // New Stop inputs
  const [newCityName, setNewCityName] = useState('');
  const [newCountryName, setNewCountryName] = useState('India');
  const [stopArrival, setStopArrival] = useState('');
  const [stopDeparture, setStopDeparture] = useState('');
  const [stopTransportCost, setStopTransportCost] = useState(0);
  const [stopAccommodationCost, setStopAccommodationCost] = useState(0);

  // Transport edit inputs
  const [transportMode, setTransportMode] = useState<'flight' | 'train' | 'car' | 'bus' | 'other'>('flight');
  const [transportNotes, setTransportNotes] = useState('');
  const [transportCost, setTransportCost] = useState(0);

  // Lodging edit inputs
  const [hotelName, setHotelName] = useState('');
  const [hotelCost, setHotelCost] = useState(0);
  const [hotelNights, setHotelNights] = useState(1);
  const [hotelBooked, setHotelBooked] = useState(false);

  // New Activity inputs
  const [actTitle, setActTitle] = useState('');
  const [actCost, setActCost] = useState(0);
  const [actDay, setActDay] = useState(1);
  const [actTime, setActTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [actCategory, setActCategory] = useState<'sightseeing' | 'food' | 'adventure' | 'culture' | 'shopping' | 'nature'>('sightseeing');

  if (!trip) {
    return (
      <div className="text-center py-20">
        <h2 className="text-sm font-semibold text-zinc-100 mb-1">Trip Not Found</h2>
        <p className="text-xs text-zinc-400 mb-4">The requested itinerary does not exist.</p>
        <Link to="/trips" className="px-3 py-1.5 bg-zinc-800 rounded-lg text-zinc-200 text-xs font-medium">
          Back to Trips
        </Link>
      </div>
    );
  }

  const currentStop = trip.stops && trip.stops.length > 0 ? trip.stops[activeStopIndex] || trip.stops[0] : null;
  const currencySymbol = (trip.currency === 'INR' || !trip.currency) ? '₹' : trip.currency;

  // Real-time calculation of all budget pillars across all stops
  const transportTotal = trip.stops.reduce((sum, s) => sum + Number(s.transportCost || 0), 0);
  const accommodationTotal = trip.stops.reduce((sum, s) => sum + Number(s.accommodation?.cost || 0), 0);
  const activitiesTotal = trip.stops.reduce((sum, s) => 
    sum + (s.activities || []).reduce((aSum, a) => aSum + Number(a.cost || 0), 0), 0
  );
  
  const calculatedTotal = transportTotal + accommodationTotal + activitiesTotal;
  const totalBudget = Number(trip.totalBudget || 0);
  const remainingBudget = totalBudget - calculatedTotal;
  const budgetPercentage = totalBudget > 0 ? Math.min(100, Math.round((calculatedTotal / totalBudget) * 100)) : 0;

  // --- Handlers ---
  const handleOpenEditTransport = () => {
    if (!currentStop) return;
    setTransportMode(currentStop.transportMode || 'flight');
    setTransportNotes(currentStop.transportNotes || '');
    setTransportCost(currentStop.transportCost || 0);
    setShowEditTransportModal(true);
  };

  const handleSaveTransport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStop) return;

    const updatedStops = trip.stops.map((stop, idx) => {
      if (idx === activeStopIndex) {
        return {
          ...stop,
          transportMode,
          transportNotes: transportNotes.trim(),
          transportCost: Number(transportCost) || 0
        };
      }
      return stop;
    });

    updateTrip(trip.id, { stops: updatedStops });
    setShowEditTransportModal(false);
  };

  const handleOpenEditLodging = () => {
    if (!currentStop) return;
    setHotelName(currentStop.accommodation?.name || '');
    setHotelCost(currentStop.accommodation?.cost || 0);
    setHotelNights(currentStop.accommodation?.nights || 1);
    setHotelBooked(currentStop.accommodation?.booked || false);
    setShowEditLodgingModal(true);
  };

  const handleSaveLodging = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStop) return;

    const updatedStops = trip.stops.map((stop, idx) => {
      if (idx === activeStopIndex) {
        return {
          ...stop,
          accommodation: {
            name: hotelName.trim(),
            cost: Number(hotelCost) || 0,
            nights: Number(hotelNights) || 1,
            booked: hotelBooked
          }
        };
      }
      return stop;
    });

    updateTrip(trip.id, { stops: updatedStops });
    setShowEditLodgingModal(false);
  };

  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;

    const newStop: TripStop = {
      id: 'stop_' + Math.random().toString(36).substring(2, 9),
      tripId: trip.id,
      cityId: 'city_' + newCityName.toLowerCase().replace(/\s+/g, '_'),
      cityName: newCityName.trim(),
      country: newCountryName.trim() || 'India',
      countryCode: 'IN',
      image: '',
      arrivalDate: stopArrival || trip.startDate,
      departureDate: stopDeparture || trip.endDate,
      order: trip.stops.length + 1,
      transportCost: Number(stopTransportCost) || 0,
      transportMode: 'flight',
      accommodation: {
        name: '',
        cost: Number(stopAccommodationCost) || 0,
        nights: 1,
        booked: false
      },
      activities: []
    };

    const updatedStops = [...trip.stops, newStop];
    updateTrip(trip.id, { stops: updatedStops });
    setShowAddStopModal(false);
    setNewCityName('');
    setNewCountryName('India');
    setStopTransportCost(0);
    setStopAccommodationCost(0);
    setActiveStopIndex(updatedStops.length - 1);
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim() || !currentStop) return;

    const newActivity: TripActivity = {
      id: 'act_' + Math.random().toString(36).substring(2, 9),
      cityId: currentStop.cityId,
      title: actTitle.trim(),
      description: '',
      category: actCategory,
      cost: Number(actCost) || 0,
      durationMinutes: 60,
      locationName: currentStop.cityName,
      dayNumber: Number(actDay) || 1,
      timeSlot: actTime,
      completed: false
    };

    const updatedStops = trip.stops.map((stop, idx) => {
      if (idx === activeStopIndex) {
        return {
          ...stop,
          activities: [...(stop.activities || []), newActivity]
        };
      }
      return stop;
    });

    updateTrip(trip.id, { stops: updatedStops });
    setShowAddActivityModal(false);
    setActTitle('');
    setActCost(0);
  };

  const handleRemoveActivity = (activityId: string) => {
    const updatedStops = trip.stops.map((stop, idx) => {
      if (idx === activeStopIndex) {
        return {
          ...stop,
          activities: stop.activities.filter(a => a.id !== activityId)
        };
      }
      return stop;
    });
    updateTrip(trip.id, { stops: updatedStops });
  };

  const handleRemoveStop = (stopId: string) => {
    const updatedStops = trip.stops.filter(s => s.id !== stopId);
    updateTrip(trip.id, { stops: updatedStops });
    setActiveStopIndex(0);
  };

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}/share/${trip.shareId || trip.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getTransportIcon = (mode?: string) => {
    switch (mode) {
      case 'flight': return <Plane className="w-4 h-4 text-sky-400" />;
      case 'train': return <Train className="w-4 h-4 text-emerald-400" />;
      case 'car': return <Car className="w-4 h-4 text-amber-400" />;
      case 'bus': return <Bus className="w-4 h-4 text-purple-400" />;
      default: return <Plane className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <Link to="/trips" className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>My Trips</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{trip.title}</h1>
          <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
            <span>{trip.startDate} – {trip.endDate}</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Target Budget: {currencySymbol} {totalBudget.toLocaleString('en-IN')}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition-colors border border-zinc-750 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{copiedLink ? 'Link Copied' : 'Share Itinerary'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Stops List & Comprehensive Budget Summary */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Stops Selector */}
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Stops & Cities ({trip.stops.length})</span>
              </h2>
              <button
                onClick={() => setShowAddStopModal(true)}
                className="inline-flex items-center gap-1 text-xs text-zinc-200 hover:text-white font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stop</span>
              </button>
            </div>

            {trip.stops.length === 0 ? (
              <div className="text-center py-6 text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                No stops added. Click "+ Add Stop" to add a destination.
              </div>
            ) : (
              <div className="space-y-2">
                {trip.stops.map((stop, idx) => {
                  const stopCost = Number(stop.transportCost || 0) + Number(stop.accommodation?.cost || 0) + 
                    (stop.activities || []).reduce((sum, a) => sum + Number(a.cost || 0), 0);

                  return (
                    <div
                      key={stop.id}
                      onClick={() => setActiveStopIndex(idx)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        activeStopIndex === idx
                          ? 'bg-zinc-800 border-zinc-650 text-zinc-100 shadow-sm ring-1 ring-emerald-500/20'
                          : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="font-bold text-zinc-200 truncate flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400">
                            {idx + 1}
                          </span>
                          <span>{stop.cityName}</span>
                          {stop.country && <span className="text-[11px] font-normal text-zinc-500">({stop.country})</span>}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-2">
                          <span>{stop.activities?.length || 0} activities</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">{currencySymbol} {stopCost.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove stop ${stop.cityName}?`)) {
                            handleRemoveStop(stop.id);
                          }
                        }}
                        className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors rounded-md hover:bg-zinc-900"
                        title="Delete stop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Real-time Multi-Category Budget Summary Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3.5 shadow-md text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Budget Summary</span>
              </h3>
              <span className="text-[11px] font-semibold text-zinc-400">{budgetPercentage}% used</span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  budgetPercentage > 100 ? 'bg-red-500' :
                  budgetPercentage > 85 ? 'bg-amber-500' :
                  'bg-emerald-400'
                }`}
                style={{ width: `${budgetPercentage}%` }}
              />
            </div>

            {/* Transport Total */}
            <div className="flex items-center justify-between py-1.5 text-zinc-400 border-b border-zinc-850">
              <span className="flex items-center gap-2">
                <Plane className="w-3.5 h-3.5 text-sky-400" />
                <span>Transport (Flights/Trains/Cabs)</span>
              </span>
              <span className="font-bold text-zinc-100">{currencySymbol} {transportTotal.toLocaleString('en-IN')}</span>
            </div>

            {/* Lodging Total */}
            <div className="flex items-center justify-between py-1.5 text-zinc-400 border-b border-zinc-850">
              <span className="flex items-center gap-2">
                <Hotel className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lodging & Accommodations</span>
              </span>
              <span className="font-bold text-zinc-100">{currencySymbol} {accommodationTotal.toLocaleString('en-IN')}</span>
            </div>

            {/* Activities Total */}
            <div className="flex items-center justify-between py-1.5 text-zinc-400 border-b border-zinc-850">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Activities & Experiences</span>
              </span>
              <span className="font-bold text-zinc-100">{currencySymbol} {activitiesTotal.toLocaleString('en-IN')}</span>
            </div>

            {/* Total Estimated vs Target */}
            <div className="pt-2 flex items-center justify-between font-bold text-zinc-100">
              <span>Total Estimated</span>
              <div className="text-right">
                <span className="text-sm text-emerald-400">{currencySymbol} {calculatedTotal.toLocaleString('en-IN')}</span>
                <span className="text-zinc-500 font-normal text-[11px] block">of {currencySymbol} {totalBudget.toLocaleString('en-IN')} target</span>
              </div>
            </div>

            {/* Remaining budget badge */}
            <div className={`p-2 rounded-xl text-center text-[11px] font-semibold border ${
              remainingBudget >= 0 
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-900/60'
                : 'bg-red-950/40 text-red-300 border-red-900/60'
            }`}>
              {remainingBudget >= 0 
                ? `Remaining: ${currencySymbol} ${remainingBudget.toLocaleString('en-IN')}`
                : `Over Budget by: ${currencySymbol} ${Math.abs(remainingBudget).toLocaleString('en-IN')}`}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Active Stop Management (Transport + Lodging + Activities) */}
        <div className="lg:col-span-8 space-y-5">
          {currentStop ? (
            <div className="space-y-5">
              
              {/* Active Stop Header */}
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-bold text-zinc-300 uppercase tracking-wider">
                      Stop {activeStopIndex + 1}
                    </span>
                    <h2 className="text-lg font-bold text-white">
                      {currentStop.cityName} {currentStop.country ? `— ${currentStop.country}` : ''}
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{currentStop.arrivalDate} to {currentStop.departureDate}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddActivityModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Activity</span>
                  </button>
                </div>
              </div>

              {/* TWO-COLUMN PILLARS: TRANSPORT & LODGING FOR THIS STOP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. TRANSPORT PILLAR CARD */}
                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition-colors shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                        {getTransportIcon(currentStop.transportMode)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Transport to Stop</h4>
                        <span className="text-[11px] text-zinc-400 capitalize">
                          {currentStop.transportMode || 'Flight / Transit'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleOpenEditTransport}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit transport"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-850 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 text-[11px]">Cost Allocation</span>
                      <span className="font-bold text-white">
                        {currencySymbol} {Number(currentStop.transportCost || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    {currentStop.transportNotes && (
                      <p className="text-[11px] text-zinc-400 truncate pt-0.5">
                        {currentStop.transportNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. LODGING / ACCOMMODATION PILLAR CARD */}
                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition-colors shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400">
                        <Hotel className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Lodging & Stay</h4>
                        <span className="text-[11px] text-zinc-400">
                          {currentStop.accommodation?.name || 'Hotel / Resort'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleOpenEditLodging}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit lodging"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-850 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 text-[11px]">
                        {currentStop.accommodation?.nights || 1} Nights Stay
                      </span>
                      <span className="font-bold text-white">
                        {currencySymbol} {Number(currentStop.accommodation?.cost || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        currentStop.accommodation?.booked 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80' 
                          : 'bg-zinc-900 text-zinc-400'
                      }`}>
                        {currentStop.accommodation?.booked ? 'Booked ✅' : 'Planned ⏳'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* 3. ACTIVITIES SECTION FOR ACTIVE STOP */}
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-850">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Scheduled Activities in {currentStop.cityName}</span>
                  </h3>
                  <span className="text-xs text-zinc-400">
                    {currentStop.activities?.length || 0} Planned
                  </span>
                </div>

                {currentStop.activities && currentStop.activities.length > 0 ? (
                  <div className="space-y-2.5">
                    {currentStop.activities.map((act) => (
                      <div
                        key={act.id}
                        className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/90 hover:border-zinc-700 flex items-center justify-between text-xs transition-colors shadow-xs"
                      >
                        <div className="space-y-1">
                          <span className="font-bold text-zinc-100 text-xs">{act.title}</span>
                          <div className="text-zinc-400 text-[11px] flex items-center gap-2">
                            <span className="bg-zinc-900 px-2 py-0.5 rounded text-zinc-300 border border-zinc-800">
                              Day {act.dayNumber}
                            </span>
                            <span className="capitalize text-zinc-400">{act.timeSlot}</span>
                            <span>•</span>
                            <span className="capitalize text-zinc-400">{act.category}</span>
                            <span>•</span>
                            <span className="font-semibold text-emerald-400">
                              {currencySymbol} {Number(act.cost).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveActivity(act.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-900 cursor-pointer"
                          title="Delete activity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 text-xs text-zinc-400 space-y-2">
                    <p>No activities scheduled yet for {currentStop.cityName}.</p>
                    <button
                      onClick={() => setShowAddActivityModal(true)}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                    >
                      + Add First Experience / Sightseeing
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
              <p className="text-xs text-zinc-400">Select or add a stop to view itinerary details.</p>
            </div>
          )}
        </div>

      </div>

      {/* --- MODAL 1: EDIT TRANSPORT --- */}
      {showEditTransportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleSaveTransport} className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plane className="w-4 h-4 text-sky-400" />
                <span>Configure Transport to {currentStop?.cityName}</span>
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Transport Mode
              </label>
              <select
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
              >
                <option value="flight">Flight (Airplane)</option>
                <option value="train">Train (Rail / Express)</option>
                <option value="car">Road / Cab / Self-Drive</option>
                <option value="bus">Bus / Coach</option>
                <option value="other">Other Transit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Carrier / Flight / Route Details
              </label>
              <input
                type="text"
                value={transportNotes}
                onChange={(e) => setTransportNotes(e.target.value)}
                placeholder="e.g. Indigo 6E-204 Delhi to Goa"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Transport Cost ({currencySymbol})
              </label>
              <input
                type="number"
                min={0}
                required
                value={transportCost}
                onChange={(e) => setTransportCost(Number(e.target.value))}
                placeholder="0"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowEditTransportModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-md cursor-pointer"
              >
                Save Transport
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 2: EDIT LODGING --- */}
      {showEditLodgingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleSaveLodging} className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Hotel className="w-4 h-4 text-emerald-400" />
                <span>Configure Lodging in {currentStop?.cityName}</span>
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Hotel / Resort / Stay Name
              </label>
              <input
                type="text"
                required
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                placeholder="e.g. Taj Fort Aguada Resort"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Number of Nights
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={hotelNights}
                  onChange={(e) => setHotelNights(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Total Cost ({currencySymbol})
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={hotelCost}
                  onChange={(e) => setHotelCost(Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="hotelBookedCheckbox"
                checked={hotelBooked}
                onChange={(e) => setHotelBooked(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="hotelBookedCheckbox" className="text-xs text-zinc-300 cursor-pointer">
                Already booked & confirmed
              </label>
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowEditLodgingModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-md cursor-pointer"
              >
                Save Lodging
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 3: ADD ACTIVITY --- */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleAddActivity} className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Add Activity in {currentStop?.cityName}</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Activity Title
              </label>
              <input
                type="text"
                required
                value={actTitle}
                onChange={(e) => setActTitle(e.target.value)}
                placeholder="e.g. Scuba Diving & Sunset Cruise"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={actCategory}
                  onChange={(e) => setActCategory(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
                >
                  <option value="sightseeing">Sightseeing</option>
                  <option value="food">Food & Dining</option>
                  <option value="adventure">Adventure Sports</option>
                  <option value="culture">Culture & Heritage</option>
                  <option value="shopping">Shopping / Bazaar</option>
                  <option value="nature">Nature / Beach</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Cost ({currencySymbol})
                </label>
                <input
                  type="number"
                  min={0}
                  value={actCost}
                  onChange={(e) => setActCost(Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Day Number
                </label>
                <input
                  type="number"
                  min={1}
                  value={actDay}
                  onChange={(e) => setActDay(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Time Slot
                </label>
                <select
                  value={actTime}
                  onChange={(e) => setActTime(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowAddActivityModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-md cursor-pointer"
              >
                Add Activity
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 4: ADD STOP --- */}
      {showAddStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleAddStop} className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Add Destination Stop</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  City Name
                </label>
                <input
                  type="text"
                  required
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  placeholder="e.g. Udaipur"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  State / Country
                </label>
                <input
                  type="text"
                  value={newCountryName}
                  onChange={(e) => setNewCountryName(e.target.value)}
                  placeholder="e.g. Rajasthan, India"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Arrival Date
                </label>
                <input
                  type="date"
                  value={stopArrival}
                  onChange={(e) => setStopArrival(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Departure Date
                </label>
                <input
                  type="date"
                  value={stopDeparture}
                  onChange={(e) => setStopDeparture(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Transit Cost ({currencySymbol})
                </label>
                <input
                  type="number"
                  min={0}
                  value={stopTransportCost}
                  onChange={(e) => setStopTransportCost(Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Stay Cost ({currencySymbol})
                </label>
                <input
                  type="number"
                  min={0}
                  value={stopAccommodationCost}
                  onChange={(e) => setStopAccommodationCost(Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowAddStopModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-md cursor-pointer"
              >
                Add Stop
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
