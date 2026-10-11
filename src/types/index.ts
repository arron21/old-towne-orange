export type DayOfWeek = 
  | 'Monday' 
  | 'Tuesday' 
  | 'Wednesday' 
  | 'Thursday' 
  | 'Friday' 
  | 'Saturday' 
  | 'Sunday';

export type Category = 
  | 'dining' 
  | 'cafe' 
  | 'shopping' 
  | 'drinks' 
  | 'landmark';

export interface TimeWindow {
  startHour: number; // 0-23
  endHour: number;   // 0-23
  label: string;     // e.g. "3:00 PM - 6:00 PM" or "All Day"
}

export interface DailySpecial {
  id: string;
  businessId: string;
  day: DayOfWeek;
  title: string;
  description: string;
  timeWindow: TimeWindow;
  discountTag?: string;
  price?: string;
}

export interface DistrictEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  exactDate?: string;
  time: string;
  location: string;
  businessId?: string;
  coordinates?: [number, number];
  category: 'festival' | 'music' | 'community' | 'food' | 'market' | 'drinks';
  isRecurringWeekly?: boolean;
  recurringDay?: DayOfWeek;
  badge?: string;
}

export interface ResearchMetadata {
  officialWebsite?: string;
  menuUrl?: string;
  instagram?: string;
  facebook?: string;
  yelpUrl?: string;
  googlePlaceId?: string;
  lastVerified: string; // YYYY-MM-DD
  verificationNotes?: string;
}

export interface TownHistoryMilestone {
  year: string;
  title: string;
  description: string;
}

export interface TownHistory {
  foundingYear: number;
  founders: string[];
  originalName: string;
  foundingStory: string;
  fountainHistory: string;
  historicDistrictStatus: string;
  modernAspirations: string;
  milestones: TownHistoryMilestone[];
  coreValues?: string[];
}

export interface Business {
  id: string;
  name: string;
  category: Category;
  categoryLabel: string;
  tagline: string;
  description: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  phone: string;
  website: string;
  hours: Record<DayOfWeek, string>;
  historicNote?: string;
  history?: TownHistory;
  imageUrl: string;
  rating: number;
  priceLevel: '$' | '$$' | '$$$' | 'Free';
  tags: string[];
  specials: DailySpecial[];
  events: DistrictEvent[];
  researchMetadata?: ResearchMetadata;
}

