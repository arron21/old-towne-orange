<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Clock, MapPin, Store, ChevronRight, Repeat } from 'lucide-vue-next';
import type { DistrictEvent } from '../types';
import { resolveEventDate } from '../utils/eventDateUtils';

const props = defineProps<{
  event: DistrictEvent;
}>();

const router = useRouter();

const dateInfo = computed(() => resolveEventDate(props.event));

function handleEventAction() {
  if (props.event.businessId) {
    router.push(`/business/${props.event.businessId}`);
  } else if (props.event.coordinates) {
    router.push(`/map?lat=${props.event.coordinates[0]}&lng=${props.event.coordinates[1]}`);
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
    <div>
      <!-- Top Row: Exact Date Box + Category / Relative Timing -->
      <div class="flex items-start justify-between gap-3 mb-3">
        <!-- Date Block -->
        <div class="flex items-center gap-3">
          <div
            class="flex flex-col items-center justify-center w-12 h-13 rounded-xl border shrink-0 shadow-2xs transition-colors"
            :class="dateInfo.isToday
              ? 'bg-amber-500 border-amber-600 text-white'
              : dateInfo.isThisWeek
                ? 'bg-citrus-50 border-citrus-200 text-citrus-900'
                : 'bg-stone-50 border-stone-200 text-stone-800'"
          >
            <span
              class="text-[10px] font-black uppercase tracking-wider leading-none mt-1"
              :class="dateInfo.isToday ? 'text-amber-100' : 'text-citrus-700'"
            >
              {{ dateInfo.monthShort }}
            </span>
            <span class="text-lg font-black leading-tight">
              {{ dateInfo.dayNumber }}
            </span>
          </div>

          <div class="min-w-0">
            <!-- Exact Formatted Date -->
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-bold text-stone-900 leading-snug">
                {{ dateInfo.formattedFull }}
              </span>

              <!-- Timing Badge -->
              <span
                v-if="dateInfo.isToday"
                class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white animate-pulse"
              >
                Happening Today
              </span>
              <span
                v-else-if="dateInfo.relativeBadge && dateInfo.relativeBadge !== 'Upcoming'"
                class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="dateInfo.isThisWeek ? 'bg-citrus-100 text-citrus-800' : 'bg-stone-100 text-stone-700'"
              >
                {{ dateInfo.relativeBadge }}
              </span>
            </div>

            <!-- Recurrence / Schedule Cadence -->
            <div class="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium mt-0.5 flex-wrap">
              <span class="flex items-center gap-1 text-citrus-800 font-semibold">
                <Repeat v-if="event.isRecurringWeekly || event.date.toLowerCase().includes('every') || event.date.toLowerCase().includes('month')" class="w-3 h-3 text-citrus-600 shrink-0" />
                <span>{{ event.date }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Custom Category Badge -->
        <span
          v-if="event.badge"
          class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-citrus-600 text-white shrink-0 self-start"
        >
          {{ event.badge }}
        </span>
        <span
          v-else
          class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-600 capitalize shrink-0 self-start"
        >
          {{ event.category }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="text-base font-bold text-stone-900 leading-snug font-serif">
        {{ event.title }}
      </h3>

      <!-- Location & Time -->
      <div class="flex flex-col gap-1 mt-2 text-xs text-stone-500 font-medium">
        <div class="flex items-center gap-1.5">
          <Clock class="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>{{ event.time }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <MapPin class="w-3.5 h-3.5 text-citrus-600 shrink-0" />
          <span class="text-stone-700 font-semibold">{{ event.location }}</span>
        </div>
      </div>

      <!-- Description -->
      <p class="text-xs text-stone-600 mt-2 leading-relaxed">
        {{ event.description }}
      </p>
    </div>

    <!-- Action Link -->
    <div
      v-if="event.businessId || event.coordinates"
      @click="handleEventAction"
      class="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-citrus-700 font-semibold cursor-pointer group"
    >
      <span class="flex items-center gap-1">
        <Store v-if="event.businessId" class="w-3.5 h-3.5" />
        <MapPin v-else class="w-3.5 h-3.5" />
        <span>{{ event.businessId ? 'View Venue Details' : 'View on District Map' }}</span>
      </span>
      <ChevronRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
    </div>
  </div>
</template>
