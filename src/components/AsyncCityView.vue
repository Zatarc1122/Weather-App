<template>
  <div class="p-4">
    <div v-if="loading">
      <CityViewSkeleton />
    </div>
    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>
    <div v-else-if="weather">
      <h2 class="text-xl font-semibold mb-2">
        {{ cityName }}
      </h2>
      <p class="text-sm opacity-70">
        Updated: {{ weather.current_weather?.time }}
      </p>
      <div class="mt-4 flex gap-6 items-center">
        <div class="text-5xl font-light">
          {{ weather.current_weather?.temperature }}°{{ unitSymbol }}
        </div>
        <div class="space-y-1 text-sm">
          <div>Wind: {{ weather.current_weather?.windspeed }} km/h</div>
          <div class="flex items-center gap-1">
            <svg v-if="weather.current_weather?.winddirection!=null" :style="arrowStyle(weather.current_weather.winddirection)" class="w-3 h-3 text-sky-300 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 3l5 8h-3v10h-4V11H7l5-8z" stroke-linejoin="round" stroke-linecap="round" />
            </svg>
            Dir: {{ weather.current_weather?.winddirection }}°
            <template v-if="weather.current_weather?.winddirection != null">
              ({{ windDirectionInfo(weather.current_weather.winddirection).dir }})
            </template>
          </div>
        </div>
      </div>

      <h3 class="mt-6 font-medium">Next Hours</h3>
      <ul class="mt-2 grid gap-2 grid-cols-2 sm:grid-cols-4">
        <li
          v-for="(t, i) in limitedHours"
          :key="weather.hourly.time[i]"
          class="border rounded p-2 text-center"
        >
          <div class="text-xs">
            {{ shortTime(weather.hourly.time[i]) }}
          </div>
            <div class="text-lg">
              {{ t }}°
            </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CityViewSkeleton from './CityViewSkeleton.vue'
import { fetchWeather } from '../services/weather.js'
import { windDirectionInfo } from '../utils/format.js'

// Props you may already have
const props = defineProps({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  cityName: { type: String, default: 'Selected Location' },
  units: { type: String, default: 'metric' } // (Open-Meteo will auto Celsius; convert if needed)
})

const weather = ref(null)
const loading = ref(true)
const error = ref('')
const unitSymbol = computed(() => props.units === 'imperial' ? 'F' : 'C')

// Limit first N hours
const limitedHours = computed(() =>
  weather.value?.hourly?.temperature_2m
    ? weather.value.hourly.temperature_2m.slice(0, 8)
    : []
)

function shortTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchWeather(props.lat, props.lon)
    weather.value = data
    console.log('Weather raw:', data)
  } catch (e) {
    error.value = 'Failed to load weather: ' + e.message
  } finally {
    loading.value = false
  }
}

function arrowStyle(deg) {
  const info = windDirectionInfo(deg)
  return { transform: `rotate(${info.rotation}deg)` }
}

onMounted(load)
</script>

<style scoped>
/* ...existing code... */
</style>
