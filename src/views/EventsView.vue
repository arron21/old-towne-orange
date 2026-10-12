<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { MapPin, Calendar, Sparkles, ArrowUpDown } from 'lucide-vue-next';
import { useDistrictStore } from '../stores/districtStore';
import EventCard from '../components/EventCard.vue';
import { resolveEventDate } from '../utils/eventDateUtils';

const router = useRouter();
const store = useDistrictStore();

const selectedCategory = ref<string>('all');
const dateFilter = ref<'all' | 'today' | 'thisWeek'>('all');

const eventCategories = [
  { id: 'all', label: 'All Categories' },
  { id: 'festival', label: 'Festivals' },
  { id: 'market', label: 'Markets & Fleas' },
  { id: 'music', label: 'Live Music' },
  { id: 'community', label: 'Community' },
  { id: 'drinks', label: 'Tastings & Trivia' }
];

const allEvents = computed(() => {
  let list = store.allEvents;

  // Filter by category
  if (selectedCategory.value !== 'all') {
    list = list.filter(e => e.category === selectedCategory.value);
  }

  // Filter by date timing
  if (dateFilter.value === 'today') {
    list = list.filter(e => resolveEventDate(e).isToday);
  } else if (dateFilter.value === 'thisWeek') {
    list = list.filter(e => resolveEventDate(e).isThisWeek);
  }

  // Sort chronologically by exact upcoming date
  return [...list].sort((a, b) => {
    const timeA = resolveEventDate(a).dateObj.getTime();
    const timeB = resolveEventDate(b).dateObj.getTime();
    return timeA - timeB;
  });
});

const todayCount = computed(() => {
  return store.allEvents.filter(e => resolveEventDate(e).isToday).length;
});

const thisWeekCount = computed(() => {
  return store.allEvents.filter(e => resolveEventDate(e).isThisWeek).length;
});

function openMapForEvent(coords?: [number, number]) {
  if (coords) {
    router.push(`/map?lat=${coords[0]}&lng=${coords[1]}`);
  } else {
    router.push('/map');
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-4 pb-28 space-y-5">
    <!-- Featured Hero Event: Orange International Street Fair -->
    <div class="relative rounded-3xl overflow-hidden shadow-warm border border-stone-200/80 bg-stone-900 text-white">
      <img
        src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80"
        alt="Orange International Street Fair"
        class="w-full h-48 sm:h-56 object-cover opacity-60"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />

      <div class="absolute inset-0 p-5 flex flex-col justify-end">
        <div class="flex items-center gap-2 mb-1.5 flex-wrap">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider">
            Signature Annual Festival
          </span>
          <span class="flex items-center gap-1 text-xs text-amber-200 font-bold bg-stone-950/60 px-2 py-0.5 rounded-md border border-amber-300/30">
            <Calendar class="w-3.5 h-3.5 text-amber-400" />
            <span>Next: Sept 3 – Sept 5, 2027</span>
          </span>
        </div>

        <h2 class="text-xl sm:text-2xl font-bold font-serif leading-tight">
          Orange International Street Fair
        </h2>

        <p class="text-xs text-stone-200 mt-1 line-clamp-2 max-w-lg">
          Old Towne's legendary 3-day festival celebrating heritage with 15 ethnic food streets, 8 entertainment stages, and hundreds of local artisans surrounding The Plaza.
        </p>

        <div class="mt-3 flex items-center gap-2">
          <button
            @click="openMapForEvent([33.787885, -117.85311])"
            class="px-3 py-1.5 bg-citrus-600 hover:bg-citrus-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
          >
            <MapPin class="w-3.5 h-3.5" />
            <span>View Plaza Festival Grounds</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Timing & Date Filters -->
    <div class="flex items-center gap-2 bg-stone-100/80 p-1 rounded-2xl border border-stone-200/80">
      <button
        @click="dateFilter = 'all'"
        class="flex-1 py-1.5 rounded-xl text-xs font-bold transition-all text-center"
        :class="dateFilter === 'all'
          ? 'bg-white text-stone-900 shadow-xs'
          : 'text-stone-600 hover:text-stone-900'"
      >
        All Upcoming ({{ store.allEvents.length }})
      </button>

      <button
        v-if="todayCount > 0"
        @click="dateFilter = 'today'"
        class="flex-1 py-1.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1"
        :class="dateFilter === 'today'
          ? 'bg-amber-500 text-white shadow-xs'
          : 'text-amber-900 hover:bg-white/60'"
      >
        <Sparkles class="w-3 h-3 text-amber-300" />
        <span>Today ({{ todayCount }})</span>
      </button>

      <button
        @click="dateFilter = 'thisWeek'"
        class="flex-1 py-1.5 rounded-xl text-xs font-bold transition-all text-center"
        :class="dateFilter === 'thisWeek'
          ? 'bg-citrus-700 text-white shadow-xs'
          : 'text-stone-600 hover:text-stone-900'"
      >
        This Week ({{ thisWeekCount }})
      </button>
    </div>

    <!-- Category Filters -->
    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
      <button
        v-for="cat in eventCategories"
        :key="cat.id"
        @click="selectedCategory = cat.id"
        class="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
        :class="selectedCategory === cat.id
          ? 'bg-citrus-700 text-white shadow-xs'
          : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Events List Sorted Chronologically -->
    <div>
      <div class="flex items-center justify-between mb-3 px-1">
        <h3 class="text-sm font-bold text-stone-900 font-serif flex items-center gap-1.5">
          <Calendar class="w-4 h-4 text-citrus-600" />
          <span>Chronological Schedule ({{ allEvents.length }} Events)</span>
        </h3>
        <span class="text-[11px] text-stone-400 flex items-center gap-1 font-medium">
          <ArrowUpDown class="w-3 h-3" />
          <span>Sorted by Date</span>
        </span>
      </div>

      <div v-if="allEvents.length > 0" class="space-y-3">
        <EventCard
          v-for="ev in allEvents"
          :key="ev.id"
          :event="ev"
        />
      </div>

      <!-- Empty Filter State -->
      <div
        v-else
        class="bg-white rounded-2xl p-8 text-center border border-stone-200 text-stone-500"
      >
        <p class="font-semibold text-stone-800 text-sm">No events found matching this filter</p>
        <p class="text-xs text-stone-400 mt-1">Try switching to "All Upcoming" or clearing category filters.</p>
        <button
          @click="selectedCategory = 'all'; dateFilter = 'all'"
          class="mt-3 px-4 py-1.5 rounded-xl bg-citrus-600 text-white text-xs font-semibold hover:bg-citrus-700"
        >
          Reset Filters
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
