<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Clock, Tag, Flame, ChevronRight } from 'lucide-vue-next';
import type { DailySpecial, Business } from '../types';
import { useDistrictStore } from '../stores/districtStore';
import CornerOranges from './CornerOranges.vue';

const props = defineProps<{
  special: DailySpecial;
  business?: Business;
  showBusinessLink?: boolean;
}>();

const router = useRouter();
const store = useDistrictStore();

const isActiveNow = computed(() => {
  return store.isSpecialActiveNow(props.special);
});

const isLaterToday = computed(() => {
  if (props.special.day !== store.currentDay) return false;
  return store.currentHour < props.special.timeWindow.startHour && !props.special.timeWindow.label.toLowerCase().includes('all day');
});

function goToBusiness() {
  if (props.business) {
    router.push(`/business/${props.business.id}`);
  }
}
</script>

<template>
  <div
    class="bg-white card-notched p-4 border transition-all duration-200 relative"
    :class="isActiveNow 
      ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-warm' 
      : 'border-stone-200/80 shadow-2xs hover:shadow-xs'"
  >
    <!-- Decorative Old Towne corner oranges -->
    <CornerOranges />

    <div class="p-2">
      <!-- Top Row: Time Window & Live Status Badges -->
      <div class="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
        <div class="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
          <Clock class="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>{{ special.timeWindow.label }}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <span
            v-if="isActiveNow"
            class="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-2xs animate-pulse"
          >
            <Flame class="w-3 h-3" />
            Active Right Now
          </span>
          <span
            v-else-if="isLaterToday"
            class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200/60"
          >
            Starts Later Today
          </span>

          <span
            v-if="special.discountTag"
            class="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-citrus-100 text-citrus-800 border border-citrus-200/80"
          >
            <Tag class="w-2.5 h-2.5 text-citrus-600" />
            {{ special.discountTag }}
          </span>
        </div>
      </div>

      <!-- Title -->
      <h4 class="text-sm font-bold text-stone-900 leading-snug">
        {{ special.title }}
      </h4>

      <!-- Description -->
      <p class="text-xs text-stone-600 mt-1 leading-relaxed">
        {{ special.description }}
      </p>

      <!-- Business Link (used on the Happening Now & Specials feed) -->
      <div
        v-if="showBusinessLink && business"
        @click="goToBusiness"
        class="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between cursor-pointer group/biz"
      >
        <div class="flex items-center gap-2">
          <img
            :src="business.imageUrl"
            :alt="business.name"
            class="w-6 h-6 rounded-md object-cover"
          />
          <div>
            <span class="text-xs font-bold text-stone-800 group-hover/biz:text-citrus-700 transition-colors">
              {{ business.name }}
            </span>
            <span class="text-[10px] text-stone-400 ml-1.5">
              {{ business.address.split(',')[0] }}
            </span>
          </div>
        </div>

        <span class="text-[11px] font-semibold text-citrus-700 flex items-center group-hover/biz:translate-x-0.5 transition-transform">
          Details
          <ChevronRight class="w-3.5 h-3.5 ml-0.5" />
        </span>
      </div>
    </div>
  </div>
</template>
