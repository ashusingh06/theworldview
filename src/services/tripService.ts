import type { Trip } from '../types';

const LOCAL_STORAGE_TRIPS_KEY = 'theworldview_trips_data';

export const tripService = {
  getStoredTrips(): Trip[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveTrips(trips: Trip[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(trips));
    } catch (e) {
      console.error('Failed to save trips to local storage', e);
    }
  },

  getUserTrips(userId?: string): Trip[] {
    const allTrips = this.getStoredTrips();
    if (!userId) return allTrips;
    return allTrips.filter(t => t.userId === userId);
  },

  getTripById(tripId: string): Trip | null {
    const allTrips = this.getStoredTrips();
    return allTrips.find(t => t.id === tripId || t.shareId === tripId) || null;
  },

  createTrip(tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Trip {
    const allTrips = this.getStoredTrips();
    const newTrip: Trip = {
      ...tripData,
      id: 'trip_' + Math.random().toString(36).substring(2, 9),
      shareId: 'share_' + Math.random().toString(36).substring(2, 8),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    allTrips.unshift(newTrip);
    this.saveTrips(allTrips);
    return newTrip;
  },

  updateTrip(tripId: string, updates: Partial<Trip>): Trip | null {
    const allTrips = this.getStoredTrips();
    const index = allTrips.findIndex(t => t.id === tripId);
    if (index === -1) return null;

    const updatedTrip: Trip = {
      ...allTrips[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    allTrips[index] = updatedTrip;
    this.saveTrips(allTrips);
    return updatedTrip;
  },

  deleteTrip(tripId: string): boolean {
    const allTrips = this.getStoredTrips();
    const filtered = allTrips.filter(t => t.id !== tripId);
    this.saveTrips(filtered);
    return true;
  }
};
