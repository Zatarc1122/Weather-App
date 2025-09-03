<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">Live Radar</h2>
      <RouterLink to="/" class="text-sm text-sky-400 hover:underline">&larr; Home</RouterLink>
    </div>
    <div class="h-[65vh] rounded-lg overflow-hidden border border-slate-700 relative">
      <div id="radar-map" class="h-full w-full"></div>
      <div class="absolute top-2 left-2 flex gap-2 z-[500] text-xs bg-slate-800/70 backdrop-blur px-3 py-2 rounded-md border border-slate-600">
        <button @click="toggleLoop" class="px-2 py-1 rounded bg-sky-600/70 hover:bg-sky-500/80 transition">{{ looping ? 'Pause' : 'Play' }}</button>
        <span v-if="frames.length" class="opacity-80">Frame {{ currentFrameIndex+1 }}/{{ frames.length }}</span>
      </div>
    </div>
    <p class="text-xs opacity-60">Radar tiles courtesy of RainViewer (public demo tiles). For production, obtain proper API usage rights.</p>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import 'leaflet/dist/leaflet.css'

let map
let overlayLayer

const frames = ref([]) // array of frame metadata
const currentFrameIndex = ref(0)
const looping = ref(true)
let loopTimer

// RainViewer public tiles (demo). We'll fetch the latest radar frames list.
async function loadFrames() {
  try {
    const res = await fetch('https://api.rainviewer.com/public/weather-maps.json')
    const data = await res.json()
    // data.radar.past (array) plus optionally nowcast
    frames.value = [...(data.radar?.past||[]), ...(data.radar?.nowcast||[])]
    currentFrameIndex.value = frames.value.length - 1 // start at latest
    updateOverlay()
  } catch (e) {
    console.error('Radar frames load failed', e)
  }
}

function updateOverlay() {
  if (!map || !frames.value.length) return
  const frame = frames.value[currentFrameIndex.value]
  const url = `https://tilecache.rainviewer.com${frame.path}/256/{z}/{x}/{y}/2/1_1.png`
  if (overlayLayer) {
    overlayLayer.setUrl(url)
  } else {
    overlayLayer = L.tileLayer(url, { opacity: 0.85, zIndex: 300 })
    overlayLayer.addTo(map)
  }
}

function nextFrame() {
  if (!frames.value.length) return
  currentFrameIndex.value = (currentFrameIndex.value + 1) % frames.value.length
  updateOverlay()
}

function toggleLoop() {
  looping.value = !looping.value
  if (looping.value) startLoop(); else stopLoop()
}

function startLoop() {
  stopLoop()
  loopTimer = setInterval(nextFrame, 900)
}
function stopLoop() {
  if (loopTimer) clearInterval(loopTimer)
}

onMounted(async () => {
  const { default: Lmod } = await import('leaflet')
  map = Lmod.map('radar-map', { center: [46.0, 15.0], zoom: 5, worldCopyJump: true })
  Lmod.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OSM' }).addTo(map)
  await loadFrames()
  startLoop()
})

onUnmounted(() => {
  stopLoop()
  if (map) map.remove()
})
</script>

<style>
/* Leaflet default marker images fix (Vite handling) */
.leaflet-container { background: #0f172a; }
</style>
