<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  ArrowLeft, MapPin, Phone, Globe, Star, Sparkles, 
  Calendar, Clock, Landmark, Share2, Flame 
} from 'lucide-vue-next';
import { useDistrictStore } from '../stores/districtStore';
import SpecialCard from '../components/SpecialCard.vue';
import EventCard from '../components/EventCard.vue';
import type { DayOfWeek } from '../types';

const route = useRoute();
const router = useRouter();
const store = useDistrictStore();

const businessId = computed(() => route.params.id as string);
const business = computed(() => store.getBusinessById(businessId.value));

const daysOfWeek: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

// Active day tab in the daily specials viewer, defaults to currentDay!
const activeDayTab = ref<DayOfWeek>(store.currentDay);

// Sync with store if store day changes
watch(() => store.currentDay, (newDay) => {
  activeDayTab.value = newDay;
});

const specialsForSelectedDay = computed(() => {
  if (!business.value) return [];
  return business.value.specials.filter(s => s.day === activeDayTab.value);
});

const todayHours = computed(() => {
  if (!business.value) return '';
  return business.value.hours[store.currentDay] || 'Hours not listed';
});

const showAllHours = ref(false);

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/businesses');
  }
}

function openOnMap() {
  if (!business.value) return;
  router.push(`/map?lat=${business.value.coordinates[0]}&lng=${business.value.coordinates[1]}`);
}

function openDirections() {
  if (!business.value) return;
  const q = encodeURIComponent(`${business.value.name}, ${business.value.address}`);
  window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
}

