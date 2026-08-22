import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Trip } from '../types';
import { tripService } from '../services/tripService';
import { useAuth } from './AuthContext';

interface TripContextType {
  trips: Trip[];
  activeTrip: Trip | null;
  loading: boolean;
  setActiveTripId: (id: string | null) => void;
  createTrip: (data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Trip>;
  updateTrip: (tripId: string, updates: Partial<Trip>) => Promise<Trip | null>;
  deleteTrip: (tripId: string) => Promise<boolean>;
  getTrip: (tripId: string) => Trip | null;
  refreshTrips: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshTrips = () => {
    const loadedTrips = tripService.getUserTrips(currentUser?.id);
    setTrips(loadedTrips);
    if (activeTrip) {
      const refreshedActive = loadedTrips.find(t => t.id === activeTrip.id) || null;
      setActiveTrip(refreshedActive);
    }
  };

  useEffect(() => {
    setLoading(true);
    const loaded = tripService.getUserTrips(currentUser?.id);
    setTrips(loaded);
    if (loaded.length > 0 && !activeTrip) {
      setActiveTrip(loaded[0]);
    }
    setLoading(false);
  }, [currentUser]);

  const setActiveTripId = (id: string | null) => {
    if (!id) {
      setActiveTrip(null);
      return;
    }
    const found = trips.find(t => t.id === id) || tripService.getTripById(id);
    setActiveTrip(found);
  };

  const createTrip = async (data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip> => {
    const newTrip = tripService.createTrip(data);
    refreshTrips();
    setActiveTrip(newTrip);
    return newTrip;
  };

  const updateTrip = async (tripId: string, updates: Partial<Trip>): Promise<Trip | null> => {
    const updated = tripService.updateTrip(tripId, updates);
    refreshTrips();
    return updated;
  };

  const deleteTrip = async (tripId: string): Promise<boolean> => {
    const success = tripService.deleteTrip(tripId);
    refreshTrips();
    if (activeTrip?.id === tripId) {
      setActiveTrip(null);
    }
    return success;
  };

  const getTrip = (tripId: string): Trip | null => {
    return tripService.getTripById(tripId);
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        loading,
        setActiveTripId,
        createTrip,
        updateTrip,
        deleteTrip,
        getTrip,
        refreshTrips
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
};
