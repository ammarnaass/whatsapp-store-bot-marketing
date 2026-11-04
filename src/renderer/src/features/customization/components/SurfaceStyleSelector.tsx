import React from 'react';
import { Sparkles, Square } from 'lucide-react';
import { SurfaceStyle } from '../types/customization.types';

interface SurfaceStyleSelectorProps {
  currentStyle: SurfaceStyle;
  onSelect: (style: SurfaceStyle) => void;
}

export const SurfaceStyleSelector: React.FC<SurfaceStyleSelectorProps> = ({ currentStyle, onSelect }) => {
  const options: { id: SurfaceStyle; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'glass',
      label: 'نمط زجاجي بلوري (Glassmorphism)',
      desc: 'شفافيات ناعمة مع تأثير ضبابي خفيف وعمق بصري راقٍ',
      icon: Sparkles,
    },
    {
      id: 'solid',
      label: 'نمط مصمت كلاسيكي (Solid Clean)',
      desc: 'ألوان ثابتة بدون شفافيات لأقصى تباين وأداء فائق',
      icon: Square,
    },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
        نمط الأسطح والتأثيرات البصرية
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = currentStyle === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`p-3 rounded-2xl border text-right transition-all flex items-start gap-2.5 cursor-pointer ${
                isSelected
                  ? 'border-[#128C7E] bg-[#128C7E]/5 dark:bg-[#128C7E]/15 shadow-xs'
                  : 'border-slate-200 dark:border-[#1F293D] bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#128C7E] text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <span className={`text-xs font-bold block ${isSelected ? 'text-[#128C7E] dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {opt.label}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                  {opt.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

