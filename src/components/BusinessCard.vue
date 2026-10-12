<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { MapPin, Sparkles, Flame, Star, ChevronRight } from 'lucide-vue-next';
import type { Business } from '../types';
import { useDistrictStore } from '../stores/districtStore';
import CornerOranges from './CornerOranges.vue';

const props = defineProps<{
  business: Business;
}>();

const router = useRouter();
const store = useDistrictStore();

const hasSpecialNow = computed(() => {
  return store.hasSpecialNow(props.business);
});

const todaySpecials = computed(() => {
  return props.business.specials.filter(s => s.day === store.currentDay);
});

const distanceText = computed(() => {
  if (!store.userLocation) return null;
  const dist = store.calculateDistance(store.userLocation, props.business.coordinates);
  if (dist < 0.1) return 'Steps away';
  return `${dist.toFixed(1)} mi away`;
});

function goToDetail() {
  router.push(`/business/${props.business.id}`);
}
</script>

<template>
  <div
    @click="goToDetail"
    class="bg-white card-notched relative border border-stone-200/80 shadow-xs hover:shadow-warm transition-all duration-200 cursor-pointer group flex flex-col"
  >
    <!-- Decorative Old Towne corner oranges -->
    <CornerOranges />

    <!-- Image Header with Badges -->
    <div class="relative h-36 w-full overflow-hidden bg-stone-100">
      <img
        :src="business.imageUrl"
        :alt="business.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      <!-- Top Tags -->
      <div class="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
        <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 text-stone-800 backdrop-blur-xs shadow-2xs">
          {{ business.categoryLabel }}
        </span>
        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
          {{ business.priceLevel }}
        </span>
      </div>

      <!-- Live Now Pulse Badge -->
      <div v-if="hasSpecialNow" class="absolute top-2.5 right-2.5">
        <span class="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm animate-pulse">
          <Flame class="w-3 h-3" />
          <span>Deal Live Now</span>
        </span>
      </div>

      <!-- Bottom Info Overlay -->
      <div class="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
        <span class="text-xs font-medium truncate drop-shadow-sm flex items-center gap-1">
          <MapPin class="w-3.5 h-3.5 text-citrus-300 shrink-0" />
          <span class="truncate">{{ business.address.split(',')[0] }}</span>
        </span>
        <div class="flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded-md text-[11px] font-bold shrink-0">
          <Star class="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{{ business.rating }}</span>
        </div>
      </div>
    </div>

    <!-- Content Body -->
    <div class="p-3.5 flex-1 flex flex-col justify-between">
      <div>
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-base font-bold text-stone-900 group-hover:text-citrus-700 transition-colors font-serif leading-snug">
            {{ business.name }}
          </h3>
          <span v-if="distanceText" class="text-[10px] font-semibold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded shrink-0">
            {{ distanceText }}
          </span>
        </div>

        <p class="text-xs text-stone-600 line-clamp-2 mt-1">
          {{ business.tagline }}
        </p>

        <!-- Specials Teaser for Today -->
        <div v-if="todaySpecials.length > 0" class="mt-2.5 bg-citrus-50/70 border border-citrus-200/60 rounded-xl p-2">
          <div class="flex items-center gap-1 text-[11px] font-bold text-citrus-800">
            <Sparkles class="w-3 h-3 text-citrus-600 shrink-0" />
            <span>Today's Special ({{ store.currentDay }}):</span>
          </div>
          <p class="text-[11px] text-stone-700 font-medium truncate mt-0.5">
            {{ todaySpecials[0].title }}
            <span v-if="todaySpecials[0].discountTag" class="text-citrus-700 font-bold ml-1">
              • {{ todaySpecials[0].discountTag }}
            </span>
          </p>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
        <span class="text-[11px]">
          {{ business.specials.length }} Weekly Specials • {{ business.events.length }} Events
        </span>
        <span class="flex items-center text-citrus-700 font-semibold group-hover:translate-x-0.5 transition-transform text-[11px]">
          View Specials
          <ChevronRight class="w-3.5 h-3.5 ml-0.5" />
        </span>
      </div>
    </div>
  </div>
</template>
