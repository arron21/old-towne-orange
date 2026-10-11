<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { WifiOff, Download, X } from 'lucide-vue-next';
import HeaderBar from './components/HeaderBar.vue';
import BottomNav from './components/BottomNav.vue';

const route = useRoute();

const isOnline = ref(navigator.onLine);
const deferredPrompt = ref<any>(null);
const showInstallBanner = ref(false);

const isDetailPage = computed(() => {
  return route.path.startsWith('/business/');
});

onMounted(() => {
  window.addEventListener('online', () => {
    isOnline.value = true;
  });
  window.addEventListener('offline', () => {
    isOnline.value = false;
  });

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    showInstallBanner.value = true;
  });
});

async function installPwa() {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;
    if (outcome === 'accepted') {
      showInstallBanner.value = false;
    }
    deferredPrompt.value = null;
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-parchment text-stone-800">
    <!-- Offline Indicator Banner -->
    <div
      v-if="!isOnline"
      class="bg-amber-800 text-amber-50 px-4 py-1.5 text-xs text-center flex items-center justify-center gap-1.5 font-medium z-50 shadow-sm"
    >
      <WifiOff class="w-3.5 h-3.5" />
      <span>Offline Mode — Cached map & district guide available</span>
    </div>

    <!-- PWA Install Banner -->
    <div
      v-if="showInstallBanner"
      class="bg-citrus-900 text-white px-4 py-2 text-xs flex items-center justify-between z-50 shadow-md"
    >
      <div class="flex items-center gap-2">
        <Download class="w-4 h-4 text-amber-300" />
        <span>Install Old Towne Orange companion app to your home screen</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="installPwa"
          class="bg-amber-400 text-stone-900 px-2.5 py-1 rounded-md font-bold text-[11px] shadow-xs active:scale-95"
        >
          Install
        </button>
        <button @click="showInstallBanner = false" class="text-white/80 hover:text-white p-1">
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Header (Hidden on detail page for clean hero presentation) -->
    <HeaderBar v-if="!isDetailPage" />

    <!-- Main View Content -->
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Bottom Navigation Bar -->
    <BottomNav />
  </div>
</template>
