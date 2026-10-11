<script setup lang="ts">
import { Utensils, Beer, Coffee, ShoppingBag, Landmark, Compass } from 'lucide-vue-next';
import { useDistrictStore } from '../stores/districtStore';
import type { Category } from '../types';

const store = useDistrictStore();

interface CategoryItem {
  id: Category | 'all';
  label: string;
  icon: any;
}

const categories: CategoryItem[] = [
  { id: 'all', label: 'All Spots', icon: Compass },
  { id: 'dining', label: 'Dining', icon: Utensils },
  { id: 'drinks', label: 'Brews & Bars', icon: Beer },
  { id: 'cafe', label: 'Coffee & Treats', icon: Coffee },
  { id: 'shopping', label: 'Antiques', icon: ShoppingBag },
  { id: 'landmark', label: 'Landmarks', icon: Landmark }
];

function selectCategory(id: Category | 'all') {
  store.selectedCategory = id;
}
</script>

<template>
  <div class="overflow-x-auto no-scrollbar py-2 px-4 -mx-4 flex items-center gap-2 select-none">
    <button
      v-for="cat in categories"
      :key="cat.id"
      @click="selectCategory(cat.id)"
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 shadow-2xs"
      :class="store.selectedCategory === cat.id
        ? 'bg-citrus-700 text-white shadow-sm ring-1 ring-citrus-800'
        : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200/80'"
    >
      <component :is="cat.icon" class="w-3.5 h-3.5" />
      <span>{{ cat.label }}</span>
    </button>
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
