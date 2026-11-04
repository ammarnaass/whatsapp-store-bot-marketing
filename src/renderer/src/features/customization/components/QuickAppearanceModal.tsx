import React from 'react';
import { X, Palette, RotateCcw } from 'lucide-react';
import { useCustomization } from '../hooks/useCustomization';
import { ThemeModeSelector } from './ThemeModeSelector';
import { AccentColorPicker } from './AccentColorPicker';
import { DisplayDensitySelector } from './DisplayDensitySelector';
import { FontScaleSelector } from './FontScaleSelector';
import { TypographySelector } from './TypographySelector';
import { LiveCustomizationPreview } from './LiveCustomizationPreview';

export const QuickAppearanceModal: React.FC = () => {
  const {
    settings,
    isQuickModalOpen,
    setQuickModalOpen,
    setThemeMode,
    setAccentColor,
    setDensity,
    setZoomScale,
    setFontFamily,
    resetToDefaults,
  } = useCustomization();

  if (!isQuickModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1F293D] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-[#1F293D] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">تخصيص المظهر الشامل ودقة العرض</h3>
              <p className="text-[11px] text-slate-400">تعديل فوري للسمات، مقياس الدقة، الخطوط، وألوان الهوية</p>
            </div>
          </div>
          <button
            onClick={() => setQuickModalOpen(false)}
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Controls Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Live Preview Box */}
          <LiveCustomizationPreview settings={settings} />

          {/* Theme Mode */}
          <ThemeModeSelector currentMode={settings.themeMode} onSelect={setThemeMode} />

          {/* Brand Accent Color */}
          <AccentColorPicker selectedColor={settings.accentColor} onSelect={setAccentColor} />

          {/* Resolution & Scaling Precision */}
          <FontScaleSelector currentScale={settings.zoomScale} onSelect={setZoomScale} />

          {/* Arabic Typography */}
          <TypographySelector currentFont={settings.fontFamily} onSelect={setFontFamily} />

          {/* Display Density */}
          <DisplayDensitySelector currentDensity={settings.density} onSelect={setDensity} />
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-[#1F293D] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={resetToDefaults}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الإعدادات الافتراضية</span>
          </button>

          <button
            type="button"
            onClick={() => setQuickModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            تطبيق وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
