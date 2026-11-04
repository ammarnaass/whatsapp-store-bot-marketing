import { CustomizationSettings } from '../types/customization.types';
import { CUSTOMIZATION_STORAGE_KEY, DEFAULT_CUSTOMIZATION } from '../constants/customization.constants';

export function getStoredCustomization(): CustomizationSettings {
  if (typeof window === 'undefined') return DEFAULT_CUSTOMIZATION;
  try {
    const raw = localStorage.getItem(CUSTOMIZATION_STORAGE_KEY);
    if (!raw) return DEFAULT_CUSTOMIZATION;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CUSTOMIZATION, ...parsed };
  } catch {
    return DEFAULT_CUSTOMIZATION;
  }
}

export function setStoredCustomization(settings: CustomizationSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOMIZATION_STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

