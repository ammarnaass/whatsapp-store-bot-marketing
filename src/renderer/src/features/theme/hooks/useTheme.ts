import { create } from 'zustand';
import { useEffect } from 'react';
import { ThemeMode, ResolvedTheme, ThemeState } from '../types/theme.types';
import {
  getStoredTheme,
  setStoredTheme,
  resolveTheme,
  applyThemeToDom,
  getSystemTheme
} from '../utils/theme.utils';

interface ThemeStoreState extends ThemeState {
  _init: () => void;
}

const initialMode = getStoredTheme();
const initialResolved = resolveTheme(initialMode);
applyThemeToDom(initialResolved);

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  theme: initialMode,
  resolvedTheme: initialResolved,
  isDark: initialResolved === 'dark',

  setTheme: (mode: ThemeMode) => {
    setStoredTheme(mode);
    const resolved = resolveTheme(mode);
    applyThemeToDom(resolved);
    set({
      theme: mode,
      resolvedTheme: resolved,
      isDark: resolved === 'dark'
    });
  },

  toggleTheme: () => {
    const { resolvedTheme, setTheme } = get();
    const next: ThemeMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  },

  _init: () => {
    const currentMode = get().theme;
    const resolved = resolveTheme(currentMode);
    applyThemeToDom(resolved);
    set({
      resolvedTheme: resolved,
      isDark: resolved === 'dark'
    });
  }
}));

export const useTheme = () => {
  const theme = useThemeStore((s) => s.theme);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const isDark = useThemeStore((s) => s.isDark);
  const setTheme = useThemeStore((s) => s.setTheme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const init = useThemeStore((s) => s._init);

  useEffect(() => {
    init();

    if (theme === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => {
        const newResolved = getSystemTheme();
        applyThemeToDom(newResolved);
        useThemeStore.setState({
          resolvedTheme: newResolved,
          isDark: newResolved === 'dark'
        });
      };

      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [theme, init]);

  return {
    theme,
    resolvedTheme,
    isDark,
    setTheme,
    toggleTheme
  };
};
