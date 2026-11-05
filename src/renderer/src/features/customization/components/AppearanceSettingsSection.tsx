import React, { useState } from 'react';
import { Palette, RotateCcw, Layers } from 'lucide-react';
import { useCustomization } from '../hooks/useCustomization';
import { useScreenBreakpoint } from '../hooks/useScreenBreakpoint';
import { ThemeModeSelector } from './ThemeModeSelector';
import { AccentColorPicker } from './AccentColorPicker';
import { DisplayDensitySelector } from './DisplayDensitySelector';
import { FontScaleSelector } from './FontScaleSelector';
import { TypographySelector } from './TypographySelector';
import { BorderRadiusSelector } from './BorderRadiusSelector';
import { SurfaceStyleSelector } from './SurfaceStyleSelector';
import { LiveCustomizationPreview } from './LiveCustomizationPreview';
import { DesignSystemModal } from '../../../design-system';

export const AppearanceSettingsSection: React.FC = () => {
  const [isDsModalOpen, setIsDsModalOpen] = useState(false);
  const {
    settings,
    setThemeMode,
    setAccentColor,
    setDensity,
    setZoomScale,
    setSurfaceStyle,
    setBorderRadius,
    setFontFamily,
    resetToDefaults,
  } = useCustomization();

  const { width, height, breakpoint } = useScreenBreakpoint();

  const bpLabels: Record<string, string> = {
    mobile: 'هاتف ذكي (Mobile)',
    tablet: 'جهاز لوحي (Tablet)',
    desktop: 'حاسوب مكتبي (Desktop)',
    ultrawide: 'شاشة عريضة (UltraWide)',
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 sm:p-6 space-y-5 elevation-1">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              المظهر وتخصيص الواجهة الشاملة ودقة العرض
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              تحديد ألوان الهوية، نوع الخط، دقة التكبير، وكثافة الجداول المتجاوبة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDsModalOpen(true)}
            className="h-8 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>نظام التصميم</span>
          </button>

          <button
            type="button"
            onClick={resetToDefaults}
            className="h-8 px-3 rounded-xl border border-slate-200 dark:border-[#1F293D] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>استعادة الافتراضي</span>
          </button>
        </div>
      </div>

      {/* Screen Breakpoint Diagnostic Pill */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-[#1F293D] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-700 dark:text-slate-300">
            الدقة المكتشفة: {bpLabels[breakpoint] || breakpoint}
          </span>
        </div>
        <span className="font-mono text-slate-400 text-[11px]">
          {width} × {height} بكسل • زوم {settings.zoomScale}%
        </span>
      </div>

      {/* Live Preview Sample */}
      <LiveCustomizationPreview settings={settings} />

      {/* Selectors Grid */}
      <div className="space-y-4">
        <ThemeModeSelector currentMode={settings.themeMode} onSelect={setThemeMode} />
        <AccentColorPicker selectedColor={settings.accentColor} onSelect={setAccentColor} onOpenStudio={() => setIsDsModalOpen(true)} />
        <FontScaleSelector currentScale={settings.zoomScale} onSelect={setZoomScale} />
        <TypographySelector currentFont={settings.fontFamily} onSelect={setFontFamily} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DisplayDensitySelector currentDensity={settings.density} onSelect={setDensity} />
          <BorderRadiusSelector currentRadius={settings.borderRadius} onSelect={setBorderRadius} />
        </div>
        <SurfaceStyleSelector currentStyle={settings.surfaceStyle} onSelect={setSurfaceStyle} />
      </div>

      {/* نافذة استعراض نظام التصميم التفاعلية */}
      <DesignSystemModal isOpen={isDsModalOpen} onClose={() => setIsDsModalOpen(false)} />
    </div>
  );
};
