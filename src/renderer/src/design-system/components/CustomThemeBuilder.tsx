import React, { useState } from 'react';
import { Palette, Check, Sparkles, RefreshCw } from 'lucide-react';
import { normalizeHex, isValidHex } from '../utils/color-converter.utils';
import { evaluatePaletteContrast } from '../utils/contrast-validator.utils';
import { ContrastRatioBadge } from './ContrastRatioBadge';
import { ThemeLivePreviewCard } from './ThemeLivePreviewCard';
import { useCustomizationStore } from '../../features/customization';

const QUICK_PRESETS = [
  { name: 'أزرق أعمال تقني', primary: '#0284C7', accent: '#38BDF8' },
  { name: 'ذهبي كلاسيكي', primary: '#B45309', accent: '#FBBF24' },
  { name: 'بنفسجي رقمي', primary: '#7C3AED', accent: '#A78BFA' },
  { name: 'وردي عصري', primary: '#E11D48', accent: '#FB7185' },
  { name: 'أخضر واسل القياسي', primary: '#128C7E', accent: '#25D366' },
];

export const CustomThemeBuilder: React.FC = () => {
  const { settings, setCustomPalette } = useCustomizationStore();
  const initialPrimary = settings.customPalette?.primary || '#128C7E';
  const initialAccent = settings.customPalette?.accent || '#25D366';

  const [primary, setPrimary] = useState(initialPrimary);
  const [accent, setAccent] = useState(initialAccent);
  const [isSaved, setIsSaved] = useState(false);

  const cleanPrimary = normalizeHex(primary, '#128C7E');
  const cleanAccent = normalizeHex(accent, '#25D366');
  const contrastCheck = evaluatePaletteContrast(cleanPrimary, cleanAccent);

  const handleApply = () => {
    setCustomPalette({ primary: cleanPrimary, accent: cleanAccent });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div className="lg:col-span-7 space-y-4">
        {/* Quick Inspiration Swatches */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">إلهام سريع للهوية</label>
          <div className="flex flex-wrap gap-2">
            {QUICK_PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => { setPrimary(p.primary); setAccent(p.accent); }}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#1F293D] hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: p.primary }} />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs for Primary & Accent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl border border-slate-200 dark:border-[#1F293D] bg-slate-50/50 dark:bg-slate-900/30">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">اللون الرئيسي (Primary)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={cleanPrimary}
                onChange={(e) => setPrimary(e.target.value.toUpperCase())}
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent shrink-0"
              />
              <input
                type="text"
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
                placeholder="#128C7E"
                maxLength={7}
                className="w-full h-10 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white uppercase"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl border border-slate-200 dark:border-[#1F293D] bg-slate-50/50 dark:bg-slate-900/30">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">لون التمييز (Accent)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={cleanAccent}
                onChange={(e) => setAccent(e.target.value.toUpperCase())}
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent shrink-0"
              />
              <input
                type="text"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                placeholder="#25D366"
                maxLength={7}
                className="w-full h-10 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white uppercase"
              />
            </div>
          </div>
        </div>

        {/* Accessibility Contrast Checkers */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">مؤشرات سهولة القراءة والتباين (WCAG 2.1)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <ContrastRatioBadge label="النص الأبيض على اللون الرئيسي" rating={contrastCheck.primaryOnWhite} />
            <ContrastRatioBadge label="اللون الرئيسي على الوضع الليلي" rating={contrastCheck.primaryOnDark} />
          </div>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[#128C7E] to-[#0D6D61] text-white text-xs font-bold shadow-md shadow-[#128C7E]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
          <span>{isSaved ? 'تم تطبيق الهوية بنجاح على المتجر!' : 'تطبيق وحفظ الهوية في النظام'}</span>
        </button>
      </div>

      <div className="lg:col-span-5">
        <ThemeLivePreviewCard primaryHex={cleanPrimary} accentHex={cleanAccent} />
      </div>
    </div>
  );
};

