import React from 'react';
import { TYPOGRAPHY_SCALE } from '../constants/typography.constants';

export const TypographyScaleSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
        <span className="font-bold">ملاحظة هندسية حول الخط العربي: </span>
        تعتمد المنصة خط <strong>Cairo</strong> للعناوين والشاشات التفاعلية مع دعم كامل لأرقام Tabular Numerals. الحد الأدنى المسموح به لأي شارة أو نص عربي هو <strong>11px</strong> لضمان الوضوح التام وعدم تلاصق الحروف.
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm">
        {TYPOGRAPHY_SCALE.map((item) => (
          <div key={item.level} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="min-w-[190px] shrink-0">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {item.label}
              </span>
              <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                {item.sizePx}px ({item.sizeRem}) • {item.weightLabel}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p
                style={{
                  fontSize: `${item.sizePx}px`,
                  fontWeight: item.weight,
                  lineHeight: item.lineHeight,
                }}
                className="text-slate-900 dark:text-white truncate"
              >
                {item.sampleAr}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

