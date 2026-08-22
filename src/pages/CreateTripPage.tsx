import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';

export const CreateTripPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { createTrip } = useTrips();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [firstCity, setFirstCity] = useState('');
  const [firstCountry, setFirstCountry] = useState('');
  const [totalBudget, setTotalBudget] = useState(25000);
  const [currency, setCurrency] = useState('INR');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const cityName = firstCity.trim() || 'First Stop';
      const countryName = firstCountry.trim() || 'India';

      const newTrip = await createTrip({
        userId: currentUser?.id || 'guest',
        title: title.trim(),
        description: description.trim(),
        startDate,
        endDate,
        status: 'planning',
        isPublic: true,
        totalBudget,
        currency,
        stops: firstCity.trim() ? [
          {
            id: 'stop_' + Math.random().toString(36).substring(2, 9),
            tripId: '',
            cityId: 'city_' + cityName.toLowerCase().replace(/\s+/g, '_'),
            cityName,
            country: countryName,
            countryCode: 'IN',
            image: '',
            arrivalDate: startDate,
            departureDate: endDate,
            order: 1,
            transportCost: 0,
            accommodation: {
              name: '',
              cost: 0,
              booked: false
            },
            activities: []
          }
        ] : [],
        expenses: []
      });

      navigate(`/trips/${newTrip.id}`);
    } catch (err) {
      console.error('Failed to create trip', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back</span>
      </button>

      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Create New Trip</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Define your itinerary dates and initial destination</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Trip Name</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Rajasthan Heritage Road Trip"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 px-3 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Trip Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Exploring royal forts, desert camp, and sunset boat rides..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Start Date</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">End Date</label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">First Destination City</label>
            <input
              type="text"
              value={firstCity}
              onChange={(e) => setFirstCity(e.target.value)}
              placeholder="e.g. Jaipur"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 px-3 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">State / Country</label>
            <input
              type="text"
              value={firstCountry}
              onChange={(e) => setFirstCountry(e.target.value)}
              placeholder="e.g. Rajasthan, India"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 px-3 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Target Budget (₹)</label>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500"
            >
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-2.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 font-medium text-xs shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <span>Save & Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
