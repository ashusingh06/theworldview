import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [currency, setCurrency] = useState(currentUser?.preferences?.currency || 'USD');
  const [homeAirport, setHomeAirport] = useState(currentUser?.preferences?.homeAirport || '');
  const [notifications, setNotifications] = useState(currentUser?.preferences?.notifications ?? true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-lg font-semibold text-zinc-100">Settings</h1>
        <p className="text-xs text-zinc-400">Account and planning preferences</p>
      </div>

      <form onSubmit={handleSave} className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Email</label>
          <input
            type="text"
            disabled
            value={currentUser?.email || ''}
            className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-2 text-xs text-zinc-400 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Default Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Home Airport</label>
            <input
              type="text"
              value={homeAirport}
              onChange={(e) => setHomeAirport(e.target.value.toUpperCase())}
              placeholder="e.g. JFK"
              maxLength={3}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-xs text-zinc-300">Email Notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-zinc-100 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-3 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {saved && <Check className="w-3.5 h-3.5" />}
          <span>{saved ? 'Saved' : 'Save Preferences'}</span>
        </button>
      </form>
    </div>
  );
};
