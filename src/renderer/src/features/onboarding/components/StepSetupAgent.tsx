import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export const StepSetupAgent: React.FC = () => {
  return (
    <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 py-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">الخطوة 4: ضبط وكيل الذكاء الاصطناعي</h4>
          <p className="text-slate-500 dark:text-slate-400 text-[11px]">تخصيص سلوك ونموذج Gemini للرد الفوري على العملاء</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-[#1F293D] space-y-1">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] block">النموذج المعتمد:</span>
          <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#128C7E]" />
            <span>Gemini 3.8 Flash</span>
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-[#1F293D] space-y-1">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] block">الحد الأقصى للخصم التلقائي:</span>
          <p className="font-bold text-amber-600 dark:text-amber-400 font-mono">0% (ممنوع تقديم أي خصم)</p>
        </div>
      </div>
    </div>
  );
};
