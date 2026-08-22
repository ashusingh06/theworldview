export interface DestinationItem {
  id: string;
  city: string;
  country: string;
  state: string;
  description: string;
  image: string;
  estimatedDailyCost: number;
  currency: string;
  currencySymbol: string;
  costIndex: string;
  popularity: string;
  tag: string;
  highlights: string[];
}

export interface RouteStop {
  id: string;
  city: string;
  stateOrCountry: string;
  days: number;
  dateRange: string;
  image: string;
  highlights: string[];
  coordinates: { x: number; y: number };
}

export const FEATURED_DESTINATIONS: DestinationItem[] = [
  {
    id: 'dest_goa',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    description: 'Golden sun-drenched beaches, Portuguese colonial architecture, water sports, and coastal cuisine.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&auto=format&fit=crop&q=80',
    estimatedDailyCost: 3500,
    currency: 'INR',
    currencySymbol: '₹',
    costIndex: '$$',
    popularity: '4.9 ★ (Coastal Favorite)',
    tag: 'Beaches & Coastal',
    highlights: ['Palolem & Baga Beach', 'Old Goa Cathedrals', 'Dudhsagar Waterfalls', 'Sunset Cruise & Shacks']
  },
  {
    id: 'dest_jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    description: 'The storied Pink City adorned with hilltop forts, royal palaces, vibrant bazaars, and rich Rajputana heritage.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900&auto=format&fit=crop&q=80',
    estimatedDailyCost: 2800,
    currency: 'INR',
    currencySymbol: '₹',
    costIndex: '$$',
    popularity: '4.9 ★ (Royal Heritage)',
    tag: 'Historic & Royal',
    highlights: ['Amber Fort Ascent', 'Hawa Mahal Palace', 'Johari Bazaar Spices', 'Nahargarh Fort Sunset']
  },
  {
    id: 'dest_udaipur',
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    description: 'The Venice of the East, famed for romantic lake palaces, sunset boat cruises, and Aravali hill landscapes.',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=900&auto=format&fit=crop&q=80',
    estimatedDailyCost: 3200,
    currency: 'INR',
    currencySymbol: '₹',
    costIndex: '$$$',
    popularity: '4.9 ★ (Lakes & Romance)',
    tag: 'Lakes & Heritage',
    highlights: ['Lake Pichola Boat Ride', 'City Palace Complex', 'Jag Mandir Island', 'Monsoon Palace Sunset']
  },
  {
    id: 'dest_manali',
    city: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    description: 'Snow-capped Himalayan peaks, pine-forested valleys, Solang adventure sports, and crisp mountain serenity.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&auto=format&fit=crop&q=80',
    estimatedDailyCost: 2500,
    currency: 'INR',
    currencySymbol: '₹',
    costIndex: '$$',
    popularity: '4.8 ★ (Himalayan Paradise)',
    tag: 'Mountains & Adventure',
    highlights: ['Solang Valley Paragliding', 'Atal Tunnel & Sissu Valley', 'Hadimba Devi Temple', 'Old Manali Cafés']
  },
  {
    id: 'dest_varanasi',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    description: 'One of the world’s oldest living cities, mystical ghats on the sacred Ganga, and divine evening Ganga Aarti.',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&auto=format&fit=crop&q=80',
    estimatedDailyCost: 2000,
    currency: 'INR',
    currencySymbol: '₹',
    costIndex: '$',
    popularity: '4.8 ★ (Spiritual Capital)',
    tag: 'Spiritual & Culture',
    highlights: ['Dashashwamedh Ganga Aarti', 'Sunrise Boat on Ganga', 'Kashi Vishwanath Corridor', 'Assi Ghat Morning Walk']
  },
  {
    id: 'dest_munnar',
    city: 'Munnar & Kerala',
    state: 'Kerala',
    country: 'India',
    description: 'God’s Own Country with rolling emerald tea gardens, mist-covered hills, and tranquil Alleppey backwater houseboats.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&auto=format&fit=crop&q=80',
    estimatedDailyCost: 3000,
    currency: 'INR',
    currencySymbol: '₹',
    costIndex: '$$',
    popularity: '4.9 ★ (Nature & Backwaters)',
    tag: 'Nature & Backwaters',
    highlights: ['Munnar Tea Estate Trek', 'Alleppey Houseboat Cruise', 'Eravikulam National Park', 'Traditional Ayurveda & Kathakali']
  },
  {
    id: 'dest_ladakh',
    city: 'Leh & Ladakh',
    state: 'Ladakh',
    country: 'India',
    description: 'Land of high mountain passes, crystal turquoise lakes, ancient cliffside monasteries, and starlit desert skies.',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=900&auto=format&fit=crop&q=80',
    estimatedDailyCost: 4500,
    currency: 'INR',
    currencySymbol: '₹',
    costIndex: '$$$',
    popularity: '4.9 ★ (High Altitude Adventure)',
    tag: 'High Altitude & Adventure',
    highlights: ['Pangong Tso Blue Lake', 'Nubra Valley Sand Dunes', 'Khardung La Pass', 'Thiksey Monastery']
  },
  {
    id: 'dest_rishikesh',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    country: 'India',
    description: 'World Capital of Yoga nestled in the Himalayan foothills, thrilling white-water river rafting, and scenic ghats.',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=900&auto=format&fit=crop&q=80',
    estimatedDailyCost: 2200,
    currency: 'INR',
    currencySymbol: '₹',
    costIndex: '$',
    popularity: '4.8 ★ (Yoga & Adventure)',
    tag: 'Yoga & Adventure',
    highlights: ['Ganges White Water Rafting', 'Triveni Ghat Evening Aarti', 'Beatles Ashram & Cafés', 'Neer Garh Waterfall']
  }
];

export const GOLDEN_TRIANGLE_COAST_ROUTE: RouteStop[] = [
  {
    id: 'stop_delhi',
    city: 'Delhi',
    stateOrCountry: 'National Capital Territory',
    days: 2,
    dateRange: 'Day 1 – 2',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80',
    highlights: ['Qutub Minar', 'Old Delhi Heritage Walk', 'India Gate'],
    coordinates: { x: 10, y: 30 }
  },
  {
    id: 'stop_jaipur',
    city: 'Jaipur',
    stateOrCountry: 'Rajasthan',
    days: 3,
    dateRange: 'Day 3 – 5',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&auto=format&fit=crop&q=80',
    highlights: ['Amber Fort Ascent', 'Hawa Mahal Palace', 'Bazaar Spice Trails'],
    coordinates: { x: 30, y: 45 }
  },
  {
    id: 'stop_udaipur',
    city: 'Udaipur',
    stateOrCountry: 'Rajasthan',
    days: 3,
    dateRange: 'Day 6 – 8',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=600&auto=format&fit=crop&q=80',
    highlights: ['Lake Pichola Sunset Boat', 'City Palace', 'Monsoon Palace'],
    coordinates: { x: 50, y: 35 }
  },
  {
    id: 'stop_mumbai',
    city: 'Mumbai',
    stateOrCountry: 'Maharashtra',
    days: 2,
    dateRange: 'Day 9 – 10',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
    highlights: ['Marine Drive Promenade', 'Gateway of India', 'Colaba Art District'],
    coordinates: { x: 70, y: 60 }
  },
  {
    id: 'stop_goa',
    city: 'Goa',
    stateOrCountry: 'Goa',
    days: 4,
    dateRange: 'Day 11 – 14',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80',
    highlights: ['Palolem Coastal Sunset', 'Fontainhas Heritage Walk', 'Beachside Dining'],
    coordinates: { x: 90, y: 75 }
  }
];
