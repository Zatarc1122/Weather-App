import { ref } from 'vue';

export const weatherTheme = ref('default');

class ThemeClassifier {
  constructor() {
    this.map = new Map([
      ['thunder', [95,96,99]],
      ['snow', [71,73,75,77,85,86]],
      ['rain', [51,53,55,56,57,61,63,65,66,67,80,81,82]],
      ['fog', [45,48]],
      ['cloudy', [2,3]]
    ]);
  }
  classify(code, isDay) {
    for (const [label, codes] of this.map) {
      if (codes.includes(code)) return label;
    }
    if (code === 0 || code === 1) return isDay ? 'clear-day' : 'clear-night';
    return isDay ? 'clear-day' : 'clear-night';
  }
}

const classifier = new ThemeClassifier();
export function classifyWeather(code, isDay) { return classifier.classify(code, isDay); }
