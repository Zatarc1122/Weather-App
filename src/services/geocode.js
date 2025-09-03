/*
  searchCities
  -------------
  Lightweight wrapper around Open‑Meteo's free geocoding endpoint.
  Returns an array of city objects (or empty list) for a partial name.
*/
export async function searchCities(query, limit = 5) {
  if (!query?.trim()) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=${limit}&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocode HTTP ' + res.status);
  const data = await res.json();
  return data.results || [];
}