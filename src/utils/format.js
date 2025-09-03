export function formatTime24(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

// 8-point compass helper returning direction label and rotation (deg)
export function windDirectionInfo(deg) {
  if (typeof deg !== 'number' || !isFinite(deg)) {
    return { dir: '?', rotation: 0 };
  }
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  const idx = Math.round(deg / 45) % 8;
  // Normalize rotation 0-359
  const rotation = ((deg % 360) + 360) % 360;
  return { dir: dirs[idx], rotation };
}

// Convenience formatter if needed elsewhere
export function formatWindDirection(deg) {
  const { dir } = windDirectionInfo(deg);
  if (dir === '?') return '?';
  return dir;
}