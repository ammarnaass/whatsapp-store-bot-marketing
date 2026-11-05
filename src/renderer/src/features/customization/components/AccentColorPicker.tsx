import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { AccentColor } from '../types/customization.types';
import { ACCENT_PALETTES } from '../constants/customization.constants';

interface AccentColorPickerProps {
  selectedColor: AccentColor;
  onSelect: (color: AccentColor) => void;
  onOpenStudio?: () => void;
}

export const AccentColorPicker: React.FC<AccentColorPickerProps> = ({ selectedColor, onSelect, onOpenStudio }) => {
  const palettes = Object.values(ACCENT_PALETTES);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
          لون هوية المتجر (Accent Color)
        </label>
        <span className="text-[11px] font-semibold text-slate-400">
          {ACCENT_PALETTES[selectedColor]?.name || 'هوية مخصصة'}
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {palettes.map((p) => {
          const isSelected = selectedColor === p.id;
          const isCustom = p.id === 'custom';
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onSelect(p.id);
                if (isCustom && onOpenStudio) onOpenStudio();
              }}
              className={`p-2 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer relative group ${
                isSelected
                  ? 'border-slate-900 dark:border-white shadow-md scale-102 bg-white dark:bg-slate-800'
                  : 'border-slate-200 dark:border-[#1F293D] hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-900/50'
              }`}
              title={p.name}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${
                  isCustom
                    ? 'bg-gradient-to-tr from-[#128C7E] via-sky-500 to-indigo-600 text-white'
                    : ''
                }`}
                style={!isCustom ? { backgroundColor: p.primary, boxShadow: isSelected ? `0 0 12px ${p.glow}` : undefined } : undefined}
              >
                {isCustom ? (
                  <Sparkles className="w-3.5 h-3.5" />
                ) : isSelected ? (
                  <Check className="w-4 h-4 text-white stroke-[2.5]" />
                ) : null}
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full text-center">
                {isCustom ? 'مخصص ✨' : p.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
