<template>
  <div class="app-shell min-h-screen text-slate-100 flex flex-col">
    <DynamicBackground />
    <header class="sticky top-0 px-4 py-6 sm:px-6 sm:py-8 border-b border-slate-700 flex flex-col items-center gap-6 text-center backdrop-blur-md bg-slate-900/55 shadow-lg shadow-slate-900/30 relative z-20">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide select-none flex items-center gap-3">
  <img :src="iconUrl" alt="" aria-hidden="true" class="h-8 w-8 sm:h-10 sm:w-10 opacity-90 pointer-events-none select-none" />
        <span class="flex items-baseline gap-1">
          <span class="text-sky-200">Weather</span>
          <span class="text-sky-300">Now</span>
        </span>
  <img :src="iconUrl" alt="" aria-hidden="true" class="h-8 w-8 sm:h-10 sm:w-10 opacity-90 pointer-events-none select-none" />
      </h1>
      <nav class="flex flex-wrap justify-center gap-5">
        <RouterLink to="/" v-slot="{ isActive, href, navigate }">
          <button
            :class="['nav-btn px-5 py-2 rounded-md border transition text-sm sm:text-base font-medium shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 flex items-center gap-2',
              'border-sky-500/40 bg-sky-700/30 hover:bg-sky-600/40 hover:border-sky-300/50 focus:ring-sky-400/60',
              isActive ? 'nav-btn-active bg-sky-600/60 border-sky-300 text-white shadow ring-1 ring-sky-300' : 'text-slate-100']"
            :aria-current="isActive ? 'page' : undefined"
            :href="href" @click="navigate"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.2 2.9 11.1a1 1 0 0 0 .7 1.74H5v6.2c0 .55.45 1 1 1h4.2a.8.8 0 0 0 .8-.8v-4.4c0-.44.36-.8.8-.8h1.4c.44 0 .8.36.8.8v4.4c0 .44.36.8.8.8H19c.55 0 1-.45 1-1v-6.2h1.4a1 1 0 0 0 .66-1.76L12 3.2Z"/></svg>
            Home
          </button>
        </RouterLink>
        <RouterLink to="/radar" v-slot="{ isActive, href, navigate }">
          <button
            :class="['nav-btn px-5 py-2 rounded-md border transition text-sm sm:text-base font-medium shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 flex items-center gap-2',
              'border-sky-500/40 bg-sky-700/30 hover:bg-sky-600/40 hover:border-sky-300/50 focus:ring-sky-400/60',
              isActive ? 'nav-btn-active bg-sky-600/60 border-sky-300 text-white shadow ring-1 ring-sky-300' : 'text-slate-100']"
            :aria-current="isActive ? 'page' : undefined"
            :href="href" @click="navigate"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm0-7a1 1 0 0 1 .96.73 2.75 2.75 0 0 0 1.8 1.8 1 1 0 0 1 0 1.9 2.75 2.75 0 0 0-1.8 1.8 1 1 0 0 1-1.92 0 2.75 2.75 0 0 0-1.8-1.8 1 1 0 0 1 0-1.9 2.75 2.75 0 0 0 1.8-1.8A1 1 0 0 1 12.01 2.5Zm7.5 9.5a1 1 0 0 1 .73.96 2.75 2.75 0 0 0 1.8 1.8 1 1 0 0 1 0 1.92 2.75 2.75 0 0 0-1.8 1.8 1 1 0 0 1-1.9 0 2.75 2.75 0 0 0-1.8-1.8 1 1 0 0 1 0-1.92 2.75 2.75 0 0 0 1.8-1.8 1 1 0 0 1 1.16-.96ZM3 12a1 1 0 0 1 .73-.96 2.75 2.75 0 0 0 1.8-1.8 1 1 0 0 1 1.9 0 2.75 2.75 0 0 0 1.8 1.8 1 1 0 0 1 0 1.92 2.75 2.75 0 0 0-1.8 1.8 1 1 0 0 1-1.9 0 2.75 2.75 0 0 0-1.8-1.8A1 1 0 0 1 3 12Zm8.5 7.5a1 1 0 0 1 .96.73 2.75 2.75 0 0 0 1.8 1.8 1 1 0 0 1 0 1.9 2.75 2.75 0 0 0-1.8 1.8 1 1 0 0 1-1.9 0 2.75 2.75 0 0 0-1.8-1.8 1 1 0 0 1 0-1.9 2.75 2.75 0 0 0 1.8-1.8 1 1 0 0 1 .96-.73Z"/></svg>
            Radar
          </button>
        </RouterLink>
      </nav>
    </header>
  <main class="flex-1 px-4 sm:px-8 py-6 max-w-5xl w-full mx-auto relative z-10">
      <RouterView />
    </main>
  <footer class="text-[11px] sm:text-xs opacity-70 text-center py-6 px-4 border-t border-slate-800 bg-slate-900/60 relative z-10">
      <div class="flex flex-col gap-2 sm:gap-1">
        <div class="flex flex-col sm:flex-row gap-1 sm:justify-center sm:items-center">
          <span class="font-medium text-sky-300">Developed by <span class="font-semibold">Sebastijan Sudarević</span></span>
          <span class="hidden sm:inline px-2 text-slate-600">•</span>
          <span>
            <a href="mailto:sebastijan.sudarevic1@gmail.com" class="inline-flex items-center gap-1 hover:text-sky-300 underline underline-offset-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"/><path d="m22 6-10 7L2 6"/></svg>
              Email
            </a>
            <span class="px-1">|</span>
            <a href="https://github.com/Zatarc1122" target="_blank" rel="noopener" class="inline-flex items-center gap-1 hover:text-sky-300 underline underline-offset-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.94.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.11-.76.41-1.26.75-1.55-2.55-.29-5.23-1.28-5.23-5.72 0-1.26.45-2.29 1.2-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.75.8 1.2 1.83 1.2 3.09 0 4.45-2.69 5.43-5.25 5.72.42.37.8 1.1.8 2.22 0 1.6-.02 2.89-.02 3.28 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>
              GitHub
            </a>
            <span class="px-1">|</span>
            <a href="https://www.linkedin.com/in/sebastijan-sudarevi%C4%87-351732371/" target="_blank" rel="noopener" class="inline-flex items-center gap-1 hover:text-sky-300 underline underline-offset-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85v5.5H9.48V9h3.41v1.56h.05c.47-.89 1.62-1.8 3.34-1.8 3.57 0 4.23 2.35 4.23 5.41v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77A1.77 1.77 0 0 0 0 1.77v20.46C0 23.4.6 24 1.77 24h20.46A1.77 1.77 0 0 0 24 22.23V1.77A1.77 1.77 0 0 0 22.23 0Z"/></svg>
              LinkedIn
            </a>
          </span>
        </div>
        <div class="flex flex-col sm:flex-row gap-1 sm:justify-center sm:items-center text-[10px] sm:text-[11px] tracking-wide">
          <span>Weather data: <a href="https://open-meteo.com" target="_blank" rel="noopener" class="hover:text-sky-300">Open‑Meteo</a></span>
          <span class="hidden sm:inline px-2 text-slate-600">•</span>
          <span>Radar tiles: <a href="https://www.rainviewer.com/api.html" target="_blank" rel="noopener" class="hover:text-sky-300">RainViewer</a></span>
          <span class="hidden sm:inline px-2 text-slate-600">•</span>
          <span>Map data: © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" class="hover:text-sky-300">OpenStreetMap</a> contributors</span>
          <span class="hidden sm:inline px-2 text-slate-600">•</span>
          <span>Map library: <a href="https://leafletjs.com" target="_blank" rel="noopener" class="hover:text-sky-300">Leaflet</a></span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { weatherTheme as theme } from './stores/weatherTheme.js';
