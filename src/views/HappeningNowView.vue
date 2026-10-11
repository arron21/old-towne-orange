<script setup lang="ts">
import { computed } from 'vue';
import { Sparkles, Flame, Clock, Calendar } from 'lucide-vue-next';
import { useDistrictStore } from '../stores/districtStore';
import SpecialCard from '../components/SpecialCard.vue';
import EventCard from '../components/EventCard.vue';
import type { DayOfWeek } from '../types';

const store = useDistrictStore();

const daysOfWeek: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const liveSpecials = computed(() => store.specialsHappeningNow);
const laterSpecials = computed(() => store.specialsLaterToday);
const allTodaySpecials = computed(() => store.activeSpecialsToday);

// Filter events for today (or recurring on this day)
const todayEvents = computed(() => {
  return store.allEvents.filter(ev => {
    if (ev.isRecurringWeekly && ev.recurringDay === store.currentDay) return true;
    if (ev.date.toLowerCase().includes(store.currentDay.toLowerCase())) return true;
    return false;
  });
});

function formatHour(h: number): string {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:00 ${ampm}`;
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-4 pb-28 space-y-5">
    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-citrus-700 via-citrus-600 to-amber-600 rounded-3xl p-5 text-white shadow-warm relative overflow-hidden">
      <!-- Decorative background circles -->
      <div class="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div class="absolute right-12 top-2 w-24 h-24 rounded-full bg-amber-400/20 blur-md pointer-events-none" />

      <div class="relative z-10">
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <span class="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white">
            <Sparkles class="w-3.5 h-3.5 text-amber-200" />
            Live District Feed
          </span>
          <span class="flex items-center gap-1 text-xs text-white/90 font-medium">
            <Clock class="w-3.5 h-3.5" />
            Current time: {{ formatHour(store.currentHour) }}
          </span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-bold font-serif leading-tight">
          Happening {{ store.currentDay }}
        </h1>
        <p class="text-xs sm:text-sm text-citrus-100 mt-1 max-w-md">
          Real-time daily specials, dining promotions, happy hours, and gatherings happening right now in Old Towne Orange.
        </p>

        <!-- Day Selector Quick Pills -->
        <div class="mt-4 pt-3 border-t border-white/20">
          <p class="text-[11px] text-white/80 font-medium mb-1.5">Preview Another Day:</p>
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              v-for="d in daysOfWeek"
              :key="d"
              @click="store.setDay(d)"
              class="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
              :class="store.currentDay === d 
                ? 'bg-white text-citrus-800 shadow-sm font-bold' 
                : 'bg-white/15 text-white hover:bg-white/25'"
            >
              {{ d.slice(0, 3) }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 1. LIVE SPECIALS RIGHT NOW (Priority Section) -->
    <div>
      <div class="flex items-center justify-between mb-3 px-1">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <Flame class="w-4 h-4 fill-amber-500" />
          </div>
          <div>
            <h2 class="text-base font-bold text-stone-900 font-serif leading-none">
              Active Right Now
            </h2>
            <p class="text-[11px] text-stone-500 mt-0.5">
              Live deals available at this exact hour ({{ formatHour(store.currentHour) }})
            </p>
          </div>
        </div>
        <span class="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
          {{ liveSpecials.length }} Active
        </span>
      </div>

      <div v-if="liveSpecials.length > 0" class="space-y-3">
        <SpecialCard
          v-for="item in liveSpecials"
          :key="item.special.id"
          :special="item.special"
          :business="item.business"
          :show-business-link="true"
        />
      </div>

      <div
        v-else
        class="bg-white rounded-2xl p-6 border border-stone-200/80 text-center shadow-2xs"
      >
        <p class="text-xs font-semibold text-stone-700">No time-restricted specials active right this moment.</p>
        <p class="text-[11px] text-stone-500 mt-1">
          Check out the specials starting later today or browse the all-day specials below!
        </p>
      </div>
    </div>

    <!-- 2. STARTING LATER TODAY -->
    <div v-if="laterSpecials.length > 0">
      <div class="flex items-center justify-between mb-3 px-1">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center">
            <Clock class="w-4 h-4" />
          </div>
          <div>
            <h2 class="text-base font-bold text-stone-900 font-serif leading-none">
              Starting Later Today
            </h2>
            <p class="text-[11px] text-stone-500 mt-0.5">
              Coming up this afternoon and evening
            </p>
          </div>
        </div>
        <span class="text-xs font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
          {{ laterSpecials.length }} Upcoming
        </span>
      </div>

      <div class="space-y-3">
        <SpecialCard
          v-for="item in laterSpecials"
          :key="item.special.id"
          :special="item.special"
          :business="item.business"
          :show-business-link="true"
        />
      </div>
    </div>

    <!-- 3. EVENTS OCCURRING TODAY -->
    <div v-if="todayEvents.length > 0">
      <div class="flex items-center justify-between mb-3 px-1">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-citrus-100 text-citrus-700 flex items-center justify-center">
            <Calendar class="w-4 h-4" />
          </div>
          <div>
            <h2 class="text-base font-bold text-stone-900 font-serif leading-none">
              Events on {{ store.currentDay }}
            </h2>
            <p class="text-[11px] text-stone-500 mt-0.5">
              Gatherings and scheduled happenings today
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <EventCard
          v-for="ev in todayEvents"
          :key="ev.id"
          :event="ev"
        />
      </div>
    </div>

    <!-- 4. ALL SPECIALS FOR TODAY -->
    <div>
      <div class="flex items-center justify-between mb-3 px-1">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
            <Sparkles class="w-4 h-4 text-citrus-600" />
          </div>
          <div>
            <h2 class="text-base font-bold text-stone-900 font-serif leading-none">
              All {{ store.currentDay }} Specials
            </h2>
            <p class="text-[11px] text-stone-500 mt-0.5">
              Full list of all {{ allTodaySpecials.length }} specials running throughout {{ store.currentDay }}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <SpecialCard
          v-for="item in allTodaySpecials"
          :key="item.special.id"
          :special="item.special"
          :business="item.business"
          :show-business-link="true"
        />
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
