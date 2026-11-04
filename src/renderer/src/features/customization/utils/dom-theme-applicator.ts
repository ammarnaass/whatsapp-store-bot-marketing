import { CustomizationSettings } from '../types/customization.types';
import { ACCENT_PALETTES } from '../constants/customization.constants';
import { injectDynamicAppStyles, PALETTE_SHADES } from './dynamic-style-injector';

export function applyCustomizationToDom(settings: CustomizationSettings): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const palette = ACCENT_PALETTES[settings.accentColor] || ACCENT_PALETTES.emerald;
  const shades = PALETTE_SHADES[settings.accentColor] || { dark: '#075E54' };

  // 1. تطبيق سمة المظهر (Dark / Light / System) بدقة
  let isDark = false;
  if (settings.themeMode === 'dark') {
    isDark = true;
  } else if (settings.themeMode === 'light') {
    isDark = false;
  } else {
    // System
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

  // 2. تطبيق مقياس الدقة والتكبير (Resolution Scaling Precision)
  const zoomFactor = (settings.zoomScale || 100) / 100;
  (root.style as any).zoom = `${zoomFactor}`;

  // 3. تطبيق كلاسات كثافة البيانات (Display Density)
  root.classList.remove('density-compact', 'density-standard', 'density-comfortable');
  root.classList.add(`density-${settings.density || 'standard'}`);

  // 4. تطبيق نمط الأسطح (Glass / Solid)
  root.classList.remove('surface-glass', 'surface-solid');
  root.classList.add(`surface-${settings.surfaceStyle || 'glass'}`);

  // 5. تطبيق زوايا الانحناء (Border Radius Precision)
  root.classList.remove('radius-sharp', 'radius-rounded', 'radius-curved');
  root.classList.add(`radius-${settings.borderRadius || 'rounded'}`);

  // 6. ضبط متغيرات ألوان الهوية مباشرة على العنصر الجذري
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
  root.style.setProperty('--color-emerald-300', palette.accent);
  root.style.setProperty('--color-emerald-400', palette.accent);
  root.style.setProperty('--color-emerald-700', shades.dark);
  root.style.setProperty('--color-emerald-800', shades.dark);

  // 7. حقن أنماط الألوان والخطوط الشاملة
  injectDynamicAppStyles(palette, settings.fontFamily || 'cairo');
}

