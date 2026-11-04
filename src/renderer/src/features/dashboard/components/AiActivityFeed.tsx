import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { useDataStore } from '../../data-management';

export const AiActivityFeed: React.FC = () => {
  const isMockDataActive = useDataStore((state) => state.isMockDataActive);

  return (
    <div className="wasell-card p-5 space-y-3 border-violet-500/20">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#7C3AED]" />
          <span>آخر نشاطات الوكيل الذكي</span>
        </h3>
        <span className="ai-badge">AI Gemini</span>
      </div>

      {!isMockDataActive ? (
        <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-[#1F293D] text-center space-y-2">
          <div className="w-9 h-9 rounded-full bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center mx-auto">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">لا توجد نشاطات ذكية مسجلة</p>
          <p className="text-[11px] text-slate-400">الوكيل الذكي بانتظار استلام رسائل العملاء لبدء تسجيل المهام والأدوات المستدعاة.</p>
        </div>
      ) : (
        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 border border-violet-200 dark:border-violet-900/40 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#7C3AED]">إنشاء مسودة طلب آلياً</span>
              <span className="text-slate-400 font-mono">منذ 3 د</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px]">
              استدعى أداة <code className="font-mono text-[#7C3AED]">create_draft_order</code> للعميل +966501122334
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-[#1F293D] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700 dark:text-slate-200">الرد على استفسار الشحن</span>
              <span className="text-slate-400 font-mono">منذ 12 د</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              أجاب بناءً على قاعدة المعرفة (الشحن يستغرق 24 ساعة للرياض)
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-600 dark:text-amber-400">تحويل لموظف بشري</span>
              <span className="text-slate-400 font-mono">منذ 25 د</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px]">
              العميل طلب التحدث صراحة مع ممثل المبيعات
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
