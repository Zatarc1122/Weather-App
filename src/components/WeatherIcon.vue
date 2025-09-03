<template>
  <span class="inline-block align-middle" :title="label" :aria-label="label" role="img">
    <!-- Clear -->
    <svg v-if="mapped==='clear'" :style="sizeStyle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="colorClass">
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      <g stroke-linecap="round">
        <line x1="12" y1="1" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
        <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
      </g>
    </svg>
    <!-- Partly Cloudy -->
    <svg v-else-if="mapped==='partcloud'" :style="sizeStyle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="colorClass">
      <circle cx="8" cy="8" r="4" fill="currentColor" opacity=".45" />
      <path d="M6 18h9a5 5 0 0 0 0-10 6 6 0 0 0-11.7 2" stroke-linecap="round" />
    </svg>
    <!-- Cloudy -->
    <svg v-else-if="mapped==='cloud'" :style="sizeStyle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="colorClass">
      <path d="M6 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.8 2" fill="currentColor" opacity=".28" />
      <path d="M6 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.8 2" stroke-linecap="round" />
    </svg>
    <!-- Fog -->
    <svg v-else-if="mapped==='fog'" :style="sizeStyle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="colorClass">
      <path d="M5 10h9a4 4 0 0 0 0-8 6 6 0 0 0-11.5 2" stroke-linecap="round" />
      <line x1="3" x2="21" y1="14" y2="14" stroke-linecap="round" />
      <line x1="5" x2="19" y1="17" y2="17" stroke-linecap="round" />
      <line x1="7" x2="17" y1="20" y2="20" stroke-linecap="round" />
    </svg>
    <!-- Drizzle -->
    <svg v-else-if="mapped==='drizzle'" :style="sizeStyle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="colorClass">
      <path d="M6 16h10a4 4 0 0 0 0-8 6 6 0 0 0-11.8 2" stroke-linecap="round" />
      <g stroke-linecap="round">
        <line x1="9" y1="18" x2="9" y2="22" />
        <line x1="13" y1="18" x2="13" y2="22" />
        <line x1="17" y1="18" x2="17" y2="22" />
      </g>
    </svg>
    <!-- Rain -->
    <svg v-else-if="mapped==='rain'" :style="sizeStyle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="colorClass">
      <path d="M6 15h10a4 4 0 0 0 0-8 6 6 0 0 0-11.8 2" stroke-linecap="round" />
      <g stroke-linecap="round">
        <path d="M8 16l-1.5 3" />
        <path d="M12 16l-1.5 3" />
        <path d="M16 16l-1.5 3" />
      </g>
    </svg>
    <!-- Snow -->
    <svg v-else-if="mapped==='snow'" :style="sizeStyle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" :class="colorClass">
      <g stroke-linecap="round">
        <path d="M12 3v18" />
        <path d="M4.7 7l14.6 10" />
        <path d="M19.3 7L4.7 17" />
      </g>
      <g stroke-linecap="round">
        <path d="M9.5 5l2.5 2.5L14.5 5" />
        <path d="M9.5 19l2.5-2.5 2.5 2.5" />
        <path d="M6 9l2.5 2.5L6 14" />
        <path d="M18 9l-2.5 2.5L18 14" />
      </g>
    </svg>
    <!-- Storm -->
    <svg v-else-if="mapped==='storm'" :style="sizeStyle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="colorClass">
      <path d="M6 15h9.5a4 4 0 0 0 0-8 6 6 0 0 0-11.6 2" stroke-linecap="round" />
      <path d="M10 16l-2 5 5-4h-3l2-4" fill="currentColor" stroke="none" />
      <path d="M10 16l-2 5 5-4h-3l2-4" stroke-linecap="round" />
    </svg>
    <!-- Unknown -->
    <svg v-else :style="sizeStyle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="colorClass">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3.9 2 2.8 2.8 0 0 0-1.4 2.4v.6" stroke-linecap="round" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  code: { type: Number, required: true },
  isDay: { type: Boolean, default: true },
  size: { type: [Number, String], default: 8 }
});

// --- Mapping helpers --------------------------------------------------
// Translate raw WMO weather codes into a simplified set of icon names
function mapCode(code) {
  if (code === 0) return 'clear';
  if ([1, 2].includes(code)) return 'partcloud';
  if ([3].includes(code)) return 'cloud';
  if ([45, 48].includes(code)) return 'fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle';
  if ([61, 63, 65, 80, 81, 82].includes(code)) return 'rain';
  if ([66, 67].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return 'unknown';
}

const mapped = computed(() => mapCode(props.code));

const colorClass = computed(() => {
  const code = props.code; const day = props.isDay;
  if (code === 0) return day ? 'text-amber-300' : 'text-indigo-300';
  if ([1,2].includes(code)) return day ? 'text-amber-200' : 'text-indigo-200';
  if (code === 3) return 'text-slate-300';
  if ([45,48].includes(code)) return 'text-slate-400';
  if ([51,53,55,56,57].includes(code)) return 'text-cyan-300';
  if ([61,63,65,66,67,80,81,82].includes(code)) return 'text-sky-400';
  if ([71,73,75,77,85,86].includes(code)) return 'text-blue-200';
  if ([95,96,99].includes(code)) return 'text-yellow-400';
  return 'text-pink-300';
});
// Map a Tailwind size token (string/number) to an explicit width/height style.
// This keeps icons responsive without relying on every size existing in markup.
const sizeStyle = computed(() => {
  const map = { 4:'1rem', 5:'1.25rem',6:'1.5rem',8:'2rem',9:'2.25rem',10:'2.5rem',12:'3rem'};
  const key = String(props.size);
  const px = map[key] || '2rem';
  return { width: px, height: px };
});

// Generate an accessible text label for screen readers / title tooltips
const label = computed(() => {
  const code = props.code;
  if (code === 0) return 'Clear';
  if ([1,2].includes(code)) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if ([45,48].includes(code)) return 'Fog';
  if ([51,53,55,56,57].includes(code)) return 'Drizzle';
  if ([61,63,65,66,67,80,81,82].includes(code)) return 'Rain';
  if ([71,73,75,77,85,86].includes(code)) return 'Snow';
  if ([95,96,99].includes(code)) return 'Thunderstorm';
  return 'Unknown';
});
</script>