export type ThemeMode = 'light' | 'dark' | 'system';

export type BrandPaletteId = 'emerald' | 'ocean' | 'indigo' | 'violet' | 'amber' | 'rose' | 'custom';

export interface CustomBrandPalette {
  primary: string;
  accent: string;
  glow?: string;
  dark?: string;
  lightBg?: string;
  darkBg?: string;
  name?: string;
}

export interface ContrastRating {
  ratio: number;
  ratioText: string;
  level: 'AAA' | 'AA' | 'FAIL';
  isAccessible: boolean;
  message: string;
}

export interface PaletteContrastCheck {
  primaryOnWhite: ContrastRating;
  primaryOnDark: ContrastRating;
  accentOnDark: ContrastRating;
  overallAccessible: boolean;
}

export interface ColorTokenMeta {
  name: string;
  hex: string;
  darkHex?: string;
  cssVariable: string;
  usage: string;
  contrastOnWhite: string;
  contrastOnDark: string;
}

export interface BrandPaletteMeta {
  id: BrandPaletteId;
  name: string;
  nameEn: string;
  primary: string;
  accent: string;
  glow: string;
  lightBg: string;
  darkBg: string;
  badgeClass: string;
  description: string;
}

export interface TypographyToken {
  level: 'display' | 'section' | 'card' | 'body' | 'caption' | 'micro';
  label: string;
  sizePx: number;
  sizeRem: string;
  weight: number;
  weightLabel: string;
  lineHeight: number;
  sampleAr: string;
}

export interface ElevationToken {
  level: 1 | 2 | 3 | 4;
  label: string;
  shadow: string;
  darkShadow: string;
  purpose: string;
}

export interface ComponentSample {
  id: string;
  name: string;
  category: 'buttons' | 'badges' | 'cards' | 'inputs' | 'chat';
}
