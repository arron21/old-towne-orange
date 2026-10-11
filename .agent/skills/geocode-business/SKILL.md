---
name: geocode-business
description: Get exact OpenStreetMap ground-truth coordinates for any business or address in Old Towne Orange to ensure pins render perfectly on the map.
---

# Old Towne Orange Precise Business Geocoding Skill

Use this skill whenever you need to find, verify, or fix the geographical coordinates (`[latitude, longitude]`) for any business, venue, or event in Old Towne Orange.

---

## 🎯 Purpose & Why Precision Matters

The app uses **OpenStreetMap standard tiles** in [`MapView.vue`](file:///c:/Users/arron/Documents/antigravity/cool-pasteur/src/views/MapView.vue). OpenStreetMap contains high-fidelity building polygons, courtyard layouts, and named business elements in the historic district.

- **The Problem**: Using generic block-level or street-level coordinates can place a pin across the street, in an alley, or in a parking lot rather than on the venue's actual building footprint (e.g., placing Blk Dot Coffee near North Lemon Street rather than its actual building on West Chapman Avenue).
- **The Solution**: Query the **OpenStreetMap (OSM) database directly** using the Old Towne Orange bounding box to retrieve the exact POI node or building polygon centroid (`osm_type: way` or `osm_type: node`).

---

## 🛠️ Geocoding Tools Available

### 1. Automated CLI Geocoder
Run the built-in precision geocoding tool:

```bash
# Check OSM ground truth coordinates for a business (audit mode)
npm run geocode <business-id>

# Examples:
npm run geocode blk-dot-coffee
npm run geocode culinary-dropout
npm run geocode urth-caffe-orange

# Auto-update the business JSON file with exact coordinates:
npm run geocode <business-id> -- --write
```

### 2. District-Wide Audit
To check all 20+ establishments for coordinate drift against OSM ground truth:
```bash
npm run geocode:audit
```

---

## 🔍 Manual / Multi-Source Geocoding Protocol

If a business is newly opened, not yet tagged by name in OSM, or located within a shared multi-tenant historic complex (like the 1888 Center or Orange Circle Antique Mall):

### Step 1: OpenStreetMap POI Search (Tier 1)
Query Nominatim with the Old Towne Orange bounding box:
```bash
node -e "
fetch('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent('<Business Name>, Orange, CA') + '&format=json&bounded=1&viewbox=-117.865,33.798,-117.840,33.778', { headers: { 'User-Agent': 'OldTowneOrangeApp/1.0' } })
  .then(r => r.json())
  .then(console.log);
"
```
If an `amenity`, `shop`, or `tourism` object is returned, use its `lat` and `lon` (rounded to 6 decimal places).

### Step 2: Street Address Cadastral Search (Tier 2)
If the venue name is not individually mapped in OSM, geocode its exact street address:
```bash
node -e "
fetch('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent('<Street Address>, Orange, CA 92866') + '&format=json&bounded=1&viewbox=-117.865,33.798,-117.840,33.778', { headers: { 'User-Agent': 'OldTowneOrangeApp/1.0' } })
  .then(r => r.json())
  .then(console.log);
"
```
*Note*: Expand abbreviations if needed (e.g. `191 N Orange St` -> `191 North Orange Street`).

### Step 3: Visual Alignment Against OpenStreetMap Tiles
Inspect the local tile features:
- **Plaza Square Fountain (The Circle)**: `[33.78778, -117.85278]`
- **Glassell Street**: Runs North-South through the center (`lon ≈ -117.8528`)
- **Chapman Avenue**: Runs East-West through the center (`lat ≈ 33.7878`)
- **West of Glassell (Lemon St, Cypress St, Metrolink)**: Longitude is **more negative** (`< -117.8528`, e.g. `-117.8544` to `-117.8565`)
- **East of Glassell (Orange St, Grand St)**: Longitude is **less negative** (`> -117.8528`, e.g. `-117.8519` to `-117.8500`)
- **North of Chapman (Maple, Palm, Walnut)**: Latitude is **greater** (`> 33.7878`, e.g. `33.7885` to `33.7915`)
- **South of Chapman (Almond, Culver, Palmyra)**: Latitude is **less** (`< 33.7878`, e.g. `33.7865` to `33.7845`)

---

## 📋 Coordinate Checklist Before Updating JSON
1. **Latitude**: Must be between `33.780` and `33.795` (within Old Towne Orange).
2. **Longitude**: Must be between `-117.860` and `-117.845`.
3. **East/West Sanity Check**:
   - If on **Orange Street**, longitude **must** be around `-117.8519` (east of Glassell).
   - If on **Glassell Street**, longitude **must** be around `-117.8528` - `-117.8533`.
   - If on **Lemon Street**, longitude **must** be around `-117.8550`.
   - If on **Cypress Street**, longitude **must** be around `-117.8563`.
4. **Events Synchronization**:
   - When updating a business's `coordinates`, also check its `events` array in the JSON file and update any matching venue coordinates.

---

## 🚀 Post-Update Verification
Always run:
```bash
npm run validate-data
npm run build
```
Verify on **http://127.0.0.1:4173/** that the custom pin aligns on top of the basemap building footprint.
