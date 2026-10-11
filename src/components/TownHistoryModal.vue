<script setup lang="ts">
import { ref } from 'vue';
import { 
  X, Landmark, Sparkles, MapPin, Share2, 
  Calendar, CheckCircle2, Heart, Award
} from 'lucide-vue-next';
import type { Business } from '../types';

defineProps<{
  show: boolean;
  business: Business;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'navigate'): void;
}>();

type HistoryTab = 'founding' | 'fountain' | 'aspirations' | 'timeline';
const activeTab = ref<HistoryTab>('founding');

function shareStory() {
  if (navigator.share) {
    navigator.share({
      title: 'The Story of Old Towne Orange & The Plaza Fountain',
      text: 'Discover the founding history of Old Towne Orange (1871) and what California\'s largest historic district aspires to be today.',
      url: window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link to Old Towne Orange history copied to clipboard!');
  }
}
</script>

<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-amber-200/80 animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Modal Header Banner -->
      <div class="relative h-48 sm:h-56 bg-stone-900 shrink-0 overflow-hidden">
        <img
          :src="business.imageUrl"
          :alt="business.name"
          class="w-full h-full object-cover opacity-85"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-black/30" />

        <!-- Close & Share Buttons -->
        <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-stone-950 backdrop-blur-md shadow-sm">
            <Landmark class="w-3.5 h-3.5" />
            Historic Landmark & The Circle
          </span>
          <div class="flex items-center gap-2">
            <button
              @click="shareStory"
              class="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center shadow-md active:scale-95 transition-all"
              title="Share Town Story"
            >
              <Share2 class="w-4 h-4" />
            </button>
            <button
              @click="emit('close')"
              class="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center shadow-md active:scale-95 transition-all"
              title="Close modal"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Banner Title -->
        <div class="absolute bottom-3 left-4 right-4 text-white">
          <p class="text-xs font-semibold text-amber-300 uppercase tracking-widest flex items-center gap-1">
            <Sparkles class="w-3.5 h-3.5" />
            Plaza Square & The Circle
          </p>
          <h2 class="text-xl sm:text-2xl font-bold font-serif leading-tight mt-0.5">
            The Story of Old Towne Orange
          </h2>
          <p class="text-xs text-stone-200 mt-1 line-clamp-1">
            How a 1-square-mile citrus dream became California's largest historic district.
          </p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-stone-200 bg-stone-50 px-2 shrink-0 overflow-x-auto no-scrollbar">
        <button
          @click="activeTab = 'founding'"
          class="flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-bold whitespace-nowrap transition-colors"
          :class="activeTab === 'founding' ? 'border-citrus-700 text-citrus-800' : 'border-transparent text-stone-500 hover:text-stone-800'"
        >
          <Landmark class="w-3.5 h-3.5" />
          <span>Founding (1871)</span>
        </button>

        <button
          @click="activeTab = 'fountain'"
          class="flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-bold whitespace-nowrap transition-colors"
          :class="activeTab === 'fountain' ? 'border-citrus-700 text-citrus-800' : 'border-transparent text-stone-500 hover:text-stone-800'"
        >
          <Sparkles class="w-3.5 h-3.5" />
          <span>The Historic Fountain</span>
        </button>

        <button
          @click="activeTab = 'aspirations'"
          class="flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-bold whitespace-nowrap transition-colors"
          :class="activeTab === 'aspirations' ? 'border-citrus-700 text-citrus-800' : 'border-transparent text-stone-500 hover:text-stone-800'"
        >
          <Heart class="w-3.5 h-3.5" />
          <span>Today's Aspirations</span>
        </button>

        <button
          @click="activeTab = 'timeline'"
          class="flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs font-bold whitespace-nowrap transition-colors"
          :class="activeTab === 'timeline' ? 'border-citrus-700 text-citrus-800' : 'border-transparent text-stone-500 hover:text-stone-800'"
        >
          <Calendar class="w-3.5 h-3.5" />
          <span>Timeline</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-stone-700 text-xs sm:text-sm leading-relaxed">
        
        <!-- Tab 1: Founding (1871) -->
        <div v-if="activeTab === 'founding'" class="space-y-4">
          <div class="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 flex items-start gap-3">
            <Award class="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 class="font-bold text-amber-950 font-serif text-sm">Founded in 1871 by Glassell & Chapman</h4>
              <p class="text-amber-900/90 text-xs mt-0.5">
                Originally named <strong>Richland</strong>, the town was laid out around an 8-acre circular park that remains the vibrant heart of the city today.
              </p>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-bold text-stone-900 font-serif mb-1.5">From Rancho Partition to a 1-Mile Town Site</h3>
            <p>
              {{ business.history?.foundingStory || business.description }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-2.5 pt-2">
            <div class="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500">Original Town Name</span>
              <p class="font-serif font-bold text-stone-900 text-sm mt-0.5">Richland (1871–1875)</p>
              <p class="text-[11px] text-stone-600 mt-1">Renamed to "Orange" due to a postal naming conflict with Sacramento County.</p>
            </div>

            <div class="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500">The Founders</span>
              <p class="font-serif font-bold text-stone-900 text-sm mt-0.5">Andrew Glassell & Alfred Chapman</p>
              <p class="text-[11px] text-stone-600 mt-1">Los Angeles attorneys whose surnames define the town's two primary avenues.</p>
            </div>
          </div>

          <!-- National Register Callout -->
          <div class="p-3.5 bg-citrus-50/80 rounded-2xl border border-citrus-200">
            <div class="flex items-center gap-2 text-citrus-900 font-bold text-xs uppercase tracking-wider mb-1">
              <CheckCircle2 class="w-4 h-4 text-citrus-700" />
              <span>California's Largest Historic District</span>
            </div>
            <p class="text-xs text-citrus-950 leading-relaxed">
              {{ business.history?.historicDistrictStatus }}
            </p>
          </div>
        </div>

        <!-- Tab 2: The Historic Fountain -->
        <div v-else-if="activeTab === 'fountain'" class="space-y-4">
          <div class="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-200/80 flex items-start gap-3">
            <Sparkles class="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
            <div>
              <h4 class="font-bold text-sky-950 font-serif text-sm">The 1937 Hand-Tiled Spanish Fountain</h4>
              <p class="text-sky-900/90 text-xs mt-0.5">
                Constructed during the Great Depression as an enduring monument to community perseverance and craftsmanship.
              </p>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-bold text-stone-900 font-serif mb-1.5">Centerpiece of The Circle</h3>
            <p>
              {{ business.history?.fountainHistory }}
            </p>
          </div>

          <div class="space-y-2.5 pt-1">
            <div class="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div class="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">1887</div>
              <div>
                <h5 class="font-bold text-stone-900 text-xs">First Victorian Cast-Iron Fountain</h5>
                <p class="text-[11px] text-stone-600 mt-0.5">Dedicated when the square was first enclosed with palms, pepper trees, and perimeter fences to keep livestock off the lawn.</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div class="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0">1937</div>
              <div>
                <h5 class="font-bold text-stone-900 text-xs">The Iconic Hand-Tiled Electric Fountain</h5>
                <p class="text-[11px] text-stone-600 mt-0.5">Erected with vibrant Spanish glazed tiles, multi-tiered basins, and nighttime lighting, becoming the timeless backdrop of Orange.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Today's Aspirations -->
        <div v-else-if="activeTab === 'aspirations'" class="space-y-4">
          <div class="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/80 flex items-start gap-3">
            <Heart class="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 class="font-bold text-emerald-950 font-serif text-sm">What Old Towne Aspires to Be Today</h4>
              <p class="text-emerald-900/90 text-xs mt-0.5">
                A living, walkable historic village that balances small-town soul with cultural and culinary vitality.
              </p>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-bold text-stone-900 font-serif mb-1.5">Living Heritage, Not a Museum</h3>
            <p>
              {{ business.history?.modernAspirations }}
            </p>
          </div>

          <!-- Guiding Principles -->
          <div class="pt-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">District Core Aspirations</h4>
            <div class="grid grid-cols-1 gap-2">
              <div 
                v-for="(val, idx) in business.history?.coreValues" 
                :key="idx"
                class="flex items-center gap-2.5 p-2.5 bg-stone-50 rounded-xl border border-stone-200/80"
              >
                <div class="w-2 h-2 rounded-full bg-citrus-600 shrink-0" />
                <span class="text-xs font-semibold text-stone-800">{{ val }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 4: Timeline -->
        <div v-else-if="activeTab === 'timeline'" class="space-y-3">
          <p class="text-xs text-stone-500 mb-2">Key milestones that shaped the city of Orange from 1871 to the present day:</p>
          <div class="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
            <div 
              v-for="(item, idx) in business.history?.milestones" 
              :key="idx"
              class="relative"
            >
              <!-- Timeline node dot -->
              <span class="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white bg-citrus-700 shadow-xs" />
              
              <div class="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                <div class="flex items-baseline justify-between gap-2">
                  <span class="font-bold text-xs text-stone-900 font-serif">{{ item.title }}</span>
                  <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-citrus-100 text-citrus-800 shrink-0">{{ item.year }}</span>
                </div>
                <p class="text-xs text-stone-600 mt-1 leading-snug">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="p-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
        <button
          @click="emit('navigate')"
          class="flex items-center gap-1.5 py-2 px-3.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
        >
          <MapPin class="w-4 h-4 text-stone-700" />
          <span>Center on Map</span>
        </button>

        <button
          @click="emit('close')"
          class="py-2 px-5 bg-citrus-700 hover:bg-citrus-800 text-white rounded-xl text-xs font-semibold shadow-sm active:scale-98 transition-all"
        >
          Close & Explore
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
