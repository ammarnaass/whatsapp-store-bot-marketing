import React from 'react';
import { Type } from 'lucide-react';
import { ArabicFontFamily } from '../types/customization.types';
import { ARABIC_FONT_FAMILIES } from '../constants/typography.constants';

interface TypographySelectorProps {
  currentFont: ArabicFontFamily;
  onSelect: (font: ArabicFontFamily) => void;
}

export const TypographySelector: React.FC<TypographySelectorProps> = ({ currentFont, onSelect }) => {
  const fontList = Object.values(ARABIC_FONT_FAMILIES);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-slate-400" />
          الخط العربي الافتراضي (Arabic Typography)
        </label>
        <span className="text-[11px] font-semibold text-slate-400">
          {ARABIC_FONT_FAMILIES[currentFont]?.name.split(' ')[0]}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {fontList.map((f) => {
          const isSelected = currentFont === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onSelect(f.id)}
              className={`p-2.5 rounded-2xl border text-right transition-all cursor-pointer ${
                isSelected
                  ? 'border-slate-900 dark:border-white shadow-xs bg-slate-50 dark:bg-slate-800'
                  : 'border-slate-200 dark:border-[#1F293D] hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="font-bold text-xs text-slate-900 dark:text-white" style={{ fontFamily: f.cssFamily }}>
                {f.name}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                {f.subTitle}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

