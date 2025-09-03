<template>
  <div class="fixed inset-0 -z-10">
    <transition name="fade-bg" mode="out-in">
      <div :key="activeKey" class="w-full h-full">
  <picture v-if="loadedSrc" class="block w-full h-full animate-fade-in">
          <!-- Mobile AVIF/WebP/JPG -->
          <source v-if="hasMobile" :srcset="mobileAvif" type="image/avif" media="(max-width: 640px)" />
          <source v-if="hasMobile" :srcset="mobileWebp" type="image/webp" media="(max-width: 640px)" />
          <source v-if="hasMobile" :srcset="mobileJpg" media="(max-width: 640px)" />
          <!-- Desktop AVIF/WebP/JPG -->
          <source :srcset="desktopAvif" type="image/avif" />
          <source :srcset="desktopWebp" type="image/webp" />
          <img :src="desktopJpg" :alt="theme + ' background'" class="w-full h-full object-cover object-center select-none pointer-events-none" decoding="async" />
        </picture>
  <div v-else class="w-full h-full bg-gradient-to-b from-slate-900 to-slate-800" />
        <!-- Overlay veil and animated effect layer -->
  <div class="absolute inset-0 bg-slate-900/65 backdrop-blur-[2px]" />
        <div class="absolute inset-0" :class="animationClass" />
        <!-- Blur-up placeholder layered underneath image (removed after load) -->
        <img v-if="!imageLoaded && tinyPlaceholder" :src="tinyPlaceholder" class="absolute inset-0 w-full h-full object-cover blur-xl scale-105 opacity-70 transition-opacity duration-700" alt="" aria-hidden="true" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { weatherTheme as theme } from '../stores/weatherTheme.js';

class BackgroundManager {
  constructor(themeRef){
    this.theme = themeRef;
    this.loadedSrc = ref(false);
    this.imageLoaded = ref(false);
    this.activeKey = ref(0);
  }
  baseNames = {
    'clear-day': 'clear-day',
    'clear-night': 'clear-night',
    'cloudy': 'cloudy',
    'rain': 'rain',
    'snow': 'snow',
    'thunder': 'thunder',
    'fog': 'fog',
    'default': 'clear-day'
  };
  currentBase = computed(() => this.baseNames[this.theme.value] || this.baseNames['default']);
  path(name, variant, ext){
    const base = import.meta.env.BASE_URL || '/';
    return `${base}backgrounds/${name}${variant ? '-' + variant : ''}.${ext}`;
  }
  desktopAvif = computed(() => this.path(this.currentBase.value, 'desktop', 'avif'));
  desktopWebp = computed(() => this.path(this.currentBase.value, 'desktop', 'webp'));
  desktopJpg  = computed(() => this.path(this.currentBase.value, 'desktop', 'jpg'));
  mobileAvif = computed(() => this.path(this.currentBase.value, 'mobile', 'avif'));
  mobileWebp = computed(() => this.path(this.currentBase.value, 'mobile', 'webp'));
  mobileJpg  = computed(() => this.path(this.currentBase.value, 'mobile', 'jpg'));
  tinyPlaceholder = computed(() => this.path(this.currentBase.value, 'tiny', 'jpg'));
  animationClass = computed(() => {
    const map = {
      'clear-day':'anim-sun','clear-night':'anim-stars','cloudy':'anim-clouds',
      'rain':'anim-rain','snow':'anim-snow','thunder':'anim-thunder','fog':'anim-fog'
    };
    return map[this.theme.value] || 'anim-sun';
  });
  async test(url){
    return await new Promise(r => { const i=new Image(); i.onload=()=>r(true); i.onerror=()=>r(false); i.src=url; });
  }
  async load(){
    this.imageLoaded.value = false;
    this.loadedSrc.value = false;
    for (const url of [this.desktopAvif.value, this.desktopWebp.value, this.desktopJpg.value]){
      // eslint-disable-next-line no-await-in-loop
      if (await this.test(url)) { this.loadedSrc.value = true; break; }
    }
    requestAnimationFrame(()=>{ this.imageLoaded.value = true; this.activeKey.value++; });
  }
}

const mgr = new BackgroundManager(theme);
const { loadedSrc, imageLoaded, activeKey } = mgr;
const { desktopAvif, desktopWebp, desktopJpg, mobileAvif, mobileWebp, mobileJpg, tinyPlaceholder, animationClass } = mgr;
const hasMobile = true;

watch(mgr.currentBase, () => mgr.load());
onMounted(() => mgr.load());
</script>

<style scoped>
.animate-fade-in { animation: fadeImg 1.2s ease both; }
.blur-support:empty { display:none; }
.fade-bg-enter-active, .fade-bg-leave-active { transition: opacity 0.9s ease; }
.fade-bg-enter-from, .fade-bg-leave-to { opacity:0; }

.anim-sun { background: repeating-conic-gradient(rgba(255,255,255,0.06) 0deg, rgba(255,255,255,0) 20deg); animation: spin 50s linear infinite; mix-blend-mode: overlay; opacity:0.4; }
.anim-stars { background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Ccircle cx='10' cy='20' r='1'/%3E%3Ccircle cx='40' cy='80' r='1.2'/%3E%3Ccircle cx='90' cy='50' r='1'/%3E%3Ccircle cx='130' cy='30' r='1.3'/%3E%3Ccircle cx='70' cy='120' r='1.1'/%3E%3Ccircle cx='20' cy='140' r='1'/%3E%3Ccircle cx='150' cy='100' r='1.2'/%3E%3C/g%3E%3C/svg%3E"); animation: drift 90s linear infinite; background-size:320px 320px; mix-blend-mode:screen; opacity:0.55; }
.anim-clouds { background: linear-gradient(90deg, rgba(255,255,255,0.07) 25%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.07) 75%); background-size:800% 100%; animation: slide 55s linear infinite; opacity:0.4; }
.anim-rain { background-image: repeating-linear-gradient(115deg, rgba(255,255,255,0.10) 0 2px, rgba(255,255,255,0) 2px 12px); animation: rain 1.3s linear infinite; opacity:0.35; }
.anim-snow { background-image: radial-gradient(circle at 10% 20%, rgba(255,255,255,0.7) 0 2px, transparent 3px), radial-gradient(circle at 70% 40%, rgba(255,255,255,0.6) 0 2px, transparent 3px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.65) 0 2px, transparent 3px); animation: snow 20s linear infinite; background-size:420px 420px; opacity:0.55; }
.anim-thunder { background: radial-gradient(circle at 60% 40%, rgba(255,255,255,0.3), transparent 60%); animation: flash 7s linear infinite; opacity:0.7; mix-blend-mode:overlay; }
.anim-fog { background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22), rgba(255,255,255,0.02) 70%); filter: blur(3px); animation: pulse 13s ease-in-out infinite; opacity:0.55; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes drift { to { background-position: 320px 320px; } }
@keyframes slide { to { background-position: 800% 0; } }
@keyframes rain { to { background-position: 0 45px; } }
@keyframes snow { to { background-position: 420px 420px; } }
@keyframes flash { 0%,92%,100% { opacity:0.2; } 93% { opacity:0.85; } 94% { opacity:0.25; } 95% { opacity:0.8; } }
@keyframes pulse { 0%,100% { opacity:0.5; } 50% { opacity:0.65; } }
@keyframes fadeImg { from { opacity:0; filter:blur(8px); transform:scale(1.02);} to { opacity:1; filter:blur(0); transform:scale(1);} }
</style>
