import React from 'react';
import { Bot, CheckCircle2, Sparkles, ShieldCheck, Clock } from 'lucide-react';

interface AiChannelEngineCardProps {
  onSave?: () => void;
}

export const AiChannelEngineCard: React.FC<AiChannelEngineCardProps> = ({ onSave }) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                سلوك وكيل الذكاء الاصطناعي على قنوات واتساب (AI Channel Engine & Pacing)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-violet-100 dark:bg-[#7C3AED]/20 text-[#7C3AED]">
                مفعل تلقائياً
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              إعدادات محاكاة السلوك البشري لحماية الرقم من قيود خوارزميات واتساب وسرعة الاستجابة الذكية.
            </p>
          </div>
        </div>
        {onSave && (
          <button
            onClick={onSave}
            type="button"
            className="h-[38px] px-4 rounded-xl wasell-btn-primary text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>حفظ الإعدادات</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Rule 1: Simulate Typing */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                محاكاة الكتابة الحية (Typing...)
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            إظهار عبارة «يكتب الآن...» في تطبيق واتساب للعميل قبل إرسال الرد بـ 1.5 - 3 ثوانٍ لمنع كشف الردود الآلية.
          </p>
          <span className="text-[11px] font-bold text-[#128C7E]">SIMULATE_TYPING = true</span>
        </div>

        {/* Rule 2: Send Pacing & Warmup */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#128C7E]" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                نظام التدفئة وقاطع الفشل (Anti-Ban)
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            توزيع الحمل تدريجياً وإيقاف الرسائل تلقائياً عند تجاوز معدل الفشل لحماية أرقام الهواتف من الحظر.
          </p>
          <span className="text-[11px] font-bold text-[#128C7E]">PACING_ENABLED = true</span>
        </div>

        {/* Rule 3: Human Handoff on Frustration */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                التحويل الفوري للإشراف البشري
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تجميد استجابة البوت تلقائياً وإرسال تنبيه عاجل لمدير المتجر عند استشعار شكوى أو طلب التحدث لموظف.
          </p>
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">تحويل ذكي للـ Inbox</span>
        </div>
      </div>
    </div>
  );
};