import { ref, watch, computed } from 'vue';
import DynamicBackground from './components/DynamicBackground.vue';

const prevTheme = ref(null);
const iconUrl = computed(()=> (import.meta.env.BASE_URL || '/') + 'weather-icon.svg');
watch(theme, (newVal, oldVal) => {
  if (oldVal && oldVal !== newVal) {
    prevTheme.value = oldVal;
    setTimeout(() => { if (prevTheme.value === oldVal) prevTheme.value = null; }, 1000);
  }
});
</script>

<style>
.page-enter-active {
  transition: 600ms ease all;
}

.page-enter-from {
  opacity: 0;
}
/* Nav button underline animation */
.nav-btn { position:relative; overflow:hidden; }
.nav-btn::after { content:""; position:absolute; left:8%; right:8%; bottom:4px; height:2px; background:linear-gradient(90deg,rgba(125,211,252,0),rgba(125,211,252,0.8),rgba(125,211,252,0)); transform:scaleX(0); transform-origin: center; transition: transform .45s ease; }
.nav-btn:hover::after { transform:scaleX(1); }
.nav-btn-active::after { transform:scaleX(1); }
.nav-btn-active { position:relative; }
.nav-btn-active::before { content:""; position:absolute; inset:0; background:radial-gradient(circle at 30% 20%, rgba(255,255,255,0.02), transparent 70%); pointer-events:none; }

/* Removed accent glow for minimal static header */

