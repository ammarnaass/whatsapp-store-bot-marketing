export type ThemeMode = 'light' | 'dark' | 'system';

export type AccentColor = 'emerald' | 'ocean' | 'indigo' | 'violet' | 'amber' | 'rose';

export type DisplayDensity = 'compact' | 'standard' | 'comfortable';

export type ZoomScale = 80 | 90 | 100 | 110 | 125;

export type SurfaceStyle = 'glass' | 'solid';

export type BorderRadius = 'sharp' | 'rounded' | 'curved';

export type ArabicFontFamily = 'cairo' | 'ibm-plex' | 'system';

export type ScreenBreakpoint = 'mobile' | 'tablet' | 'desktop' | 'ultrawide';

export interface CustomizationSettings {
  themeMode: ThemeMode;
  accentColor: AccentColor;
  density: DisplayDensity;
  zoomScale: ZoomScale;
  surfaceStyle: SurfaceStyle;
  borderRadius: BorderRadius;
  fontFamily: ArabicFontFamily;
}

export interface AccentColorMeta {
  id: AccentColor;
  name: string;
  primary: string;
  accent: string;
  glow: string;
  lightBg: string;
  darkBg: string;
  badge: string;
}
