<template>
  <div class="space-y-10">
    <div class="flex items-center gap-6">
      <RouterLink to="/" class="text-sky-400 hover:underline text-sm">&larr; Back</RouterLink>
      <h2 class="text-2xl font-semibold">
        {{ name }}
      </h2>
  <span v-if="weather" class="text-4xl"><WeatherIcon :code="weather.current_weather.weathercode" :isDay="weather.current_weather.is_day===1" size="12" /></span>
    </div>

    <div
      v-if="!loading && !error && weather"
      class="inline-block text-lg font-semibold text-sky-200 bg-slate-700/60 border border-slate-600 px-3 py-1 rounded-md shadow-sm"
    >
      Local time: <span class="tabular-nums">{{ currentTimeFormatted }}</span>
    </div>
    <div v-if="loading" class="animate-pulse text-sm opacity-60">Loading...</div>
    <div v-else-if="error" class="text-red-400">{{ error }}</div>

    <div v-else-if="weather" class="space-y-10">
      <section class="grid sm:grid-cols-3 gap-6">
        <div class="p-5 rounded-lg bg-slate-800/60 border border-slate-700">
          <div class="text-xs uppercase tracking-wide opacity-60 mb-2">Current</div>
          <div class="text-5xl font-light">
            {{ weather.current_weather.temperature }}°C
          </div>
          <div class="mt-2 text-sm opacity-70">
            Wind {{ weather.current_weather.windspeed }} km/h<br />
            <span class="inline-flex items-center gap-1">
              <svg v-if="weather.current_weather.winddirection!=null" :style="arrowStyle(weather.current_weather.winddirection)" class="w-3 h-3 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 3l5 8h-3v10h-4V11H7l5-8z" stroke-linejoin="round" stroke-linecap="round" />
              </svg>
              Dir {{ weather.current_weather.winddirection }}° ({{ windDirectionInfo(weather.current_weather.winddirection).dir }})
            </span>
          </div>
        </div>
        <div class="p-5 rounded-lg bg-slate-800/60 border border-slate-700">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs uppercase tracking-wide opacity-60">Precip (next 12h)</div>
          </div>
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            <div
              v-for="i in nextHourIndices"
              :key="'p'+i"
              :class="[
                'p-2 rounded-md border text-xs flex flex-col items-center gap-1 transition-colors',
                i===currentHourIndex ? 'bg-sky-700/40 border-sky-500 shadow-sm' : 'bg-slate-900/40 border-slate-600'
              ]"
            >
              <span class="font-medium tabular-nums">{{ shortTime(weather.hourly.time[i]) }}</span>
              <span class="text-sky-200 font-semibold">{{ weather.hourly.precipitation[i] }}<span class="text-[10px] ml-0.5">mm</span></span>
              <span class="text-[11px] opacity-70">{{ weather.hourly.precipitation_probability[i] ?? 0 }}%</span>
            </div>
          </div>
        </div>
        <div class="p-5 rounded-lg bg-slate-800/60 border border-slate-700">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs uppercase tracking-wide opacity-60">Wind (next 12h)</div>
          </div>
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            <div
              v-for="i in nextHourIndices"
              :key="'w'+i"
              :class="[
                'p-2 rounded-md border text-xs flex flex-col items-center gap-1 transition-colors',
                i===currentHourIndex ? 'bg-sky-700/40 border-sky-500 shadow-sm' : 'bg-slate-900/40 border-slate-600'
              ]"
            >
              <span class="font-medium tabular-nums">{{ shortTime(weather.hourly.time[i]) }}</span>
              <div class="flex flex-col items-center leading-none">
                <svg v-if="weather.hourly.winddirection_10m?.[i]!=null" :style="arrowStyle(weather.hourly.winddirection_10m[i])" class="w-4 h-4 text-sky-300 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 3l5 8h-3v10h-4V11H7l5-8z" stroke-linejoin="round" stroke-linecap="round" />
                </svg>
                <span class="flex items-baseline gap-0.5 text-sky-200 font-semibold">
                  {{ weather.hourly.windspeed_10m[i] }}
                  <span class="text-[10px]">km/h</span>
                </span>
              </div>
              <span class="text-[11px] opacity-70" v-if="weather.hourly.winddirection_10m?.[i] != null">{{ windDirectionInfo(weather.hourly.winddirection_10m[i]).dir }}</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 class="font-medium mb-3">Hourly Temperature (Next 12 from now)</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          <div
            v-for="i in nextHourIndices"
            :key="'h'+i"
            class="p-3 rounded bg-slate-800/70 border border-slate-700 text-center space-y-1"
          >
            <div class="text-xl flex justify-center">
              <WeatherIcon v-if="hourIconCode(i)!=null"
                           :code="hourIconCode(i)"
                           :isDay="isDayFromHour(new Date(weather.hourly.time[i]))"/>
            </div>
            <div class="text-xs opacity-60">
              {{ shortTime(weather.hourly.time[i]) }}
            </div>
            <div class="text-lg font-light">{{ weather.hourly.temperature_2m[i] }}°</div>
          </div>
        </div>
      </section>

      <section class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="font-medium">Radar (≈300 km)</h3>
          <button @click="toggleRadarSize" class="text-xs px-3 py-1 rounded bg-sky-600/70 hover:bg-sky-500/80 border border-sky-400/30 transition">
            {{ radarExpanded ? 'Shrink' : 'Enlarge' }}
          </button>
        </div>
        <div :class="['relative rounded-lg overflow-hidden border border-slate-700 transition-all duration-300', radarExpanded ? 'h-96' : 'h-48']">
          <div id="city-radar-map" class="h-full w-full cursor-pointer"></div>
          <div class="absolute top-2 left-2 text-[11px] bg-slate-800/70 backdrop-blur px-2 py-1 rounded border border-slate-600 flex gap-2 items-center pointer-events-auto">
            <span>{{ radarStatus }}</span>
            <button @click.stop="toggleRadarLoop" class="px-2 py-0.5 rounded bg-sky-700/60 hover:bg-sky-600/70">
              {{ radarLooping ? 'Pause' : 'Play' }}
            </button>
          </div>
          <div class="absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded bg-slate-800/60 border border-slate-600 pointer-events-none select-none">Use button to {{ radarExpanded ? 'shrink' : 'enlarge' }}</div>
        </div>
      </section>

      <section v-if="weather.daily">
        <h3 class="font-medium mb-3">Daily</h3>
        <div class="grid gap-4 sm:grid-cols-3 md:grid-cols-5">
          <div
            v-for="(d,i) in weather.daily.time"
            :key="d"
            class="p-4 rounded bg-slate-800/70 border border-slate-700 space-y-1 text-sm text-center"
          >
            <div class="text-2xl flex justify-center">
              <WeatherIcon v-if="dailyIconCode(i)!=null" :code="dailyIconCode(i)" :isDay="true"/>
            </div>
            <div class="font-medium">
              {{ new Date(d).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) }}
            </div>
            <div class="text-lg font-light">
              {{ weather.daily.temperature_2m_max[i] }}° / {{ weather.daily.temperature_2m_min[i] }}°
            </div>
            <div class="opacity-70">
              Precip {{ weather.daily.precipitation_sum[i] }} mm
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, nextTick, watch } from 'vue';
import { weatherTheme, classifyWeather } from '../stores/weatherTheme.js';
import 'leaflet/dist/leaflet.css';
import { fetchWeather } from '../services/weather.js';
import WeatherIcon from '../components/WeatherIcon.vue';
import { windDirectionInfo } from '../utils/format.js';

