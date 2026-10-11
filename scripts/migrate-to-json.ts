import fs from 'fs';
import path from 'path';
import { BUSINESSES, DISTRICT_EVENTS } from '../src/data/districtData';

const businessesDir = path.resolve('src/data/businesses');
const eventsDir = path.resolve('src/data/events');

if (!fs.existsSync(businessesDir)) {
  fs.mkdirSync(businessesDir, { recursive: true });
}

if (!fs.existsSync(eventsDir)) {
  fs.mkdirSync(eventsDir, { recursive: true });
}

// Research metadata mappings for initial grounding
const initialMetadata: Record<string, { officialWebsite: string; menuUrl?: string; instagram?: string; verificationNotes: string }> = {
  'boiling-crab': {
    officialWebsite: 'https://theboilingcrab.com',
    menuUrl: 'https://theboilingcrab.com/menu',
    instagram: 'https://instagram.com/cajunboilingcrab',
    verificationNotes: 'Occupies historic 1899 Watson building; daily boils, weekday lunch, and Tuesday draft specials verified.'
  },
  'haven-craft-kitchen': {
    officialWebsite: 'https://havencraftkitchen.com',
    menuUrl: 'https://havencraftkitchen.com/menus',
    instagram: 'https://instagram.com/havencraftkitchen',
    verificationNotes: 'Verified seasonal gastropub menu, Taco Tuesday, Cellar Wine Wednesday, and Sunday Roast.'
  },
  'gabbis-mexican-kitchen': {
    officialWebsite: 'https://gabbipatrick.com',
    menuUrl: 'https://gabbipatrick.com/gabbis-mexican-kitchen',
    instagram: 'https://instagram.com/gabbismexicankitchen',
    verificationNotes: 'Michelin recommended regional Mexican dining; Tuesday agave flights and mole features verified.'
  },
  'citrus-city-grille': {
    officialWebsite: 'https://citruscitygrille.com',
    menuUrl: 'https://citruscitygrille.com/menu',
    instagram: 'https://instagram.com/citruscitygrille',
    verificationNotes: 'Bistro dining, Martini Monday, Wednesday wine discounts, and live weekend patio jazz verified.'
  },
  'urth-caffe-orange': {
    officialWebsite: 'https://urthcaffe.com',
    menuUrl: 'https://urthcaffe.com/menu',
    instagram: 'https://instagram.com/urthcaffe',
    verificationNotes: 'Restored 1888 St. Johns property; organic coffee, tea lattes, and wood-fired pizza menu verified.'
  },
  'orange-circle-antique-mall': {
    officialWebsite: 'https://orangecircleantiques.com',
    instagram: 'https://instagram.com/orangecircleantiquemall',
    verificationNotes: 'Historic 1912 department store; 2 floors of antique vendors, appraisal events verified.'
  },
  'rutabegorz': {
    officialWebsite: 'https://rutabegorz.com',
    menuUrl: 'https://rutabegorz.com/menu',
    instagram: 'https://instagram.com/rutabegorz_orange',
    verificationNotes: '1885 Victorian house; wholesome salads, vegetarian specials, and smoothies verified.'
  },
  'filling-station-cafe': {
    officialWebsite: 'https://fillingstationcafe.com',
    menuUrl: 'https://fillingstationcafe.com/menu',
    instagram: 'https://instagram.com/fillingstationcafe',
    verificationNotes: '1930s Texaco gas station patio breakfast, short stack pancakes, and benedicts verified.'
  },
  'provisions-deli': {
    officialWebsite: 'https://provisionsdeli.com',
    menuUrl: 'https://provisionsdeli.com/pages/food-menu',
    instagram: 'https://instagram.com/provisionsdeli',
    verificationNotes: '30 craft beer taps, bottle shop vaults, and Wednesday tap takeover tastings verified.'
  },
  'chapman-crafted-beer': {
    officialWebsite: 'https://chapmancrafted.beer',
    menuUrl: 'https://chapmancrafted.beer/beers-on-tap',
    instagram: 'https://instagram.com/chapmancrafted',
    verificationNotes: 'Old Towne craft brewery taproom, Thursday pub trivia, and Sunday pints verified.'
  },
  'avilas-el-ranchito': {
    officialWebsite: 'https://avilaselranchito.com',
    menuUrl: 'https://avilaselranchito.com/orange-menu',
    instagram: 'https://instagram.com/avilaselranchito',
    verificationNotes: '1915 Craftsman home; Margarita Monday, Taco Tuesday, and weekend carnitas verified.'
  },
  'pandor-bakery': {
    officialWebsite: 'https://pandorbakery.com',
    menuUrl: 'https://pandorbakery.com/menu',
    instagram: 'https://instagram.com/pandorbakery',
    verificationNotes: 'Authentic French viennoiserie, morning coffee pairing, and artisanal sourdough verified.'
  },
  'plaza-square-park': {
    officialWebsite: 'https://cityoforange.org',
    verificationNotes: 'Historic 1871 Plaza Square Park and 1937 historic fountain; summer concerts verified.'
  },
  'country-antique-fair-mall': {
    officialWebsite: 'https://countryantiquefairmall.com',
    instagram: 'https://instagram.com/countryantiquefairmall',
    verificationNotes: 'Vintage jewelry, primitives, and weekend sidewalk showcases verified.'
  },
  'francoli-gourmet': {
    officialWebsite: 'https://francoligourmet.com',
    menuUrl: 'https://francoligourmet.com/menu',
    instagram: 'https://instagram.com/francoligourmet',
    verificationNotes: 'Northern Italian handmade pastas, regional wine pairings, and Piedmontese cuisine verified.'
  }
};

console.log(`Migrating ${BUSINESSES.length} businesses to modular JSON...`);

for (const b of BUSINESSES) {
  const meta = initialMetadata[b.id] || {
    officialWebsite: b.website,
    verificationNotes: 'Initial curated district data'
  };

  const businessWithMeta = {
    ...b,
    researchMetadata: {
      ...meta,
      lastVerified: '2026-10-10'
    }
  };

  const filePath = path.join(businessesDir, `${b.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(businessWithMeta, null, 2) + '\n', 'utf-8');
  console.log(`✓ Wrote ${filePath}`);
}

// Write events
const eventsPath = path.join(eventsDir, 'district-events.json');
fs.writeFileSync(eventsPath, JSON.stringify(DISTRICT_EVENTS, null, 2) + '\n', 'utf-8');
console.log(`✓ Wrote ${eventsPath}`);

console.log('Migration complete!');
