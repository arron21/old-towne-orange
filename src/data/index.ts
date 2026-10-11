import type { Business, DistrictEvent } from '../types';
import districtEventsRaw from './events/district-events.json';

export const DISTRICT_CENTER: [number, number] = [33.78778, -117.85278]; // Plaza Square Park Fountain

// Dynamically import all business JSON files in ./businesses/
// Adding, removing, or modifying any JSON file updates the app automatically
const businessModules = import.meta.glob<Business>('./businesses/*.json', {
  eager: true,
  import: 'default'
});

export const BUSINESSES: Business[] = Object.values(businessModules).map((b) => {
  if (b.imageUrl && b.imageUrl.startsWith('/')) {
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    return {
      ...b,
      imageUrl: `${cleanBase}${b.imageUrl.replace(/^\//, '')}`
    };
  }
  return b;
});
export const DISTRICT_EVENTS: DistrictEvent[] = districtEventsRaw as DistrictEvent[];

export default {
  DISTRICT_CENTER,
  BUSINESSES,
  DISTRICT_EVENTS
};
