import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Business, DistrictEvent, DailySpecial, Category, DayOfWeek } from '../types';
import { BUSINESSES, DISTRICT_EVENTS, DISTRICT_CENTER } from '../data/districtData';

const DAYS_OF_WEEK: DayOfWeek[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export const useDistrictStore = defineStore('district', () => {
  // Base State
  const businesses = ref<Business[]>(BUSINESSES);
  const events = ref<DistrictEvent[]>(DISTRICT_EVENTS);
  const selectedCategory = ref<Category | 'all'>('all');
  const searchQuery = ref<string>('');
  const userLocation = ref<[number, number] | null>(null);

  // Time & Day state (automatically detects real current day & hour)
  const now = new Date();
  const currentDay = ref<DayOfWeek>(DAYS_OF_WEEK[now.getDay()]);
  const currentHour = ref<number>(now.getHours());

  // Function to calculate distance from user or center in meters/miles
  function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    const R = 3958.8; // Radius of Earth in miles
    const lat1 = (coord1[0] * Math.PI) / 180;
    const lon1 = (coord1[1] * Math.PI) / 180;
    const lat2 = (coord2[0] * Math.PI) / 180;
    const lon2 = (coord2[1] * Math.PI) / 180;
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Getters
  const filteredBusinesses = computed(() => {
    let result = businesses.value;

    // Filter by Category
    if (selectedCategory.value !== 'all') {
      result = result.filter(b => b.category === selectedCategory.value);
    }

    // Filter by Search Query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      result = result.filter(b => 
        b.name.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q) ||
        b.categoryLabel.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q)) ||
        b.address.toLowerCase().includes(q) ||
        b.specials.some(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
      );
    }

    // If userLocation is available, sort by proximity
    if (userLocation.value) {
      const loc = userLocation.value;
      result = [...result].sort((a, b) => {
        return calculateDistance(loc, a.coordinates) - calculateDistance(loc, b.coordinates);
      });
    }

    return result;
  });

  // Business lookup helper
  function getBusinessById(id: string): Business | undefined {
    return businesses.value.find(b => b.id === id);
  }

  // Check if a business has specials today
  function hasSpecialsToday(business: Business): boolean {
    return business.specials.some(s => s.day === currentDay.value);
  }

  // Check if a business has a special active right now
  function hasSpecialNow(business: Business): boolean {
    return business.specials.some(s => 
      s.day === currentDay.value &&
      isSpecialActiveNow(s)
    );
  }

  // Helper to determine if a special is active at currentHour
  function isSpecialActiveNow(special: DailySpecial): boolean {
    if (special.day !== currentDay.value) return false;
    // If it's labeled All Day or full hours span
    if (special.timeWindow.label.toLowerCase().includes('all day')) return true;
    return currentHour.value >= special.timeWindow.startHour && currentHour.value < special.timeWindow.endHour;
  }

  // All specials for current selected day
  const activeSpecialsToday = computed(() => {
    const list: Array<{ special: DailySpecial; business: Business; isActiveNow: boolean; isLaterToday: boolean }> = [];
    
    for (const b of businesses.value) {
      for (const s of b.specials) {
        if (s.day === currentDay.value) {
          const activeNow = isSpecialActiveNow(s);
          const laterToday = currentHour.value < s.timeWindow.startHour && !s.timeWindow.label.toLowerCase().includes('all day');
          list.push({
            special: s,
            business: b,
            isActiveNow: activeNow,
            isLaterToday: laterToday
          });
        }
      }
    }
    return list;
  });

  const specialsHappeningNow = computed(() => {
    return activeSpecialsToday.value.filter(item => item.isActiveNow);
  });

  const specialsLaterToday = computed(() => {
    return activeSpecialsToday.value.filter(item => item.isLaterToday);
  });

  // All events aggregated (district + venues)
  const allEvents = computed(() => {
    const combined: DistrictEvent[] = [...events.value];
    for (const b of businesses.value) {
      if (b.events && b.events.length > 0) {
        for (const ev of b.events) {
          combined.push({
            ...ev,
            coordinates: ev.coordinates || b.coordinates,
            location: ev.location || b.name
          });
        }
      }
    }
    return combined;
  });

  // Set user GPS location
  function setUserLocation(coords: [number, number]) {
    userLocation.value = coords;
  }

  // Change simulated or actual day
  function setDay(day: DayOfWeek) {
    currentDay.value = day;
  }

  return {
    businesses,
    events,
    selectedCategory,
    searchQuery,
    userLocation,
    currentDay,
    currentHour,
    filteredBusinesses,
    activeSpecialsToday,
    specialsHappeningNow,
    specialsLaterToday,
    allEvents,
    districtCenter: DISTRICT_CENTER,
    getBusinessById,
    hasSpecialsToday,
    hasSpecialNow,
    isSpecialActiveNow,
    calculateDistance,
    setUserLocation,
    setDay
  };
});
