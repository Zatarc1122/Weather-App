<template>
  <div
    class="group relative rounded-xl bg-gradient-to-br from-slate-800 to-slate-850/40 border border-slate-700/70 p-4 flex flex-col gap-3 shadow hover:shadow-lg hover:border-sky-500/50 transition"
  >
    <button
      @click.stop="$emit('remove')"
      class="absolute top-2 right-2 text-xs px-2 py-0.5 rounded bg-slate-700/60 hover:bg-red-600/70"
      title="Remove"
    >✕</button>

    <RouterLink
      :to="`/city/${city.lat},${city.lon}?name=${encodeURIComponent(city.name)}`"
      class="flex flex-col gap-2 flex-1"
    >
      <div class="flex items-center justify-between">
        <h3 class="font-medium text-base">
          {{ city.name }}
          <span v-if="city.country" class="text-xs opacity-50 font-normal">({{ city.country }})</span>
        </h3>
        <span class="text-3xl">
          <WeatherIcon v-if="iconCode!=null" :code="iconCode" :isDay="weather?.current_weather.is_day === 1" size="10" />
        </span>
      </div>

      <div v-if="loading" class="h-10 flex items-center gap-2 animate-pulse text-sm opacity-60">
        Loading...
      </div>

      <div v-else-if="error" class="text-xs text-red-400">
        {{ error }}
      </div>

      <div v-else-if="weather" class="flex items-end justify-between">
        <div>
          <div class="text-4xl font-light leading-none flex items-center gap-2">
            <WeatherIcon v-if="iconCode!=null" :code="iconCode" :isDay="weather.current_weather.is_day===1" size="10" />
            <span>{{ weather.current_weather.temperature }}°C</span>
          </div>
          <div class="text-xs opacity-60 mt-1">
            Wind {{ weather.current_weather.windspeed }} km/h
          </div>
        </div>
        <div class="text-xs text-right opacity-60">
          {{ new Date(weather.current_weather.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}
        </div>
      </div>
    </RouterLink>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchWeather } from '../services/weather.js';
import WeatherIcon from './WeatherIcon.vue';

// Props: single saved city with lat/lon and naming details
const props = defineProps({
  city: { type: Object, required: true }
});

// Reactive state for this card's quick fetch
const weather = ref(null);
const loading = ref(true);
const error = ref('');

// Derive code for icon component (optional chaining for safety)
const iconCode = computed(() =>
  weather.value ? weather.value.current_weather.weathercode : null
);

// Fetch miniature weather snapshot for this city
async function load() {
  loading.value = true;
  error.value = '';
  try {
    weather.value = await fetchWeather(props.city.lat, props.city.lon);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>
