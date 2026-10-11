<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Map, X, Sparkles } from 'lucide-vue-next';
import { useDistrictStore } from '../stores/districtStore';
import CategoryChips from '../components/CategoryChips.vue';
import BusinessCard from '../components/BusinessCard.vue';

const router = useRouter();
const store = useDistrictStore();

const businesses = computed(() => {
  return store.filteredBusinesses;
});

function clearFilters() {
  store.searchQuery = '';
  store.selectedCategory = 'all';
}

function openMap() {
  router.push('/map');
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-3 pb-24">
    <!-- Category Filter Bar -->
    <div class="mb-3">
      <CategoryChips />
    </div>

    <!-- Results Header -->
    <div class="flex items-center justify-between gap-2 mb-3">
      <div class="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
        <span class="font-bold text-stone-900">{{ businesses.length }}</span>
        <span>establishments in Old Towne</span>
        <span v-if="store.selectedCategory !== 'all' || store.searchQuery" class="text-citrus-700">
          (filtered)
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="store.selectedCategory !== 'all' || store.searchQuery"
          @click="clearFilters"
          class="flex items-center gap-1 text-[11px] font-semibold text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200/80 px-2 py-1 rounded-md transition-colors"
        >
          <X class="w-3 h-3" />
          Clear
        </button>

        <button
          @click="openMap"
          class="flex items-center gap-1 text-[11px] font-semibold text-citrus-700 bg-citrus-50 hover:bg-citrus-100/80 px-2.5 py-1 rounded-md border border-citrus-200/80 transition-colors"
        >
          <Map class="w-3 h-3" />
          Map
        </button>
      </div>
    </div>

    <!-- Active Search Notice -->
    <div
      v-if="store.searchQuery"
      class="mb-3 p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-center justify-between"
    >
      <span>Searching for: <strong>"{{ store.searchQuery }}"</strong></span>
      <button @click="store.searchQuery = ''" class="text-amber-700 font-bold hover:underline">Clear</button>
    </div>

    <!-- Business Cards Grid -->
    <div v-if="businesses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      <BusinessCard
        v-for="biz in businesses"
        :key="biz.id"
        :business="biz"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white rounded-2xl p-8 border border-stone-200 text-center my-6 shadow-2xs"
    >
      <div class="w-12 h-12 rounded-full bg-citrus-50 text-citrus-600 flex items-center justify-center mx-auto mb-3">
        <Sparkles class="w-6 h-6" />
      </div>
      <h3 class="text-base font-bold text-stone-900 font-serif">No businesses match your search</h3>
      <p class="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
        Try clearing your search query or selecting a different category pill above.
      </p>
      <button
        @click="clearFilters"
        class="mt-4 px-4 py-2 bg-citrus-700 hover:bg-citrus-800 text-white rounded-xl text-xs font-semibold shadow-xs"
      >
        Show All Old Towne Businesses
      </button>
    </div>
  </div>
</template>
