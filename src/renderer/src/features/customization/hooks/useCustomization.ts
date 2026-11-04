import { useCustomizationStore } from '../store/useCustomizationStore';
import { ACCENT_PALETTES } from '../constants/customization.constants';

export function useCustomization() {
  const store = useCustomizationStore();
  const currentPalette = ACCENT_PALETTES[store.settings.accentColor] || ACCENT_PALETTES.emerald;

  return {
    ...store,
    currentPalette,
    paletteList: Object.values(ACCENT_PALETTES),
  };
}
