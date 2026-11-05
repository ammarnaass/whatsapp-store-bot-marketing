import React, { useState } from 'react';
import { CORE_BRAND_COLORS, BRAND_PALETTES } from '../constants/colors.constants';
import { BrandPaletteId } from '../types/tokens.types';
import { CustomThemeBuilder } from './CustomThemeBuilder';
import { Palette, Sparkles, Layers } from 'lucide-react';

interface ColorPaletteSectionProps {
  currentPaletteId?: BrandPaletteId;
  onSelectPalette?: (id: BrandPaletteId) => void;
}

export const ColorPaletteSection: React.FC<ColorPaletteSectionProps> = ({
  currentPaletteId = 'emerald',
  onSelectPalette,
}) => {
  const [activeTab, setActiveTab] = useState<'studio' | 'presets' | 'tokens'>('studio');

  return (
    <div className="space-y-5">
      {/* Segmented Mode Selector */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab('studio')}
          className={`flex-1 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'studio'
              ? 'bg-white dark:bg-[#111827] text-[#128C7E] dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>استوديو الهوية</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'presets'
              ? 'bg-white dark:bg-[#111827] text-[#128C7E] dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>السمات الجاهزة (6)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tokens')}
          className={`flex-1 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'tokens'
              ? 'bg-white dark:bg-[#111827] text-[#128C7E] dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>رموز النظام</span>
        </button>
      </div>

      {activeTab === 'studio' && <CustomThemeBuilder />}

      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(BRAND_PALETTES).map((pal) => {
            const isSelected = currentPaletteId === pal.id;
            return (
              <div
                key={pal.id}
                onClick={() => onSelectPalette && onSelectPalette(pal.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-[#1F293D] bg-white dark:bg-slate-900/50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border border-white dark:border-slate-800 shadow-xs" style={{ backgroundColor: pal.primary }} />
                    <div className="w-3.5 h-3.5 rounded-full -mr-1 border border-white dark:border-slate-800 shadow-xs" style={{ backgroundColor: pal.accent }} />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{pal.name}</span>
                  </div>
                  {isSelected && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">النشط</span>}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{pal.description}</p>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'tokens' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(CORE_BRAND_COLORS).map(([key, item]) => (
            <div key={key} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg shadow-xs border border-black/10 shrink-0" style={{ backgroundColor: item.hex }} />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{item.name}</div>
                  <div className="text-[11px] font-mono text-slate-500">{item.hex}</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mb-2">{item.usage}</div>
              <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100 dark:border-slate-800 font-mono">
                <span className="text-slate-400">{item.cssVariable}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.contrastOnWhite}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
