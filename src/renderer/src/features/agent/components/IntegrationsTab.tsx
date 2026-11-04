import React from 'react';
import { Zap } from 'lucide-react';

export const IntegrationsTab: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
        إعدادات واجهة برمجة WhatsApp Cloud API & Gemini
      </h3>
      <p className="text-xs text-slate-400">
        الربط المباشر مع Meta Business والنموذج اللغوي الذكي
      </p>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 flex items-center justify-center text-[#128C7E]">
            <Zap className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 dark:text-white dir-ltr text-right">
              +966 50 123 4567
            </span>
            <span className="text-[11px] text-slate-400">
              حساب أعمال موثق (Green Checkmark) • الرياض
            </span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#128C7E] text-xs font-bold border border-emerald-200/50">
          متصل ومفعل
        </span>
      </div>
    </div>
  );
};
