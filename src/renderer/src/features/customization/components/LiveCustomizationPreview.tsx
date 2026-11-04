import React from 'react';
import { ShoppingBag, Star, MessageSquare } from 'lucide-react';
import { CustomizationSettings } from '../types/customization.types';
import { ACCENT_PALETTES } from '../constants/customization.constants';
import { ARABIC_FONT_FAMILIES } from '../constants/typography.constants';

interface LiveCustomizationPreviewProps {
  settings: CustomizationSettings;
}

export const LiveCustomizationPreview: React.FC<LiveCustomizationPreviewProps> = ({ settings }) => {
  const palette = ACCENT_PALETTES[settings.accentColor] || ACCENT_PALETTES.emerald;
  const fontConfig = ARABIC_FONT_FAMILIES[settings.fontFamily] || ARABIC_FONT_FAMILIES.cairo;

  const radiusClass =
    settings.borderRadius === 'sharp' ? 'rounded-md' : settings.borderRadius === 'curved' ? 'rounded-3xl' : 'rounded-2xl';

  return (
    <div className="p-4 rounded-3xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>معاينة حية للمتجر (Live Theme Preview)</span>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {palette.name.split(' ')[0]} • {settings.zoomScale}%
        </span>
      </div>

      <div
        className={`bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] p-3.5 ${radiusClass} shadow-xs flex items-center justify-between gap-3 transition-all`}
        style={{ fontFamily: fontConfig.cssFamily }}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 ${radiusClass} flex items-center justify-center text-white font-black shadow-xs`}
            style={{ backgroundColor: palette.primary }}
          >
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>سماعة بلوتوث احترافية</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold" style={{ backgroundColor: palette.lightBg, color: palette.primary }}>
                مميز
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
              <span className="font-black text-slate-800 dark:text-slate-200">189 ر.س</span>
              <span className="flex items-center gap-0.5 text-amber-500 text-[10px]"><Star className="w-3 h-3 fill-amber-500" /> 4.9</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className={`h-8 px-3 ${radiusClass} text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer`}
          style={{ backgroundColor: palette.primary }}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>طلب واتساب</span>
        </button>
      </div>
    </div>
  );
};

