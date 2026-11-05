export function isValidHex(hex: string): boolean {
  if (!hex || typeof hex !== 'string') return false;
  const clean = hex.trim();
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(clean);
}

export function normalizeHex(hex: string, fallback = '#128C7E'): string {
  if (!hex || typeof hex !== 'string') return fallback;
  let clean = hex.trim();
  if (!clean.startsWith('#')) clean = `#${clean}`;
  if (/^#[A-Fa-f0-9]{3}$/.test(clean)) {
    clean = `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
  }
  return /^#[A-Fa-f0-9]{6}$/.test(clean) ? clean.toUpperCase() : fallback;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const norm = normalizeHex(hex, '');
  if (!norm) return null;
  const num = parseInt(norm.slice(1), 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`.toUpperCase();
}

export function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const factor = 1 + percent / 100;
  return rgbToHex(rgb.r * factor, rgb.g * factor, rgb.b * factor);
}

export function generateGlowColor(hex: string, opacity = 0.25): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(18, 140, 126, ${opacity})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

export function generateLightBackground(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#E7F6F2';
  // مزج اللون بنسبة 10% مع الأبيض النقي 90%
  const mix = (channel: number) => Math.round(channel * 0.12 + 255 * 0.88);
  return rgbToHex(mix(rgb.r), mix(rgb.g), mix(rgb.b));
}

export function generateDarkBackground(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#064E3B';
  // مزج اللون بنسبة 20% مع خلفية داكنة جداً
  const mix = (channel: number) => Math.round(channel * 0.25 + 15 * 0.75);
  return rgbToHex(mix(rgb.r), mix(rgb.g), mix(rgb.b));
}

