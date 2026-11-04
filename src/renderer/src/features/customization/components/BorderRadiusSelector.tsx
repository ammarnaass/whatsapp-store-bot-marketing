import React from 'react';
import { Square, Check } from 'lucide-react';
import { BorderRadius } from '../types/customization.types';

interface BorderRadiusSelectorProps {
  currentRadius: BorderRadius;
  onSelect: (radius: BorderRadius) => void;
}

export const BorderRadiusSelector: React.FC<BorderRadiusSelectorProps> = ({ currentRadius, onSelect }) => {
  const options: { id: BorderRadius; label: string; desc: string; previewClass: string }[] = [
    { id: 'sharp', label: 'حاد (Sharp)', desc: 'زوايا 6px كلاسيكية', previewClass: 'rounded-xs' },
    { id: 'rounded', label: 'ناعم (Rounded)', desc: 'زوايا 12px متوازنة', previewClass: 'rounded-xl' },
    { id: 'curved', label: 'عصري (Curved)', desc: 'زوايا 20px بيضاوية', previewClass: 'rounded-3xl' },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
        انحناء زوايا البطاقات والأزرار (Border Radius)
      </label>

      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const isSelected = currentRadius === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                isSelected
                  ? 'border-slate-900 dark:border-white shadow-xs bg-slate-50 dark:bg-slate-800'
                  : 'border-slate-200 dark:border-[#1F293D] hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className={`w-8 h-8 border-2 border-[#128C7E] flex items-center justify-center ${opt.previewClass}`}>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#128C7E]" />}
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{opt.label}</span>
              <span className="text-[10px] text-slate-400">{opt.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