const props = defineProps({ lat: Number, lon: Number, name: { type:String, default:'City' } });

class WeatherController {
  constructor(lat, lon){
    this.lat = lat; this.lon = lon;
    this.weather = ref(null); this.loading = ref(true); this.error = ref('');
    this.currentTime = ref(new Date());
    this.clockTimer = null; this.refreshTimer = null;
  }
  currentHourIndex = computed(()=>{
    const times = this.weather.value?.hourly?.time; if(!times) return 0; const now = Date.now();
    for (let i=0;i<times.length;i++){ if (Date.parse(times[i]) >= now - 30*60*1000) return i; }
    return 0;
  });
  nextHourIndices = computed(()=>{
    const times = this.weather.value?.hourly?.time; if(!times) return [];
    const start = this.currentHourIndex.value; return times.slice(start, start+12).map((_,i)=>start+i);
  });
  shortTime(iso){ return new Date(iso).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', hour12:false}); }
  arrowStyle(deg){ const info = windDirectionInfo(deg); return { transform:`rotate(${info.rotation}deg)` }; }
  isDayFromHour(d){ const h=d.getHours(); return h>=6 && h<20; }
  hourIconCode(i){ return this.weather.value?.hourly?.weathercode?.[i] ?? null; }
  dailyIconCode(i){ return this.weather.value?.daily?.weathercode?.[i] ?? null; }
  currentTimeFormatted = computed(()=> this.currentTime.value.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', hour12:false}));
  async load(silent=false){
    if(!silent){ this.loading.value=true; this.error.value=''; }
    try {
      const data = await fetchWeather(this.lat, this.lon);
      this.weather.value = data;
      const cw = data?.current_weather;
      if (cw) weatherTheme.value = classifyWeather(cw.weathercode, cw.is_day===1);
      if (!radar.map) nextTick(()=>radar.init());
    } catch(e){ if(!silent) this.error.value = e.message; }
    finally { if(!silent) this.loading.value=false; }
  }
  startTimers(){
    this.clockTimer = setInterval(()=>{ this.currentTime.value = new Date(); }, 60*1000);
    this.refreshTimer = setInterval(()=> this.load(true), 10*60*1000);
  }
  stopTimers(){ if(this.clockTimer) clearInterval(this.clockTimer); if(this.refreshTimer) clearInterval(this.refreshTimer); }
}

class RadarController {
  constructor(lat, lon){
    this.lat=lat; this.lon=lon;
    this.expanded = ref(false); this.status = ref('Idle'); this.looping = ref(true);
    this.map=null; this.overlay=null; this.circle=null; this.frames=[]; this.index=0; this.timer=null; this.L=null;
  }
  toggleSize(){ this.expanded.value=!this.expanded.value; }
  toggleLoop(){ this.looping.value=!this.looping.value; this.looping.value? this.startLoop():this.stopLoop(); }
  async init(){
    if(this.map) return; const el=document.getElementById('city-radar-map'); if(!el) return;
    try{
      this.status.value='Loading';
      const Lmod = await import('leaflet'); this.L = Lmod.default||Lmod; if(!this.L?.map){ this.status.value='Error'; return; }
      if (el.clientHeight<40) el.style.minHeight='180px';
      this.map=this.L.map(el,{center:[this.lat,this.lon],zoom:7,worldCopyJump:true});
      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OSM'}).addTo(this.map);
      this.circle=this.L.circle([this.lat,this.lon],{radius:300000,color:'#38bdf8',weight:1,fillOpacity:0.06}).addTo(this.map);
      const fit=()=>{ if(!this.map||!this.circle) return; try{ this.map.invalidateSize(); this.map.fitBounds(this.circle.getBounds(),{padding:[10,10]}); }catch{} };
      setTimeout(fit,100); setTimeout(fit,400); setTimeout(()=>this.map&&this.map.invalidateSize(),1000);
      await this.loadFrames(); this.startLoop(); this.status.value='Live';
    }catch{ this.status.value='Error'; }
  }
  async loadFrames(){
    this.status.value='Loading frames';
    try{ const res=await fetch('https://api.rainviewer.com/public/weather-maps.json'); const data=await res.json();
      this.frames=[...(data.radar?.past||[]),...(data.radar?.nowcast||[])]; this.index=this.frames.length-1; this.updateOverlay(); this.status.value='Live';
    }catch{ this.status.value='Error'; }
  }
  updateOverlay(){
    if(!this.map||!this.frames.length||!this.L) return; const f=this.frames[this.index]; if(!f?.path) return;
    const url=`https://tilecache.rainviewer.com${f.path}/256/{z}/{x}/{y}/2/1_1.png`;
    if(this.overlay) this.overlay.setUrl(url); else this.overlay=this.L.tileLayer(url,{opacity:0.85,zIndex:400}).addTo(this.map);
  }
  nextFrame(){ if(!this.frames.length) return; this.index=(this.index+1)%this.frames.length; this.updateOverlay(); }
  startLoop(){ this.stopLoop(); this.timer=setInterval(()=>this.nextFrame(),1000); }
  stopLoop(){ if(this.timer) clearInterval(this.timer); }
  destroy(){ this.stopLoop(); if(this.map) this.map.remove(); }
}

const ctrl = new WeatherController(props.lat, props.lon);
const radar = new RadarController(props.lat, props.lon);

const weather = ctrl.weather; const loading = ctrl.loading; const error = ctrl.error;
const currentHourIndex = ctrl.currentHourIndex; const nextHourIndices = ctrl.nextHourIndices;
const shortTime = iso => ctrl.shortTime(iso); const arrowStyle = d => ctrl.arrowStyle(d);
const isDayFromHour = d => ctrl.isDayFromHour(d); const hourIconCode = i => ctrl.hourIconCode(i); const dailyIconCode = i => ctrl.dailyIconCode(i);
const currentTimeFormatted = ctrl.currentTimeFormatted;
const radarExpanded = radar.expanded; const radarStatus = radar.status; const radarLooping = radar.looping;
const toggleRadarSize = () => radar.toggleSize(); const toggleRadarLoop = () => radar.toggleLoop();

onMounted(()=>{ ctrl.load(); nextTick(()=>radar.init()); ctrl.startTimers(); });
onUnmounted(()=>{ ctrl.stopTimers(); radar.destroy(); });

watch(radar.expanded, ()=>{ if(radar.map) setTimeout(()=>radar.map.invalidateSize(),140); });
watch(radar.expanded, ()=>{ if(radar.map) nextTick(()=>radar.map.invalidateSize()); });
watch(()=>ctrl.weather.value?.current_weather?.weathercode, code=>{ const cw=ctrl.weather.value?.current_weather; if(code!=null&&cw) weatherTheme.value=classifyWeather(code, cw.is_day===1); });
</script>
