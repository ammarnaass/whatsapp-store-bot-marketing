import React from 'react';
import { CheckCircle2, PlayCircle } from 'lucide-react';

export const StepSandboxTest: React.FC = () => {
  return (
    <div className="text-center py-6 space-y-3">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h4 className="font-bold text-slate-900 dark:text-white text-base">
        أنت الآن جاهز للاختبار في ساحة المحاكاة!
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
        يمكنك التوجه لتبويب «وكيل الذكاء الاصطناعي» لتجربة الردود الحية، إنشاء مسودات الطلبات، والتأكد من قواعد الحماية قبل استقبال العملاء الحقيقيين.
      </p>
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] dark:text-violet-300 text-xs font-bold border border-violet-200 dark:border-violet-900/40">
        <PlayCircle className="w-4 h-4" />
        <span>المحاكي التفاعلي متاح في أي وقت</span>
      </div>
    </div>
  );
};
