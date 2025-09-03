// WeatherService: single responsibility wrapper around Open‑Meteo API
export class WeatherService {
  static hourly = [
    'temperature_2m', 'windspeed_10m', 'winddirection_10m',
    'precipitation', 'precipitation_probability', 'weathercode'
  ];
  static daily = [
    'temperature_2m_max', 'temperature_2m_min', 'precipitation_sum', 'weathercode'
  ];

  static buildQuery(lat, lon) {
    return new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current_weather: 'true',
      hourly: this.hourly.join(','),
      daily: this.daily.join(','),
      temperature_unit: 'celsius',
      windspeed_unit: 'kmh',
      precipitation_unit: 'mm',
      timeformat: 'iso8601',
      timezone: 'auto'
    });
  }

  static async fetch(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?${this.buildQuery(lat, lon)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Weather HTTP ${res.status} ${text}`);
    }
    return res.json();
  }
}

// Backwards compatible function export
export async function fetchWeather(lat, lon) {
  return WeatherService.fetch(lat, lon);
}