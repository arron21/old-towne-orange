<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import L from 'leaflet';
import { Compass, Navigation, Sparkles, ChevronRight, X, Star, Landmark } from 'lucide-vue-next';
import { useDistrictStore } from '../stores/districtStore';
import CategoryChips from '../components/CategoryChips.vue';
import TownHistoryModal from '../components/TownHistoryModal.vue';
import type { Business, Category } from '../types';

const router = useRouter();
const route = useRoute();
const store = useDistrictStore();

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let markersLayer: L.LayerGroup | null = null;
let userMarker: L.CircleMarker | null = null;

const selectedBusiness = ref<Business | null>(null);
const showTownHistoryModal = ref(false);

const fountainBusiness = computed(() => store.getBusinessById('plaza-square-park'));

// Category Marker Colors & Icons
function getCategoryColor(cat: Category): { bg: string; border: string; text: string } {
  switch (cat) {
    case 'dining': return { bg: '#ea580c', border: '#c2410c', text: '#ffffff' };
    case 'drinks': return { bg: '#d97706', border: '#b45309', text: '#ffffff' };
    case 'cafe': return { bg: '#854d0e', border: '#713f12', text: '#ffffff' };
    case 'shopping': return { bg: '#4d7c0f', border: '#3f6212', text: '#ffffff' };
    case 'landmark': return { bg: '#0284c7', border: '#0369a1', text: '#ffffff' };
    default: return { bg: '#ea580c', border: '#c2410c', text: '#ffffff' };
  }
}

// Special Fountain Pin at the Center of The Circle
function createFountainPin(): L.DivIcon {
  const html = `
    <div class="relative cursor-pointer group select-none flex flex-col items-center">
      <!-- Water pulse rings centered on medallion -->
      <span class="absolute top-0 w-11 h-11 bg-sky-400/50 rounded-full animate-ping pointer-events-none"></span>
      <span class="absolute -top-1 w-13 h-13 bg-amber-400/40 rounded-full animate-pulse pointer-events-none"></span>
      
      <!-- Center Emblem directly on fountain -->
      <div class="relative w-11 h-11 rounded-full bg-gradient-to-tr from-amber-600 via-citrus-600 to-sky-500 border-2 border-white shadow-xl flex items-center justify-center transform group-hover:scale-115 transition-transform duration-200">
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="#ffffff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v6" />
          <path d="M7 6a5 5 0 0 1 10 0" />
          <path d="M4 11a8 8 0 0 1 16 0" />
          <path d="M3 21h18" />
          <path d="M6 18h12" />
          <path d="M9 18v3" />
          <path d="M15 18v3" />
          <circle cx="12" cy="2" r="1" fill="#ffffff" />
        </svg>
      </div>

      <!-- Floating Title Label Pill directly beneath -->
      <div class="mt-1 px-2.5 py-0.5 bg-stone-900/90 text-amber-300 border border-amber-300/40 rounded-full text-[10px] font-bold shadow-md whitespace-nowrap backdrop-blur-xs flex items-center gap-1 group-hover:bg-citrus-900 group-hover:text-white transition-colors">
        <span>⛲ Historic Fountain</span>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-district-marker fountain-special-marker',
    html,
    iconSize: [120, 72],
    iconAnchor: [60, 22],
    popupAnchor: [0, -26]
  });
}

function createCustomPin(business: Business): L.DivIcon {
  if (business.id === 'plaza-square-park') {
    return createFountainPin();
  }

  const colors = getCategoryColor(business.category);
  const hasDeal = store.hasSpecialNow(business);

  const html = `
    <div class="relative cursor-pointer group select-none">
      ${hasDeal ? '<span class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white animate-ping"></span>' : ''}
      <div style="background-color: ${colors.bg}; border-color: ${colors.border};" class="w-9 h-9 rounded-2xl border-2 flex items-center justify-center shadow-lg transition-transform duration-200 transform group-hover:scale-110">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          ${getCategorySvgPath(business.category)}
        </svg>
      </div>
      <div style="border-top-color: ${colors.bg};" class="w-0 h-0 border-x-4 border-x-transparent border-t-6 mx-auto -mt-0.5"></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-district-marker',
    html,
    iconSize: [36, 42],
    iconAnchor: [18, 42],
    popupAnchor: [0, -44]
  });
}

