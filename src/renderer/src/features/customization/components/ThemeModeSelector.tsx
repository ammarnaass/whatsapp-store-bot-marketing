import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { ThemeMode } from '../types/customization.types';
import { useThemeStore } from '../../theme';

interface ThemeModeSelectorProps {
  currentMode: ThemeMode;
  onSelect: (mode: ThemeMode) => void;
}

export const ThemeModeSelector: React.FC<ThemeModeSelectorProps> = ({ currentMode, onSelect }) => {
  const { setTheme } = useThemeStore();

  const options: { id: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'light', label: 'الوضع الفاتح', icon: Sun },
    { id: 'dark', label: 'الوضع الداكن', icon: Moon },
    { id: 'system', label: 'تلقائي (النظام)', icon: Monitor },
  ];

  const handleSelect = (mode: ThemeMode) => {
    onSelect(mode);
    setTheme(mode);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
        سمة المظهر (Theme Mode)
      </label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = currentMode === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              className={`h-11 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#1F293D] hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