function shareBusiness() {
  if (navigator.share && business.value) {
    navigator.share({
      title: `${business.value.name} — Old Towne Orange`,
      text: `${business.value.name}: ${business.value.tagline}`,
      url: window.location.href,
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }
}
</script>

<template>
  <div v-if="business" class="pb-28">
    <!-- Hero Image & Navigation Header -->
    <div class="relative h-64 sm:h-72 w-full bg-stone-900 overflow-hidden">
      <img
        :src="business.imageUrl"
        :alt="business.name"
        class="w-full h-full object-cover opacity-85"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-black/40" />

      <!-- Top Nav Action Buttons -->
      <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-10 safe-top">
        <button
          @click="goBack"
          class="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-stone-800 flex items-center justify-center shadow-md active:scale-95 transition-transform"
          title="Back to directory"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-2">
          <button
            @click="shareBusiness"
            class="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-stone-800 flex items-center justify-center shadow-md active:scale-95 transition-transform"
            title="Share this spot"
          >
            <Share2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Hero Content Overlay -->
      <div class="absolute bottom-4 left-4 right-4 text-white">
        <div class="flex items-center gap-2 mb-1.5 flex-wrap">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-citrus-600 text-white shadow-xs">
            {{ business.categoryLabel }}
          </span>
          <span class="px-2 py-0.5 rounded text-xs font-bold bg-white/20 backdrop-blur-md text-white">
            {{ business.priceLevel }}
          </span>
          <div class="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-xs font-bold text-amber-300">
            <Star class="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{{ business.rating }}</span>
          </div>
        </div>

        <h1 class="text-2xl sm:text-3xl font-bold font-serif leading-tight drop-shadow-sm">
          {{ business.name }}
        </h1>
        <p class="text-xs sm:text-sm text-stone-200 mt-1 line-clamp-2 drop-shadow-sm font-medium">
          {{ business.tagline }}
        </p>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="max-w-2xl mx-auto px-4 mt-4 space-y-5">
      <!-- Quick Action Buttons Bar -->
      <div class="grid grid-cols-3 gap-2">
        <button
          @click="openOnMap"
          class="flex flex-col items-center justify-center py-2.5 px-2 bg-white rounded-xl border border-stone-200 shadow-2xs hover:bg-stone-50 active:scale-98 transition-all"
        >
          <MapPin class="w-4 h-4 text-citrus-600 mb-1" />
          <span class="text-[11px] font-bold text-stone-800">Show on Map</span>
        </button>

        <a
          v-if="business.phone"
          :href="`tel:${business.phone.replace(/[^0-9]/g, '')}`"
          class="flex flex-col items-center justify-center py-2.5 px-2 bg-white rounded-xl border border-stone-200 shadow-2xs hover:bg-stone-50 active:scale-98 transition-all"
        >
          <Phone class="w-4 h-4 text-sage-600 mb-1" />
          <span class="text-[11px] font-bold text-stone-800">Call Spot</span>
        </a>

        <a
          v-if="business.website"
          :href="business.website"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center justify-center py-2.5 px-2 bg-white rounded-xl border border-stone-200 shadow-2xs hover:bg-stone-50 active:scale-98 transition-all"
        >
          <Globe class="w-4 h-4 text-amber-600 mb-1" />
          <span class="text-[11px] font-bold text-stone-800">Website</span>
        </a>
      </div>

      <!-- Address & Today's Hours Card -->
      <div class="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-3">
        <!-- Address with Directions button -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-2.5">
            <MapPin class="w-4 h-4 text-citrus-700 shrink-0 mt-0.5" />
            <div>
              <p class="text-xs font-bold text-stone-900 leading-snug">{{ business.address }}</p>
              <p class="text-[11px] text-stone-500 mt-0.5">Old Towne Historic District</p>
            </div>
          </div>
          <button
            @click="openDirections"
            class="px-2.5 py-1 text-[11px] font-semibold text-citrus-700 bg-citrus-50 hover:bg-citrus-100 rounded-lg border border-citrus-200 transition-colors shrink-0"
          >
            Directions
          </button>
        </div>

        <!-- Hours Accordion -->
        <div class="pt-2 border-t border-stone-100">
          <div
            @click="showAllHours = !showAllHours"
            class="flex items-center justify-between cursor-pointer select-none py-1"
          >
            <div class="flex items-center gap-2 text-xs">
              <Clock class="w-3.5 h-3.5 text-stone-400" />
              <span class="font-semibold text-stone-800">
                Today ({{ store.currentDay }}):
              </span>
              <span class="text-citrus-800 font-bold">
                {{ todayHours }}
              </span>
            </div>
            <span class="text-[11px] font-semibold text-citrus-700 hover:underline">
              {{ showAllHours ? 'Hide' : 'All Week' }}
            </span>
          </div>

          <!-- Expanded 7-Day Hours List -->
          <div v-if="showAllHours" class="mt-2 pt-2 border-t border-dashed border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
            <div
              v-for="d in daysOfWeek"
              :key="d"
              class="flex items-center justify-between py-1 px-2 rounded-md"
              :class="d === store.currentDay ? 'bg-citrus-50 font-bold text-citrus-900' : 'text-stone-600'"
            >
              <span>{{ d }}</span>
              <span>{{ business.hours[d] || 'Closed' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Historic Heritage Note (if available) -->
      <div
        v-if="business.historicNote"
        class="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/70 shadow-2xs"
      >
        <div class="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-1">
          <Landmark class="w-4 h-4 text-amber-700" />
          <span>Historic District Heritage</span>
        </div>
        <p class="text-xs text-amber-950 leading-relaxed font-serif">
          {{ business.historicNote }}
        </p>
      </div>

      <!-- Description -->
      <div class="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
        <h2 class="text-sm font-bold text-stone-900 mb-1.5 font-serif">About This Spot</h2>
        <p class="text-xs text-stone-600 leading-relaxed">
          {{ business.description }}
        </p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-stone-100">
          <span
            v-for="t in business.tags"
            :key="t"
            class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-600"
          >
            #{{ t }}
          </span>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- 7-DAY DAILY SPECIALS SECTION (User Highlight)  -->
      <!-- ============================================== -->
      <div class="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-citrus-100 text-citrus-700 flex items-center justify-center">
              <Sparkles class="w-4 h-4" />
            </div>
            <div>
              <h2 class="text-base font-bold text-stone-900 font-serif leading-tight">Daily Specials Schedule</h2>
              <p class="text-[11px] text-stone-500">Tap any day to see weekly dining & drink specials</p>
            </div>
          </div>
        </div>

        <!-- 7-Day Day-by-Day Tab Bar -->
        <div class="grid grid-cols-7 gap-1 bg-stone-100 p-1 rounded-xl mb-4 select-none">
          <button
            v-for="d in daysOfWeek"
            :key="d"
            @click="activeDayTab = d"
            class="relative flex flex-col items-center py-2 px-1 rounded-lg transition-all text-center"
            :class="activeDayTab === d
              ? 'bg-white text-citrus-700 font-bold shadow-xs'
              : 'text-stone-600 hover:text-stone-900 font-medium'"
          >
            <!-- Today dot / badge -->
            <span
              v-if="d === store.currentDay"
              class="absolute -top-1 w-2 h-2 rounded-full bg-citrus-600"
              title="Today"
            />
            <span class="text-[11px] leading-tight">
              {{ d.slice(0, 3) }}
            </span>
            <span
              v-if="d === store.currentDay"
              class="text-[9px] uppercase tracking-tighter text-citrus-600 font-bold -mt-0.5"
            >
              Today
            </span>
          </button>
        </div>

        <!-- Specials Content for the selected day tab -->
        <div v-if="specialsForSelectedDay.length > 0" class="space-y-3">
          <div class="flex items-center justify-between text-xs text-stone-500 font-medium px-1">
            <span>
              Specials on <strong>{{ activeDayTab }}</strong>:
            </span>
            <span v-if="activeDayTab === store.currentDay" class="text-citrus-700 font-bold flex items-center gap-1">
              <Flame class="w-3 h-3 text-amber-500" />
              Active Day
            </span>
          </div>

          <SpecialCard
            v-for="special in specialsForSelectedDay"
            :key="special.id"
            :special="special"
            :business="business"
          />
        </div>

        <!-- Empty state for day without specific special -->
        <div
          v-else
          class="bg-stone-50 rounded-xl p-5 text-center border border-dashed border-stone-200 text-stone-500 text-xs"
        >
          <p class="font-medium text-stone-700">No scheduled specials on {{ activeDayTab }}.</p>
          <p class="text-[11px] text-stone-400 mt-1">
            Standard menu and bar offerings are available. Tap other days of the week above to explore regular weekly specials!
          </p>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- EVENTS SCHEDULE FOR THIS BUSINESS               -->
      <!-- ============================================== -->
      <div v-if="business.events.length > 0" class="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Calendar class="w-4 h-4" />
          </div>
          <div>
            <h2 class="text-base font-bold text-stone-900 font-serif leading-tight">Scheduled Events</h2>
            <p class="text-[11px] text-stone-500">Events taking place at {{ business.name }}</p>
          </div>
        </div>

        <div class="space-y-3">
          <EventCard
            v-for="ev in business.events"
            :key="ev.id"
            :event="ev"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Business not found state -->
  <div v-else class="max-w-md mx-auto p-8 text-center my-12">
    <h2 class="text-lg font-bold text-stone-900">Establishment Not Found</h2>
    <p class="text-xs text-stone-500 mt-1">The requested business detail could not be loaded.</p>
    <button
      @click="router.push('/businesses')"
      class="mt-4 px-4 py-2 bg-citrus-700 text-white rounded-xl text-xs font-semibold"
    >
      Return to Directory
    </button>
  </div>
</template>
