import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schemaPath = path.resolve('schemas/business.schema.json');
const businessesDir = path.resolve('src/data/businesses');
const eventsPath = path.resolve('src/data/events/district-events.json');

console.log('🔍 Validating Old Towne Orange District Data...\n');

if (!fs.existsSync(schemaPath)) {
  console.error(`❌ Schema file not found: ${schemaPath}`);
  process.exit(1);
}

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
const validate = ajv.compile(schema);

const files = fs.readdirSync(businessesDir).filter(f => f.endsWith('.json'));

let hasErrors = false;
let totalSpecials = 0;
let totalEvents = 0;
const seenIds = new Set<string>();

for (const file of files) {
  const filePath = path.join(businessesDir, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    // 1. Schema Validation
    const valid = validate(data);
    if (!valid) {
      hasErrors = true;
      console.error(`❌ ${file} failed schema validation:`);
      validate.errors?.forEach(err => {
        console.error(`   - ${err.instancePath || '/'}: ${err.message}`);
      });
      continue;
    }

    // 2. ID and filename match
    const expectedId = path.basename(file, '.json');
    if (data.id !== expectedId) {
      hasErrors = true;
      console.error(`❌ ${file}: Business ID "${data.id}" does not match filename "${expectedId}"`);
    }

    // 3. Duplicate ID check
    if (seenIds.has(data.id)) {
      hasErrors = true;
      console.error(`❌ Duplicate business ID detected: "${data.id}" in ${file}`);
    }
    seenIds.add(data.id);

    // 4. Coordinates boundary check for Old Towne Orange
    const [lat, lng] = data.coordinates;
    if (lat < 33.75 || lat > 33.82 || lng < -117.88 || lng > -117.82) {
      hasErrors = true;
      console.error(`❌ ${file}: Coordinates [${lat}, ${lng}] appear outside Old Towne Orange bounds (expected ~33.78, ~-117.85)`);
    }

    // 5. Specials checks
    if (Array.isArray(data.specials)) {
      totalSpecials += data.specials.length;
      data.specials.forEach((s: any, idx: number) => {
        if (s.businessId !== data.id) {
          hasErrors = true;
          console.error(`❌ ${file}: Special[${idx}] businessId "${s.businessId}" does not match parent id "${data.id}"`);
        }
        if (s.timeWindow.startHour > s.timeWindow.endHour && s.timeWindow.endHour !== 0) {
          hasErrors = true;
          console.error(`❌ ${file}: Special[${idx}] "${s.title}" has startHour (${s.timeWindow.startHour}) > endHour (${s.timeWindow.endHour})`);
        }
      });
    }

    if (Array.isArray(data.events)) {
      totalEvents += data.events.length;
    }

    const verifiedTag = data.researchMetadata?.lastVerified ? `(Verified: ${data.researchMetadata.lastVerified})` : '(Unverified)';
    console.log(`✓ ${data.name.padEnd(32)} [${data.category.padEnd(8)}] ${data.specials.length} specials  ${verifiedTag}`);
  } catch (err: any) {
    hasErrors = true;
    console.error(`❌ Error parsing ${file}: ${err.message}`);
  }
}

// 6. District Events check
if (fs.existsSync(eventsPath)) {
  try {
    const eventsRaw = JSON.parse(fs.readFileSync(eventsPath, 'utf-8'));
    if (Array.isArray(eventsRaw)) {
      totalEvents += eventsRaw.length;
      console.log(`\n✓ Validated ${eventsRaw.length} district-wide events in district-events.json`);
    }
  } catch (err: any) {
    hasErrors = true;
    console.error(`❌ Error parsing district-events.json: ${err.message}`);
  }
}

console.log('\n----------------------------------------');
if (hasErrors) {
  console.error('❌ Validation FAILED. Please resolve errors above.');
  process.exit(1);
} else {
  console.log(`✨ All ${files.length} businesses and events passed validation!`);
  console.log(`📊 Summary: ${files.length} establishments, ${totalSpecials} total specials, ${totalEvents} total events.\n`);
  process.exit(0);
}
