## Weather App

Vue 3 + Vite single page weather dashboard.

### Features
- Current, hourly (next 12), and daily forecasts (Open‑Meteo)
- Themed animated + image backgrounds (day/night & conditions)
- Leaflet map with RainViewer radar loop (play/pause, resize)
- Saved cities (localStorage)
- Accessible keyboard nav & reduced‑motion support

### Install
```
npm install
```

### Dev
```
npm run dev
```

### Build
```
npm run build
```

### Deploy (GitHub Pages quick example)
If repo root contains multiple projects keep base path:
```
// vite.config.js
export default defineConfig({
	base: '/REPO_NAME/',
	plugins: [vue()] 
});
```
Then:
```
npm run build
```
Publish `dist` directory (e.g. gh-pages branch, Netlify, Vercel).

### Env / Config
No API keys required (public Open‑Meteo & RainViewer endpoints).

### License / Data Attribution
Weather: Open‑Meteo. Radar tiles: RainViewer. Maps: © OpenStreetMap contributors.
