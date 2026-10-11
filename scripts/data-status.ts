import fs from 'fs';
import path from 'path';

const businessesDir = path.resolve('src/data/businesses');
const files = fs.readdirSync(businessesDir).filter(f => f.endsWith('.json'));

const today = new Date();

interface BusinessSummary {
  id: string;
  name: string;
  category: string;
  specialsCount: number;
  eventsCount: number;
  lastVerified: string;
  daysAgo: number;
  freshness: string;
  primaryUrl: string;
}

const summaries: BusinessSummary[] = [];

for (const file of files) {
  const filePath = path.join(businessesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const lastVerifiedStr = data.researchMetadata?.lastVerified || '1970-01-01';
  const verifiedDate = new Date(lastVerifiedStr);
  const diffTime = Math.abs(today.getTime() - verifiedDate.getTime());
  const daysAgo = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let freshness = '🟢 Fresh';
  if (daysAgo > 90 || !data.researchMetadata?.lastVerified) {
    freshness = '🔴 Needs Research';
  } else if (daysAgo > 30) {
    freshness = '🟡 Aging';
  }

  summaries.push({
    id: data.id,
    name: data.name,
    category: data.category,
    specialsCount: data.specials?.length || 0,
    eventsCount: data.events?.length || 0,
    lastVerified: data.researchMetadata?.lastVerified || 'Never',
    daysAgo,
    freshness,
    primaryUrl: data.researchMetadata?.menuUrl || data.researchMetadata?.officialWebsite || data.website
  });
}

// Sort: most stale first
summaries.sort((a, b) => b.daysAgo - a.daysAgo);

console.log('\n========================================================================================');
console.log('🏛️  OLD TOWNE ORANGE — DISTRICT DATA FRESHNESS DASHBOARD');
console.log('========================================================================================');
console.log(
  'Name'.padEnd(30) +
  'Category'.padEnd(12) +
  'Specials'.padEnd(10) +
  'Events'.padEnd(8) +
  'Verified'.padEnd(14) +
  'Status'
);
console.log('----------------------------------------------------------------------------------------');

for (const s of summaries) {
  console.log(
    s.name.slice(0, 28).padEnd(30) +
    s.category.padEnd(12) +
    `${s.specialsCount}`.padEnd(10) +
    `${s.eventsCount}`.padEnd(8) +
    s.lastVerified.padEnd(14) +
    s.freshness
  );
}

console.log('========================================================================================');
console.log(`Total Venues: ${summaries.length} | Fresh: ${summaries.filter(s => s.daysAgo <= 30).length} | Aging: ${summaries.filter(s => s.daysAgo > 30 && s.daysAgo <= 90).length} | Needs Research: ${summaries.filter(s => s.daysAgo > 90).length}`);
console.log('\n💡 To research and update a business, ask AI:');
console.log('   "Research and update <business-name> with the latest specials and hours"');
console.log('========================================================================================\n');
