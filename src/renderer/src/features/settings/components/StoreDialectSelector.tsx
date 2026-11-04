import React from 'react';
import { Languages } from 'lucide-react';

interface StoreDialectSelectorProps {
  dialect: string;
  onChange: (val: string) => void;
}

export const StoreDialectSelector: React.FC<StoreDialectSelectorProps> = ({
  dialect,
  onChange,
}) => {
  return (
    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1F293D] p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center shrink-0">
          <Languages className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            لهجة وكيل الذكاء الاصطناعي
          </h4>
          <p className="text-[11px] text-slate-400">
            اللهجة السعودية البيضاء المحببة والمحترمة للعملاء الإقليميين
          </p>
        </div>
      </div>
      <select
        value={dialect}
        onChange={(e) => onChange(e.target.value)}
        className="h-[36px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl px-3 focus:outline-none focus:border-[#128C7E] shrink-0 cursor-pointer elevation-1"
      >
        <option>اللهجة السعودية (نجدية / حجازية راقية)</option>
        <option>الفصحى المبسطة والمعاصرة</option>
        <option>اللهجة الخليجية العامة</option>
      </select>
    </div>
  );
};

