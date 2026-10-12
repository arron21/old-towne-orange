<script setup lang="ts">
import { ref } from 'vue';
import { Search, X } from 'lucide-vue-next';
import { useDistrictStore } from '../stores/districtStore';

const store = useDistrictStore();
const showSearch = ref(false);
</script>

<template>
  <header class="sticky top-0 z-30 bg-parchment-50/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
    <div class="max-w-2xl mx-auto px-4 py-4">
      <div class="flex items-center justify-center">
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
