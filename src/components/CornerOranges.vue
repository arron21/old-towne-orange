<script setup lang="ts">
// Decorative corner oranges: an orange circle with two little green leaves at all four corners
withDefaults(
  defineProps<{
    size?: string;
  }>(),
  {
    size: 'w-3.5 h-3.5'
  }
);
</script>

<template>
  <div class="pointer-events-none select-none z-20">
    <!-- Top Left -->
    <svg :class="['absolute top-1 left-1 drop-shadow-2xs z-20', size]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Orange fruit circle -->
      <circle cx="12" cy="14" r="7.5" fill="#f97316" stroke="#c2410c" stroke-width="1"/>
      <path d="M8 11.5 Q10 9.5 13 9.5" stroke="#fdba74" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.8"/>
      <!-- Tiny stem -->
      <path d="M12 6.5 L12 4.5" stroke="#78350f" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Two little green leaves -->
      <path d="M12 5.5 C9 4 7 6 7.5 7.5 C8.5 9 11.5 6.5 12 5.5 Z" fill="#22c55e" stroke="#15803d" stroke-width="0.75"/>
      <path d="M12 5.5 C15 4 17 6 16.5 7.5 C15.5 9 12.5 6.5 12 5.5 Z" fill="#16a34a" stroke="#15803d" stroke-width="0.75"/>
    </svg>

    <!-- Top Right -->
    <svg :class="['absolute top-1 right-1 drop-shadow-2xs', size]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Orange fruit circle -->
      <circle cx="12" cy="14" r="7.5" fill="#f97316" stroke="#c2410c" stroke-width="1"/>
      <path d="M8 11.5 Q10 9.5 13 9.5" stroke="#fdba74" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.8"/>
      <!-- Tiny stem -->
      <path d="M12 6.5 L12 4.5" stroke="#78350f" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Two little green leaves -->
      <path d="M12 5.5 C9 4 7 6 7.5 7.5 C8.5 9 11.5 6.5 12 5.5 Z" fill="#22c55e" stroke="#15803d" stroke-width="0.75"/>
      <path d="M12 5.5 C15 4 17 6 16.5 7.5 C15.5 9 12.5 6.5 12 5.5 Z" fill="#16a34a" stroke="#15803d" stroke-width="0.75"/>
    </svg>

    <!-- Bottom Left -->
    <svg :class="['absolute bottom-1 left-1 drop-shadow-2xs', size]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Orange fruit circle -->
      <circle cx="12" cy="14" r="7.5" fill="#f97316" stroke="#c2410c" stroke-width="1"/>
      <path d="M8 11.5 Q10 9.5 13 9.5" stroke="#fdba74" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.8"/>
      <!-- Tiny stem -->
      <path d="M12 6.5 L12 4.5" stroke="#78350f" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Two little green leaves -->
      <path d="M12 5.5 C9 4 7 6 7.5 7.5 C8.5 9 11.5 6.5 12 5.5 Z" fill="#22c55e" stroke="#15803d" stroke-width="0.75"/>
      <path d="M12 5.5 C15 4 17 6 16.5 7.5 C15.5 9 12.5 6.5 12 5.5 Z" fill="#16a34a" stroke="#15803d" stroke-width="0.75"/>
    </svg>

    <!-- Bottom Right -->
    <svg :class="['absolute bottom-1 right-1 drop-shadow-2xs', size]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Orange fruit circle -->
      <circle cx="12" cy="14" r="7.5" fill="#f97316" stroke="#c2410c" stroke-width="1"/>
      <path d="M8 11.5 Q10 9.5 13 9.5" stroke="#fdba74" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.8"/>
      <!-- Tiny stem -->
      <path d="M12 6.5 L12 4.5" stroke="#78350f" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Two little green leaves -->
      <path d="M12 5.5 C9 4 7 6 7.5 7.5 C8.5 9 11.5 6.5 12 5.5 Z" fill="#22c55e" stroke="#15803d" stroke-width="0.75"/>
      <path d="M12 5.5 C15 4 17 6 16.5 7.5 C15.5 9 12.5 6.5 12 5.5 Z" fill="#16a34a" stroke="#15803d" stroke-width="0.75"/>
    </svg>
  </div>
</template>
