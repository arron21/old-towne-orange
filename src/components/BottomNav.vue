<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Map, Store, Sparkles, Calendar } from 'lucide-vue-next';
import { useDistrictStore } from '../stores/districtStore';

const route = useRoute();
const router = useRouter();
const store = useDistrictStore();

const liveSpecialsCount = computed(() => {
  return store.specialsHappeningNow.length;
});

const navItems = [
  {
    name: 'map',
    label: 'Map',
    path: '/map',
    icon: Map
  },
  {
    name: 'businesses',
    label: 'Directory',
    path: '/businesses',
    icon: Store
  },
  {
    name: 'now',
    label: 'Specials Today',
    path: '/now',
    icon: Sparkles,
    badge: liveSpecialsCount
  },
  {
    name: 'events',
    label: 'Events',
    path: '/events',
    icon: Calendar
  }
];

function isItemActive(path: string) {
  if (path === '/map' && (route.path === '/' || route.path === '/map')) return true;
  if (path === '/businesses' && (route.path === '/businesses' || route.path.startsWith('/business/'))) return true;
  return route.path === path;
}

function navigateTo(path: string) {
  router.push(path);
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] safe-bottom">
    <div class="max-w-md mx-auto px-4 py-1.5 flex items-center justify-around">
      <button
        v-for="item in navItems"
        :key="item.name"
        @click="navigateTo(item.path)"
        class="relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 select-none group"
        :class="isItemActive(item.path) ? 'text-citrus-700 font-semibold' : 'text-stone-500 hover:text-stone-700'"
      >
        <!-- Active Background Pill -->
        <span
          v-if="isItemActive(item.path)"
          class="absolute inset-0 bg-citrus-50 rounded-xl -z-10 transition-transform scale-100"
        />

        <!-- Icon with badge -->
        <div class="relative">
          <component
            :is="item.icon"
            class="w-5 h-5 transition-transform group-active:scale-90"
            :class="isItemActive(item.path) ? 'stroke-[2.25]' : 'stroke-[1.75]'"
          />
          
          <!-- Badge counter for Live specials -->
          <span
            v-if="item.badge && item.badge.value > 0"
            class="absolute -top-1.5 -right-2.5 bg-citrus-600 text-white text-[10px] font-bold px-1.5 py-0.2 min-w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse"
          >
            {{ item.badge.value }}
          </span>
        </div>

        <!-- Label -->
        <span class="text-[11px] mt-1 tracking-tight leading-none">
          {{ item.label }}
        </span>
      </button>
    </div>
  </nav>
</template>
