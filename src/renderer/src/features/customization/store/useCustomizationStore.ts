import { create } from 'zustand';
import {
  CustomizationSettings,
  AccentColor,
  DisplayDensity,
  ZoomScale,
  SurfaceStyle,
  BorderRadius,
  ArabicFontFamily,
  ThemeMode,
} from '../types/customization.types';
import { CustomBrandPalette } from '../../../design-system/types/tokens.types';
import { DEFAULT_CUSTOMIZATION } from '../constants/customization.constants';
import {
  getStoredCustomization,
  setStoredCustomization,
  applyCustomizationToDom,
} from '../utils/customization.utils';

interface CustomizationState {
  settings: CustomizationSettings;
  isQuickModalOpen: boolean;
  setQuickModalOpen: (open: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  setCustomPalette: (palette: CustomBrandPalette) => void;
  setDensity: (density: DisplayDensity) => void;
  setZoomScale: (scale: ZoomScale) => void;
  setSurfaceStyle: (style: SurfaceStyle) => void;
  setBorderRadius: (radius: BorderRadius) => void;
  setFontFamily: (font: ArabicFontFamily) => void;
  updateSettings: (partial: Partial<CustomizationSettings>) => void;
  resetToDefaults: () => void;
  initCustomization: () => void;
}

const initialSettings = getStoredCustomization();
applyCustomizationToDom(initialSettings);

export const useCustomizationStore = create<CustomizationState>((set, get) => ({
  settings: initialSettings,
  isQuickModalOpen: false,

  setQuickModalOpen: (open) => set({ isQuickModalOpen: open }),

  updateSettings: (partial) => {
    const updated = { ...get().settings, ...partial };
    setStoredCustomization(updated);
    applyCustomizationToDom(updated);
    set({ settings: updated });
  },

  setThemeMode: (mode) => get().updateSettings({ themeMode: mode }),
  setAccentColor: (color) => get().updateSettings({ accentColor: color }),
  setCustomPalette: (palette) => get().updateSettings({ accentColor: 'custom', customPalette: palette }),
  setDensity: (density) => get().updateSettings({ density }),
  setZoomScale: (scale) => get().updateSettings({ zoomScale: scale }),
  setSurfaceStyle: (style) => get().updateSettings({ surfaceStyle: style }),
  setBorderRadius: (radius) => get().updateSettings({ borderRadius: radius }),
  setFontFamily: (font) => get().updateSettings({ fontFamily: font }),

  resetToDefaults: () => {
    setStoredCustomization(DEFAULT_CUSTOMIZATION);
    applyCustomizationToDom(DEFAULT_CUSTOMIZATION);
    set({ settings: DEFAULT_CUSTOMIZATION });
  },

  initCustomization: () => {
    const s = getStoredCustomization();
    applyCustomizationToDom(s);
    set({ settings: s });
  },
}));