function getCategorySvgPath(cat: Category): string {
  switch (cat) {
    case 'dining':
      return '<path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M6 2v10a3 3 0 0 0 3 3h1v7h2v-7h1a3 3 0 0 0 3-3V2"/>';
    case 'drinks':
      return '<path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5a2.5 2.5 0 0 0-5 0v1h5v-1z"/><path d="M5 8h14v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8z"/>';
    case 'cafe':
      return '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>';
    case 'shopping':
      return '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>';
    case 'landmark':
      return '<path d="M3 21h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="m12 2 10 5H2l10-5z"/>';
    default:
      return '<circle cx="12" cy="12" r="10"/>';
  }
}

function initMap() {
  if (!mapContainer.value) return;

  // Center on Plaza Square Fountain
  let center = store.districtCenter;
  let zoom = 17;

  // Check URL query parameters for direct centering
  if (route.query.lat && route.query.lng) {
    const lat = parseFloat(route.query.lat as string);
    const lng = parseFloat(route.query.lng as string);
    if (!isNaN(lat) && !isNaN(lng)) {
      center = [lat, lng];
      zoom = 18;
    }
  }

  map = L.map(mapContainer.value, {
    center,
    zoom,
    zoomControl: false,
    maxZoom: 19,
    minZoom: 14
  });

  // Esri World Street Map: Clean, beautiful street map without parcel house numbers, parking symbols, or POI clutter. 100% free with no API key or watermark.
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; <a href="https://www.esri.com/" target="_blank">Esri</a>',
    maxZoom: 19
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
  renderMarkers();

  // Add click listener on map to deselect bottom drawer
  map.on('click', () => {
    selectedBusiness.value = null;
  });
}

function renderMarkers() {
  if (!markersLayer || !map) return;
  markersLayer.clearLayers();

  const businesses = [...store.filteredBusinesses];

  // Ensure the Fountain on The Circle is always on the map regardless of category filter
  const fountainBiz = fountainBusiness.value;
  if (fountainBiz && !businesses.some(b => b.id === 'plaza-square-park')) {
    businesses.push(fountainBiz);
  }

  businesses.forEach((biz) => {
    const isFountain = biz.id === 'plaza-square-park';
    const icon = isFountain ? createFountainPin() : createCustomPin(biz);
    const marker = L.marker(biz.coordinates, { 
      icon,
      zIndexOffset: isFountain ? 1000 : 0
    });

    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      selectedBusiness.value = biz;
      map?.panTo(biz.coordinates, { animate: true, duration: 0.5 });
    });

    marker.addTo(markersLayer!);
  });

  // Render user location if available
  if (store.userLocation) {
    if (userMarker) {
      userMarker.setLatLng(store.userLocation);
    } else {
      userMarker = L.circleMarker(store.userLocation, {
        radius: 8,
        fillColor: '#3b82f6',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(map);
    }
  }
}

function recenterCircle() {
  if (!map) return;
  map.flyTo(store.districtCenter, 17, { duration: 0.8 });
  const fountain = fountainBusiness.value;
  if (fountain) {
    selectedBusiness.value = fountain;
  }
}

function locateUser() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        store.setUserLocation(coords);
        if (map) {
          map.flyTo(coords, 18, { duration: 0.8 });
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
      },
      { enableHighAccuracy: true }
    );
  }
}

function openBusinessDetail(biz: Business) {
  router.push(`/business/${biz.id}`);
}

function openTownHistory() {
  recenterCircle();
  showTownHistoryModal.value = true;
}

