<template>
  <div class="space-y-8">
    <section>
      <label class="block text-sm font-medium mb-2">Search City</label>
      <div class="relative">
        <input
          v-model="query"
            @input="handleInput"
          type="text"
          placeholder="e.g. Berlin"
          class="w-full bg-slate-800/60 border border-slate-700 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-sky-500"
        />
        <ul
          v-if="showResults"
          class="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-700 rounded shadow divide-y divide-slate-700"
        >
          <li
            v-for="c in results"
            :key="c.id"
            @click="addCity(c)"
            class="px-4 py-2 text-sm cursor-pointer hover:bg-slate-700/60 flex justify-between"
          >
            <span>{{ c.name }}<span v-if="c.country">, {{ c.country }}</span></span>
            <span class="opacity-60">{{ c.latitude.toFixed(2) }}, {{ c.longitude.toFixed(2) }}</span>
          </li>
          <li v-if="!loading && !results.length" class="px-4 py-2 text-xs opacity-60">No matches</li>
          <li v-if="loading" class="px-4 py-2 text-xs opacity-60 animate-pulse">Searching...</li>
        </ul>
      </div>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
        Saved Cities
        <span class="text-xs font-normal bg-slate-700/70 px-2 py-0.5 rounded">{{ saved.length }}</span>
      </h2>
      <div v-if="!saved.length" class="text-sm opacity-60">
        Add a city to begin.
      </div>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <CityCard
          v-for="c in saved"
          :key="c.id"
          :city="c"
          @remove="removeCity(c.id)"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { searchCities } from '../services/geocode.js';
import CityCard from '../components/CityCard.vue';

class CityStore {
  constructor(){
    this.query = ref('');
    this.results = ref([]);
    this.loading = ref(false);
    this.showResults = ref(false);
    this.saved = ref(this.load());
    this.timer = null;
    window.addEventListener('click', e => {
      if (!(e.target.closest('input') || e.target.closest('ul'))) this.showResults.value = false;
    });
  }
  load(){ try { return JSON.parse(localStorage.getItem('savedCities')||'[]'); } catch { return []; } }
  persist(){ localStorage.setItem('savedCities', JSON.stringify(this.saved.value)); }
  handleInput(){
    this.showResults.value = true;
    clearTimeout(this.timer);
    if (!this.query.value.trim()) { this.results.value = []; return; }
    this.timer = setTimeout(async () => {
      this.loading.value = true;
      try { this.results.value = await searchCities(this.query.value, 6); }
      catch { this.results.value = []; }
      finally { this.loading.value = false; }
    }, 300);
  }
  addCity(c){
    if (!this.saved.value.find(s => s.id === c.id)) {
      this.saved.value.push({ id:c.id, name:c.name, country:c.country, lat:c.latitude, lon:c.longitude });
      this.persist();
    }
    this.query.value=''; this.results.value=[]; this.showResults.value=false;
  }
  removeCity(id){ this.saved.value = this.saved.value.filter(c=>c.id!==id); this.persist(); }
}

const store = new CityStore();
const { query, results, loading, showResults, saved } = store;
const handleInput = () => store.handleInput();
const addCity = c => store.addCity(c);
const removeCity = id => store.removeCity(id);
</script>

<style lang="scss" scoped></style>
