import React from 'react';
import { ZoomIn, Monitor } from 'lucide-react';
import { ZoomScale } from '../types/customization.types';

interface FontScaleSelectorProps {
  currentScale: ZoomScale;
  onSelect: (scale: ZoomScale) => void;
}

export const FontScaleSelector: React.FC<FontScaleSelectorProps> = ({ currentScale, onSelect }) => {
  const scales: { value: ZoomScale; label: string }[] = [
    { value: 80, label: 'مدمج (80%)' },
    { value: 90, label: 'خفيف (90%)' },
    { value: 100, label: 'قياسي (100%)' },
    { value: 110, label: 'كبير (110%)' },
    { value: 125, label: 'فائق (125%)' },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Monitor className="w-3.5 h-3.5 text-slate-400" />
          تحديد دقة ومقياس العرض (Display Resolution & Scaling)
        </label>
        <span className="text-xs font-mono font-bold text-[#128C7E]">
          {currentScale}%
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {scales.map((s) => {
          const isSelected = currentScale === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => onSelect(s.value)}
              className={`h-9 px-1 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                isSelected
                  ? 'bg-[#128C7E] text-white border-transparent shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#1F293D] hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{s.value}%</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
