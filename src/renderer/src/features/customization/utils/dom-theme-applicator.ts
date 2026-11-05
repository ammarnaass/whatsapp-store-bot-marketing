import { CustomizationSettings, AccentColorMeta } from '../types/customization.types';
import { ACCENT_PALETTES } from '../constants/customization.constants';
import { injectDynamicAppStyles, PALETTE_SHADES } from './dynamic-style-injector';
import {
  adjustBrightness,
  generateGlowColor,
  generateLightBackground,
  generateDarkBackground,
  normalizeHex,
} from '../../../design-system/utils/color-converter.utils';

export function applyCustomizationToDom(settings: CustomizationSettings): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  let palette: AccentColorMeta;
  let shades: { dark: string };

  if (settings.accentColor === 'custom' && settings.customPalette) {
    const cp = settings.customPalette;
    const normPrimary = normalizeHex(cp.primary, '#128C7E');
    const normAccent = normalizeHex(cp.accent, '#25D366');
    const darkShade = cp.dark || adjustBrightness(normPrimary, -25);
    const glow = cp.glow || generateGlowColor(normPrimary, 0.25);
    const lightBg = cp.lightBg || generateLightBackground(normPrimary);
    const darkBg = cp.darkBg || generateDarkBackground(normPrimary);

    palette = {
      id: 'custom',
      name: cp.name || 'هوية مخصصة',
      primary: normPrimary,
      accent: normAccent,
      glow,
      lightBg,
      darkBg,
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    };
    shades = { dark: darkShade };
  } else {
    palette = ACCENT_PALETTES[settings.accentColor] || ACCENT_PALETTES.emerald;
    shades = PALETTE_SHADES[settings.accentColor] || { dark: '#075E54' };
  }

  // 1. تطبيق سمة المظهر (Dark / Light / System) بدقة
  let isDark = false;
  if (settings.themeMode === 'dark') {
    isDark = true;
  } else if (settings.themeMode === 'light') {
    isDark = false;
  } else {
    isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  try {
    localStorage.setItem('wasell_theme', settings.themeMode);
  } catch {}

  // 2. تطبيق مقياس الدقة والتكبير
  const zoomFactor = (settings.zoomScale || 100) / 100;
  (root.style as any).zoom = `${zoomFactor}`;

  // 3. تطبيق كلاسات كثافة البيانات ونمط الأسطح وزوايا الانحناء
  root.classList.remove('density-compact', 'density-standard', 'density-comfortable');
  root.classList.add(`density-${settings.density || 'standard'}`);
  root.classList.remove('surface-glass', 'surface-solid');
  root.classList.add(`surface-${settings.surfaceStyle || 'glass'}`);
  root.classList.remove('radius-sharp', 'radius-rounded', 'radius-curved');
  root.classList.add(`radius-${settings.borderRadius || 'rounded'}`);

  // 4. ضبط متغيرات ألوان الهوية مباشرة على العنصر الجذري
  root.style.setProperty('--color-primary', palette.primary);
  root.style.setProperty('--color-primary-dark', shades.dark);
  root.style.setProperty('--color-primary-light', palette.lightBg);
  root.style.setProperty('--color-brand-primary', palette.primary);
  root.style.setProperty('--color-brand-accent', palette.accent);
  root.style.setProperty('--color-brand-glow', palette.glow);
  root.style.setProperty('--color-brand-light-bg', palette.lightBg);
  root.style.setProperty('--color-brand-dark-bg', palette.darkBg);
  root.style.setProperty('--color-whatsapp-emerald', palette.accent);
  root.style.setProperty('--color-emerald-50', palette.lightBg);
  root.style.setProperty('--color-emerald-500', palette.primary);
  root.style.setProperty('--color-emerald-600', palette.primary);
  root.style.setProperty('--color-emerald-700', shades.dark);

  // 5. حقن أنماط الألوان والخطوط الشاملة
  injectDynamicAppStyles(palette, settings.fontFamily || 'cairo');
}
