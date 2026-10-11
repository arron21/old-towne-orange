---
name: research-business
description: Research and update an Old Towne Orange business with the latest daily specials, hours, events, and contact information.
---

# Old Towne Orange Business Research & Update Skill

Use this skill whenever you need to research, verify, or update an establishment in Old Towne Orange.

## Workflow Protocol

### Step 1: Locate Business Data
1. Check the business file: `src/data/businesses/<business-id>.json`.
2. If unsure of the business ID, run:
   ```bash
   npm run data-status
   ```
   Or search `src/data/businesses/` for the venue name.
3. Review existing fields:
   - `hours` (Monday through Sunday)
   - `specials` (7-day schedule with time windows and discount tags)
   - `events` (upcoming venue events)
   - `researchMetadata` (official website, menu URL, Instagram, lastVerified)

### Step 2: Multi-Source Web Research
Perform targeted web research to fetch the latest details:
1. **Official Website & Menu**:
   Use `read_url_content` on `researchMetadata.menuUrl` or `researchMetadata.officialWebsite`.
   Look for:
   - Current operating hours
   - Weekly lunch specials
   - Happy hour times and days
2. **Social Media & Community Highlights**:
   Use `search_web` with queries like:
   - `"<Business Name>" Orange CA "happy hour" specials`
   - `"<Business Name>" Old Towne Orange daily specials 2026`
   - `"<Business Name>" trivia live music events Orange`
3. **Verify Operating Status**:
   Confirm the business is still active and open at its address (e.g. noting if ownership or venue changed, similar to Watson's -> The Boiling Crab).

### Step 3: Update Business JSON & Precise Geocoding
1. **Precise Geocoding**:
   Run `npm run geocode <business-id>` or refer to `.agent/skills/geocode-business/SKILL.md` to ensure coordinates align exactly with OpenStreetMap building footprints.
2. Edit `src/data/businesses/<business-id>.json`:
- Maintain all required fields: `id`, `name`, `category`, `address`, `coordinates`, `hours`, `specials`, `events`.
- In `specials`:
  - Ensure every day of the week with a deal is represented.
  - Set `timeWindow`: `{ "startHour": 15, "endHour": 18, "label": "3:00 PM - 6:00 PM" }` (or `"All Day"`).
  - Add descriptive titles and discount tags (e.g., `"$6 Pints"`, `"$15 Lunch Combo"`).
- In `researchMetadata`:
  - Set `"lastVerified"` to today's date in `YYYY-MM-DD` format.
  - Set `"verificationNotes"` describing what sources confirmed the update.

### Step 4: Validate Data & Verify Build
Always run the validation and build suite:
```bash
npm run validate-data
npm run build
```
Ensure all schema and coordinates checks pass with zero errors.

### Step 5: Report Changes
Present the user with:
- Summary of what was updated (e.g. updated Tuesday special, new Friday live music event, revised weekend hours).
- Sources consulted (links to official site/social).
- Verification check status.