/* Entrance animations removed (static header) */

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  /* No entrance animations to disable now */
  .anim-sun, .anim-stars, .anim-clouds, .anim-rain, .anim-snow, .anim-thunder, .anim-fog { animation: none !important; }
  .nav-btn::after { transition: none; }
}
</style>

<style>
/* Background stacking */
.app-shell { position: relative; }
.bg-stack { position: fixed; inset:0; z-index:0; }
.bg-stack > div { position:absolute; inset:0; }

/* Fading previous layer */
.fade-out { animation: themeFade 1s ease forwards; }
@keyframes themeFade { to { opacity:0; } }

/* Base gradient fallback */
.theme-base.theme-default, .theme-default { background: linear-gradient(#0f172a,#1e293b); }

/* Clear day */
.theme-base.theme-clear-day, .theme-clear-day { background: linear-gradient(#0ea5e9,#1e3a8a); }
.theme-base.theme-clear-day::after, .theme-clear-day::after { content:""; position:absolute; inset:0; background: repeating-conic-gradient(rgba(255,255,255,0.07) 0deg, rgba(255,255,255,0) 20deg); animation: spin 40s linear infinite; opacity:0.4; }

/* Clear night */
.theme-base.theme-clear-night, .theme-clear-night { background: linear-gradient(#020617,#0f172a 60%, #1e293b); }
.theme-base.theme-clear-night::after, .theme-clear-night::after { content:""; position:absolute; inset:0; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='10' cy='20' r='1'/%3E%3Ccircle cx='40' cy='80' r='1.2'/%3E%3Ccircle cx='90' cy='50' r='1'/%3E%3Ccircle cx='130' cy='30' r='1.3'/%3E%3Ccircle cx='70' cy='120' r='1.1'/%3E%3Ccircle cx='20' cy='140' r='1'/%3E%3Ccircle cx='150' cy='100' r='1.2'/%3E%3C/g%3E%3C/svg%3E"); animation: drift 80s linear infinite; opacity:0.55; background-size:320px 320px; }

/* Cloudy */
.theme-base.theme-cloudy, .theme-cloudy { background: linear-gradient(#1e293b,#334155); }
.theme-base.theme-cloudy::after, .theme-cloudy::after { content:""; position:absolute; inset:0; background: linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.08) 75%); background-size:800% 100%; animation: slide 50s linear infinite; opacity:0.35; }

/* Rain */
.theme-base.theme-rain, .theme-rain { background: linear-gradient(#0f172a,#1e293b); }
.theme-base.theme-rain::after, .theme-rain::after { content:""; position:absolute; inset:0; background-image: repeating-linear-gradient(120deg, rgba(255,255,255,0.08) 0 2px, rgba(255,255,255,0) 2px 10px); animation: rain 1.2s linear infinite; opacity:0.35; }

/* Snow */
.theme-base.theme-snow, .theme-snow { background: linear-gradient(#1e293b,#334155); }
.theme-base.theme-snow::after, .theme-snow::after { content:""; position:absolute; inset:0; background-image: radial-gradient(circle at 10% 20%, rgba(255,255,255,0.6) 0 2px, transparent 3px), radial-gradient(circle at 70% 40%, rgba(255,255,255,0.5) 0 2px, transparent 3px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.55) 0 2px, transparent 3px); animation: snow 18s linear infinite; background-size:400px 400px; }

/* Thunder */
.theme-base.theme-thunder, .theme-thunder { background: radial-gradient(circle at 50% 60%, #334155, #0f172a 70%); }
.theme-base.theme-thunder::after, .theme-thunder::after { content:""; position:absolute; inset:0; background: radial-gradient(circle at 60% 40%, rgba(255,255,255,0.25), transparent 60%); animation: flash 6s linear infinite; opacity:0.7; }

/* Fog */
.theme-base.theme-fog, .theme-fog { background: linear-gradient(#334155,#475569); }
.theme-base.theme-fog::after, .theme-fog::after { content:""; position:absolute; inset:0; background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18), rgba(255,255,255,0.02) 70%); filter: blur(2px); animation: pulse 12s ease-in-out infinite; opacity:0.5; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes drift { to { background-position: 320px 320px; } }
@keyframes slide { to { background-position: 800% 0; } }
@keyframes rain { to { background-position: 0 40px; } }
@keyframes snow { to { background-position: 400px 400px; } }
@keyframes flash { 0%,93%,100% { opacity:0.15; } 94% { opacity:0.8; } 95% { opacity:0.2; } 96% { opacity:0.7; } }
@keyframes pulse { 0%,100% { opacity:0.45; } 50% { opacity:0.6; } }
</style>
