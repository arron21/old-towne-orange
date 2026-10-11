import fs from 'fs';
import path from 'path';

interface NominatimResult {
  place_id: number;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  name: string;
  display_name: string;
  boundingbox: string[];
}

interface GeocodeMatch {
  lat: number;
  lng: number;
  osmType: string;
  osmId: number;
  name: string;
  displayName: string;
  matchType: 'poi' | 'address';
}

// Bounding box for Old Towne Orange Historic District
const OLD_TOWNE_VIEWBOX = '-117.865,33.798,-117.840,33.778';

/**
 * Query Nominatim OpenStreetMap API with Old Towne Orange spatial bounding box
 */
async function queryNominatim(query: string): Promise<NominatimResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query
  )}&format=json&addressdetails=1&bounded=1&viewbox=${OLD_TOWNE_VIEWBOX}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'OldTowneOrangeApp-Geocode/1.0 (contact: arron@local)'
      }
    });

    if (!res.ok) {
      return [];
    }

    const data = (await res.json()) as NominatimResult[];
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
}

/**
 * Calculates distance in meters between two lat/lng coordinates (Haversine formula)
 */
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Two-tier geocoding strategy:
 * Tier 1: Search POI by business name inside Old Towne bounding box.
 * Tier 2: Search exact street address inside Old Towne bounding box.
 */
export async function geocodeBusiness(name: string, address: string): Promise<GeocodeMatch | null> {
  // Clean names (remove trailing modifiers like '+Bar' or '& Tea' if needed)
  const cleanName = name.replace(/\s*(?:&|\+)\s*(?:Bar|Tea|Bottle Shop|Cafe|Kitchen).*/i, '').trim();

  // Tier 1: Try exact or cleaned business name
  const nameQueries = [`${name}, Orange, CA`];
  if (cleanName !== name && cleanName.length > 2) {
    nameQueries.push(`${cleanName}, Orange, CA`);
  }

  for (const q of nameQueries) {
    const results = await queryNominatim(q);
    const poiMatch = results.find(
      r => r.class === 'amenity' || r.class === 'shop' || r.class === 'tourism' || r.class === 'leisure'
    );

    if (poiMatch) {
      return {
        lat: parseFloat(parseFloat(poiMatch.lat).toFixed(6)),
        lng: parseFloat(parseFloat(poiMatch.lon).toFixed(6)),
        osmType: poiMatch.osm_type,
        osmId: poiMatch.osm_id,
        name: poiMatch.name || name,
        displayName: poiMatch.display_name,
        matchType: 'poi'
      };
    }
  }

  // Tier 2: Search exact street address
  const addrQuery = `${address}`;
  const addrResults = await queryNominatim(addrQuery);
  if (addrResults.length > 0) {
    const top = addrResults[0];
    return {
      lat: parseFloat(parseFloat(top.lat).toFixed(6)),
      lng: parseFloat(parseFloat(top.lon).toFixed(6)),
      osmType: top.osm_type,
      osmId: top.osm_id,
      name: top.name || address,
      displayName: top.display_name,
      matchType: 'address'
    };
  }

  return null;
}

// -------------------------------------------------------------
// CLI Execution
// -------------------------------------------------------------
async function run() {
  const args = process.argv.slice(2);
  const isAudit = args.includes('--audit');
  const shouldWrite = args.includes('--write');
  const targetId = args.find(a => !a.startsWith('--'));

  const businessesDir = path.resolve('src/data/businesses');
  const files = fs.readdirSync(businessesDir).filter(f => f.endsWith('.json'));

  console.log('📍 Old Towne Orange — Precise OSM Geocoding Utility\n');

  if (targetId) {
    const filename = targetId.endsWith('.json') ? targetId : `${targetId}.json`;
    const filePath = path.join(businessesDir, filename);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ Business file not found: ${filePath}`);
      process.exit(1);
    }

    const business = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`Auditing: ${business.name} (${business.address})`);
    console.log(`Current coordinates: [${business.coordinates.join(', ')}]`);

    const match = await geocodeBusiness(business.name, business.address);
    if (!match) {
      console.error(`❌ Could not locate coordinates for "${business.name}" in Old Towne.`);
      process.exit(1);
    }

    const dist = getDistanceMeters(business.coordinates[0], business.coordinates[1], match.lat, match.lng);

    console.log(`\n🎯 OSM Ground Truth (${match.matchType.toUpperCase()} match):`);
    console.log(`   Coordinates: [${match.lat}, ${match.lng}]`);
    console.log(`   OSM Element: ${match.osmType}/${match.osmId}`);
    console.log(`   Found As:    ${match.displayName}`);
    console.log(`   Displacement from current: ${dist} meters`);

    if (shouldWrite) {
      business.coordinates = [match.lat, match.lng];
      if (Array.isArray(business.events)) {
        business.events.forEach((evt: any) => {
          if (evt.coordinates) {
            evt.coordinates = [match.lat, match.lng];
          }
        });
      }
      fs.writeFileSync(filePath, JSON.stringify(business, null, 2) + '\n', 'utf-8');
      console.log(`\n💾 Successfully wrote new coordinates to ${filename}!`);
    } else {
      console.log(`\n💡 Run with --write to save new coordinates to ${filename}.`);
    }

    return;
  }

  // Audit all files
  console.log(`Auditing all ${files.length} establishments against OpenStreetMap basemap...\n`);
  console.log('---------------------------------------------------------------------------------------------------');
  console.log('Business Name                  Address                     Current Coords       OSM Coords           Δ (m)   Type');
  console.log('---------------------------------------------------------------------------------------------------');

  for (const file of files) {
    const filePath = path.join(businessesDir, file);
    const business = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const match = await geocodeBusiness(business.name, business.address);
    if (!match) {
      console.log(`⚠️ ${business.name.padEnd(30)} ${business.address.padEnd(27)} NOT FOUND`);
      continue;
    }

    const dist = getDistanceMeters(business.coordinates[0], business.coordinates[1], match.lat, match.lng);
    const currentStr = `[${business.coordinates[0].toFixed(4)}, ${business.coordinates[1].toFixed(4)}]`;
    const osmStr = `[${match.lat.toFixed(4)}, ${match.lng.toFixed(4)}]`;

    const statusTag = dist > 25 ? `⚠️ ${dist}m` : `✓ ${dist}m`;

    console.log(
      `${business.name.padEnd(30)} ${business.address.slice(0, 26).padEnd(27)} ${currentStr.padEnd(20)} ${osmStr.padEnd(20)} ${statusTag.padEnd(7)} [${match.matchType}]`
    );

    if (shouldWrite && dist > 5) {
      business.coordinates = [match.lat, match.lng];
      if (Array.isArray(business.events)) {
        business.events.forEach((evt: any) => {
          if (evt.coordinates) {
            evt.coordinates = [match.lat, match.lng];
          }
        });
      }
      fs.writeFileSync(filePath, JSON.stringify(business, null, 2) + '\n', 'utf-8');
    }

    // Rate-limit to be respectful of OSM Nominatim
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('---------------------------------------------------------------------------------------------------');
  if (shouldWrite) {
    console.log('✨ All coordinates updated to match OpenStreetMap ground truth!');
  } else {
    console.log('💡 Tip: Run "npm run geocode -- --write" to auto-align all coordinates to OSM ground truth.');
  }
}

if (process.argv[1]?.includes('geocode-business')) {
  run().catch(err => {
    console.error('Error running geocode script:', err);
    process.exit(1);
  });
}