watch(
  () => [store.filteredBusinesses, store.currentDay, store.userLocation],
  () => {
    renderMarkers();
  },
  { deep: true }
);

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<template>
  <div class="relative w-full h-[calc(100vh-112px)] flex flex-col overflow-hidden">
    <!-- Top Filter Floating Bar -->
    <div class="absolute top-2 left-0 right-0 z-20 px-3 pointer-events-none">
      <div class="max-w-md mx-auto pointer-events-auto">
        <CategoryChips />
      </div>
    </div>

    <!-- Map Canvas -->
    <div ref="mapContainer" class="w-full h-full z-10" />

    <!-- Map Floating Controls (Recenter / GPS) -->
    <div class="absolute right-3.5 top-[65px] z-20 flex flex-col gap-2">
      <!-- Recenter on The Circle -->
      <button
        @click="recenterCircle"
        class="w-10 h-10 rounded-xl bg-white shadow-warm border border-stone-200/80 flex items-center justify-center text-stone-700 hover:text-citrus-700 active:scale-95 transition-all"
        title="Center on Plaza Fountain"
      >
        <Compass class="w-5 h-5 text-citrus-700" />
      </button>

      <!-- Locate Me -->
      <button
        @click="locateUser"
        class="w-10 h-10 rounded-xl bg-white shadow-warm border border-stone-200/80 flex items-center justify-center text-stone-700 hover:text-citrus-700 active:scale-95 transition-all"
        title="Find My Location"
      >
        <Navigation class="w-5 h-5" :class="store.userLocation ? 'text-blue-600 fill-blue-100' : 'text-stone-600'" />
      </button>
    </div>

    <!-- Bottom Selected Business Preview Card -->
    <transition
      enter-active-class="transition duration-300 ease-out transform"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in transform"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-if="selectedBusiness"
        class="absolute bottom-16 left-3 right-3 z-30 max-w-md mx-auto"
      >
        <div class="bg-white rounded-2xl p-3.5 shadow-warm-lg border border-stone-200/80 relative">
          <!-- Close preview button -->
          <button
            @click="selectedBusiness = null"
            class="absolute top-2.5 right-2.5 p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors z-10"
          >
            <X class="w-4 h-4" />
          </button>

          <div class="flex gap-3">
            <!-- Thumbnail -->
            <img
              :src="selectedBusiness.imageUrl"
              :alt="selectedBusiness.name"
              class="w-20 h-20 rounded-xl object-cover shrink-0"
            />

            <!-- Info -->
            <div class="flex-1 min-w-0 pr-4">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-citrus-100 text-citrus-800">
                  {{ selectedBusiness.categoryLabel }}
                </span>
                <div class="flex items-center text-xs font-bold text-stone-700">
                  <Star class="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                  <span>{{ selectedBusiness.rating }}</span>
                </div>
              </div>

              <h3 class="text-sm font-bold text-stone-900 truncate mt-1 font-serif">
                {{ selectedBusiness.name }}
              </h3>

              <p class="text-[11px] text-stone-500 truncate">
                {{ selectedBusiness.address.split(',')[0] }}
              </p>

              <!-- Special callout for Plaza Fountain -->
              <div
                v-if="selectedBusiness.id === 'plaza-square-park'"
                class="mt-1 flex items-center gap-1 text-[11px] text-amber-800 font-semibold truncate"
              >
                <Landmark class="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span class="truncate">Center of The Circle • Founded 1871</span>
              </div>

              <!-- Today's Special Pill for regular businesses -->
              <div
                v-else-if="store.hasSpecialsToday(selectedBusiness)"
                class="mt-1 flex items-center gap-1 text-[11px] text-citrus-700 font-semibold truncate"
              >
                <Sparkles class="w-3 h-3 text-citrus-600 shrink-0" />
                <span class="truncate">
                  Today: {{ selectedBusiness.specials.find(s => s.day === store.currentDay)?.title }}
                </span>
              </div>
            </div>
          </div>

          <!-- Special Action for Plaza Fountain: Town History Button -->
          <div v-if="selectedBusiness.id === 'plaza-square-park'" class="mt-2.5 pt-2 border-t border-amber-100">
            <button
              @click="openTownHistory"
              class="w-full py-2 px-3 bg-gradient-to-r from-amber-600 via-citrus-600 to-citrus-700 hover:from-amber-700 hover:to-citrus-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all mb-2"
            >
              <Sparkles class="w-3.5 h-3.5 text-amber-200" />
              <span>Explore Town Founding & Modern Aspirations</span>
              <ChevronRight class="w-4 h-4 ml-auto text-amber-200" />
            </button>
          </div>

          <!-- Standard Action Button -->
          <button
            @click="openBusinessDetail(selectedBusiness)"
            class="w-full py-2 px-3 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 active:scale-98 transition-all"
            :class="selectedBusiness.id === 'plaza-square-park' ? 'bg-stone-100 hover:bg-stone-200' : 'mt-3 bg-citrus-700 hover:bg-citrus-800 text-white'"
          >
            <span>{{ selectedBusiness.id === 'plaza-square-park' ? 'View Landmark Details & Events' : 'View Full Details & Daily Specials' }}</span>
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </transition>

    <!-- Town History Modal -->
    <TownHistoryModal
      v-if="fountainBusiness"
      :show="showTownHistoryModal"
      :business="fountainBusiness"
      @close="showTownHistoryModal = false"
      @navigate="recenterCircle"
    />
  </div>
</template>

<style>
/* Leaflet marker container cleanup */
.custom-district-marker {
  background: transparent !important;
  border: none !important;
}
</style>
