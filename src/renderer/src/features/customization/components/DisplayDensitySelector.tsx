import React from 'react';
import { AlignJustify, LayoutGrid, StretchHorizontal } from 'lucide-react';
import { DisplayDensity } from '../types/customization.types';
import { DENSITY_CONFIG } from '../constants/customization.constants';

interface DisplayDensitySelectorProps {
  currentDensity: DisplayDensity;
  onSelect: (density: DisplayDensity) => void;
}

export const DisplayDensitySelector: React.FC<DisplayDensitySelectorProps> = ({ currentDensity, onSelect }) => {
  const options: { id: DisplayDensity; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'compact', icon: AlignJustify },
    { id: 'standard', icon: LayoutGrid },
    { id: 'comfortable', icon: StretchHorizontal },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
          كثافة عناصر الواجهة (UI Density)
        </label>
        <span className="text-[11px] text-slate-400">
          {DENSITY_CONFIG[currentDensity]?.label}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {options.map((opt) => {
          const config = DENSITY_CONFIG[opt.id];
          const Icon = opt.icon;
          const isSelected = currentDensity === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                isSelected
                  ? 'border-[#128C7E] bg-[#128C7E]/5 dark:bg-[#128C7E]/15 shadow-xs'
                  : 'border-slate-200 dark:border-[#1F293D] bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isSelected ? 'text-[#128C7E] dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {config.label}
                </span>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#128C7E]' : 'text-slate-400'}`} />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {config.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

