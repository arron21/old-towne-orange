<script setup lang="ts">
import { ref } from 'vue';
import { Search, X, Navigation, Calendar } from 'lucide-vue-next';
import { useDistrictStore } from '../stores/districtStore';
import type { DayOfWeek } from '../types';

const store = useDistrictStore();
const showSearch = ref(false);
const showDayPicker = ref(false);

const daysList: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

function toggleSearch() {
  showSearch.value = !showSearch.value;
  if (!showSearch.value) {
    store.searchQuery = '';
  }
}

function selectDay(day: DayOfWeek) {
  store.setDay(day);
  showDayPicker.value = false;
}

function requestLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        store.setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.warn('Geolocation denied or unavailable:', err);
      },
      { enableHighAccuracy: true }
    );
  }
}
</script>

<template>
  <header class="sticky top-0 z-30 bg-parchment-50/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs safe-top">
    <div class="max-w-2xl mx-auto px-4 py-2.5">
      <div class="flex items-center justify-between gap-3">
        <!-- Logo & Branding -->
        <router-link to="/map" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-citrus-700 to-citrus-500 flex items-center justify-center shadow-md p-1 group-active:scale-95 transition-transform">
            <svg viewBox="0 0 100 100" class="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="4 4" opacity="0.6"/>
              <!-- Fountain silhouette -->
              <path d="M50 20 Q46 32 40 40 Q48 38 50 25 Q52 38 60 40 Q54 32 50 20 Z" fill="#e0f2fe"/>
              <ellipse cx="50" cy="46" rx="14" ry="4" fill="#fef08a"/>
              <ellipse cx="50" cy="62" rx="28" ry="7" fill="#fef08a"/>
              <path d="M48 46 L46 62 L54 62 L52 46 Z" fill="#ca8a04"/>
              <rect x="42" y="66" width="16" height="14" fill="#a16207" rx="2"/>
            </svg>
          </div>
          <div>
            <h1 class="text-base font-bold tracking-tight text-stone-900 leading-tight font-serif flex items-center gap-1.5">
              Old Towne Orange
              <span class="text-[10px] uppercase font-sans font-semibold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200/60">
                1871
              </span>
            </h1>
            <p class="text-[11px] text-stone-500 font-medium">The Historic Circle Companion</p>
          </div>
        </router-link>

        <!-- Header Actions: Search Toggle, Day Picker, Geolocation -->
        <div class="flex items-center gap-1.5">
          <!-- Day of Week Pill with dropdown -->
          <div class="relative">
            <button
              @click="showDayPicker = !showDayPicker"
              class="flex items-center gap-1 text-[11px] font-semibold bg-white border border-stone-200/90 text-stone-700 px-2.5 py-1.5 rounded-lg shadow-2xs hover:bg-stone-50 transition-colors"
              title="Change active day to preview daily specials"
            >
              <Calendar class="w-3.5 h-3.5 text-citrus-600" />
              <span>{{ store.currentDay.slice(0, 3) }}</span>
            </button>

            <!-- Day Selector Dropdown -->
            <div
              v-if="showDayPicker"
              class="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div class="px-2.5 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Select Day
              </div>
              <button
                v-for="d in daysList"
                :key="d"
                @click="selectDay(d)"
                class="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-citrus-50 transition-colors"
                :class="store.currentDay === d ? 'text-citrus-700 font-bold bg-citrus-50/70' : 'text-stone-700'"
              >
                <span>{{ d }}</span>
                <span v-if="store.currentDay === d" class="w-1.5 h-1.5 rounded-full bg-citrus-600" />
              </button>
            </div>
          </div>

          <!-- Geolocation Compass -->
          <button
            @click="requestLocation"
            class="p-2 rounded-lg text-stone-600 hover:text-citrus-700 hover:bg-stone-100 transition-colors"
            title="Locate me near The Circle"
          >
            <Navigation class="w-4 h-4" :class="store.userLocation ? 'text-citrus-600 fill-citrus-100' : ''" />
          </button>

          <!-- Search toggle -->
          <button
            @click="toggleSearch"
            class="p-2 rounded-lg text-stone-600 hover:text-citrus-700 hover:bg-stone-100 transition-colors"
            title="Search directory & specials"
          >
            <X v-if="showSearch" class="w-4 h-4 text-citrus-700" />
            <Search v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Expandable Search Input -->
      <div v-if="showSearch" class="mt-2.5 pt-1 border-t border-stone-200/60 animate-in fade-in slide-in-from-top-2 duration-150">
        <div class="relative flex items-center">
          <Search class="w-4 h-4 absolute left-3 text-stone-400" />
          <input
            v-model="store.searchQuery"
            type="text"
            placeholder="Search tacos, seafood, antiques, coffee, happy hour..."
            class="w-full pl-9 pr-8 py-2 bg-white rounded-xl text-xs text-stone-800 placeholder-stone-400 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-citrus-500/30 focus:border-citrus-500 shadow-2xs"
            autofocus
          />
          <button
            v-if="store.searchQuery"
            @click="store.searchQuery = ''"
            class="absolute right-2.5 text-stone-400 hover:text-stone-600 text-xs"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
