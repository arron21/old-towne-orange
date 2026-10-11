# 🍊 Old Towne Orange — Historic District Companion

[![Deploy to GitHub Pages](https://github.com/arron21/old-towne-orange/actions/workflows/deploy.yml/badge.svg)](https://github.com/arron21/old-towne-orange/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)

An interactive, progressive web application (PWA) companion for exploring the historic **Old Towne Orange Plaza** district in Orange, California. Discover 24 curated local establishments, daily happy hours and specials, live upcoming events with exact calendar dates, and an interactive map powered by OpenStreetMap with zero external API key requirements.

🌐 **Live Production App:** [https://arron21.github.io/old-towne-orange/](https://arron21.github.io/old-towne-orange/)

---

## ✨ Features

- 🗺️ **Interactive District Map:**
  - Built with Leaflet and OpenStreetMap tiles (pedestrian detail, 100% free, no API keys needed).
  - High-precision ground-truth GPS pins for every venue in Old Towne.
  - Interactive popup sheet preview and instant directions via Apple Maps / Google Maps.
  - Category-based pin styling and pulsing badges for venues with active deals right now.

- 🍺 **149 Daily Specials & Happy Hours:**
  - Real-time "Happening Now" status engine matching current local time and day of week.
  - Filter specials by day (Monday through Sunday) and category (drinks, food, late night).

- 📅 **Upcoming District Events with Exact Dates:**
  - Calendar date badges with relative day labels (*Today*, *Tomorrow*, *This Sunday*, *Next Thursday*).
  - Quick timing filters (*All Upcoming*, *Today*, *This Week*).
  - Add to Google Calendar & Apple Calendar (.ics) export buttons.

- 🏪 **Modular Business Directory:**
  - 24 curated venues across dining, cafes, craft breweries, vintage antique malls, and historic landmarks.
  - Complete with operating hours, contact phone numbers, addresses, Instagram links, and curated menus.
  - Authentic local imagery and photo fallback placeholders.

- 📱 **Progressive Web App (PWA):**
  - Installable to home screens on iOS, Android, and Desktop.
  - Offline tile and data caching via Workbox service worker.
  - Standalone mobile-first UI tailored for on-the-street walking exploration.

- 🤖 **Agentic Geocoding & Business Research Skills:**
  - Built-in CLI tooling (`npm run geocode`, `npm run validate-data`) leveraging OpenStreetMap Overpass API for ground-truth district validation.

---

## 🏗️ Tech Stack

- **Framework:** [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`, TypeScript)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** [Vue Router 4](https://router.vuejs.org/) (with SPA 404 fallback for GitHub Pages)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (warm citrus & vintage parchment palette)
- **Icons:** [Lucide Vue Next](https://lucide.dev/)
- **Mapping:** [Leaflet](https://leafletjs.com/) with OpenStreetMap
- **PWA:** [Vite Plugin PWA](https://vite-pwa-org.netlify.app/) (Workbox runtime caching)
- **Build & Dev:** [Vite](https://vite.dev/), [TypeScript](https://www.typescriptlang.org/), [AJV](https://ajv.js.org/) (JSON Schema validation)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/arron21/old-towne-orange.git
cd old-towne-orange

# Install dependencies
npm install
```

### Development

```bash
# Start local development server
npm run dev
```

Visit `http://localhost:5173` to explore the application locally.

### Data Validation & Geocoding

```bash
# Validate all business JSON files against strict JSON schemas
npm run validate-data

# Check data summary & category distribution
npm run data-status

# Geocode or audit venue coordinates against OpenStreetMap
npm run geocode:audit
```

### Production Build

```bash
# Compile TypeScript, bundle with Vite, and generate SPA fallbacks
npm run build

# Preview production build locally
npm run preview
```

---

## 🚢 Deployment

Automated deployments are powered by GitHub Actions. Every push to the `main` branch:
1. Runs `npm ci`
2. Validates all business schemas via `npm run validate-data`
3. Builds the production bundle with `GITHUB_PAGES=true`
4. Deploys to GitHub Pages via `actions/deploy-pages@v4`

---

## 📜 License

MIT © [arron21](https://github.com/arron21)
