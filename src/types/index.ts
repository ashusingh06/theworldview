export interface User {
  id: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  bio?: string;
  photoURL?: string;
  createdAt: string;
  isProfileComplete?: boolean;
  emailVerified?: boolean;
  provider?: 'password' | 'google';
  preferences?: {
    currency: string;
    homeAirport?: string;
    notifications: boolean;
  };
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  country: string;
  bio: string;
  password?: string;
  confirmPassword?: string;
  photoURL?: string;
  emailVerified?: boolean;
}

export type TripStatus = 'planning' | 'upcoming' | 'ongoing' | 'completed';

export interface TripActivity {
  id: string;
  activityId?: string;
  cityId: string;
  title: string;
  description: string;
  category: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'shopping' | 'nature';
  cost: number;
  durationMinutes: number;
  rating?: number;
  image?: string;
  locationName: string;
  dayNumber: number;
  date?: string;
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'flexible';
  notes?: string;
  completed?: boolean;
}

export interface TripStop {
  id: string;
  tripId: string;
  cityId: string;
  cityName: string;
  country: string;
  countryCode: string;
  image: string;
  arrivalDate: string;
  departureDate: string;
  order: number;
  notes?: string;
  accommodation?: {
    name: string;
    cost: number;
    booked: boolean;
    nights?: number;
  };
  transportCost?: number;
  transportMode?: 'flight' | 'train' | 'car' | 'bus' | 'other';
  transportNotes?: string;
  activities: TripActivity[];
}

export interface Expense {
  id: string;
  tripId: string;
  stopId?: string;
  category: 'transport' | 'accommodation' | 'activities' | 'meals' | 'other';
  title: string;
  amount: number;
  currency: string;
  date: string;
  notes?: string;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  status: TripStatus;
  isPublic: boolean;
  shareId?: string;
  totalBudget: number;
  currency: string;
  stops: TripStop[];
  expenses: Expense[];
  createdAt: string;
  updatedAt: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  image: string;
  description: string;
  tags: string[];
  averageDailyBudget: number;
  topActivitiesCount: number;
  latitude: number;
  longitude: number;
}

export interface ActivityCatalogItem {
  id: string;
  cityId: string;
  title: string;
  description: string;
  category: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'shopping' | 'nature';
  cost: number;
  durationMinutes: number;
  rating: number;
  reviewCount: number;
  image: string;
  locationName: string;
}
