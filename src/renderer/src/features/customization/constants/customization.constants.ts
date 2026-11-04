import { AccentColor, AccentColorMeta, CustomizationSettings, DisplayDensity } from '../types/customization.types';

export const CUSTOMIZATION_STORAGE_KEY = 'wasell_app_customization_v1';

export const DEFAULT_CUSTOMIZATION: CustomizationSettings = {
  themeMode: 'system',
  accentColor: 'emerald',
  density: 'standard',
  zoomScale: 100,
  surfaceStyle: 'glass',
  borderRadius: 'rounded',
  fontFamily: 'cairo',
};

export const ACCENT_PALETTES: Record<AccentColor, AccentColorMeta> = {
  emerald: {
    id: 'emerald',
    name: 'أخضر واتساب (الافتراضي)',
    primary: '#128C7E',
    accent: '#25D366',
    glow: 'rgba(18, 140, 126, 0.25)',
    lightBg: '#E7F6F2',
    darkBg: 'rgba(18, 140, 126, 0.15)',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  ocean: {
    id: 'ocean',
    name: 'أزرق محيطي تقني',
    primary: '#0284C7',
    accent: '#38BDF8',
    glow: 'rgba(2, 132, 199, 0.25)',
    lightBg: '#E0F2FE',
    darkBg: 'rgba(2, 132, 199, 0.15)',
    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300',
  },
  indigo: {
    id: 'indigo',
    name: 'نيلي تجاري فاخر',
    primary: '#6366F1',
    accent: '#818CF8',
    glow: 'rgba(99, 102, 241, 0.25)',
    lightBg: '#EEF2FF',
    darkBg: 'rgba(99, 102, 241, 0.15)',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300',
  },
  violet: {
    id: 'violet',
    name: 'أرجواني ذكاء اصطناعي',
    primary: '#7C3AED',
    accent: '#A78BFA',
    glow: 'rgba(124, 58, 237, 0.25)',
    lightBg: '#F3E8FF',
    darkBg: 'rgba(124, 58, 237, 0.15)',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300',
  },
  amber: {
    id: 'amber',
    name: 'ذهبي كهرماني فخم',
    primary: '#D97706',
    accent: '#FBBF24',
    glow: 'rgba(217, 119, 6, 0.25)',
    lightBg: '#FEF3C7',
    darkBg: 'rgba(217, 119, 6, 0.15)',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  },
  rose: {
    id: 'rose',
    name: 'قرمزي عصري جذاب',
    primary: '#E11D48',
    accent: '#FB7185',
    glow: 'rgba(225, 29, 72, 0.25)',
    lightBg: '#FFE4E6',
    darkBg: 'rgba(225, 29, 72, 0.15)',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
  },
};

export const DENSITY_CONFIG: Record<DisplayDensity, { label: string; description: string; spacingClass: string }> = {
  compact: {
    label: 'مكثف (للمحترفين)',
    description: 'حشوات مصغرة لعرض أكبر كمية من الطلبات والبيانات دون تمرير',
    spacingClass: 'app-density-compact',
  },
  standard: {
    label: 'متوازن (الافتراضي)',
    description: 'توزيع قياسي ومريح للعين ملائم لجميع مقاسات الشاشات',
    spacingClass: 'app-density-standard',
  },
  comfortable: {
    label: 'مريح ورحب',
    description: 'حشوات واسعة وأزرار عريضة تناسب الشاشات الكبيرة والمطالعة الممتدة',
    spacingClass: 'app-density-comfortable',
  },
};

