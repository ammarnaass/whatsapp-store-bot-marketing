import React from 'react';
import { ShieldCheck, Clock, Zap, AlertTriangle } from 'lucide-react';

interface StepAntiBanSettingsProps {
  minDelay: number;
  onMinDelayChange: (val: number) => void;
  maxDelay: number;
  onMaxDelayChange: (val: number) => void;
  dailyLimit: number;
  onDailyLimitChange: (val: number) => void;
}

export const StepAntiBanSettings: React.FC<StepAntiBanSettingsProps> = ({
  minDelay,
  onMinDelayChange,
  maxDelay,
  onMaxDelayChange,
  dailyLimit,
  onDailyLimitChange,
}) => {
  return (
    <div className="space-y-4 text-xs">
      {/* بطاقة التنبيه الأمني */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
        <div className="text-[11px] leading-relaxed">
          <strong>إرشادات حماية رقم المتجر:</strong> واتساب يرصد الإرسال السريع المتزامن. تم ضبط الفاصل الزمني العشوائي الافتراضي بين 20 و45 ثانية ومراعاة سقف 200 رسالة يومياً لضمان استقرار حسابك.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* الفاصل الزمني العشوائي */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2">
          <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-pink-500" /> فاصل التأخير البشري (ثواني)
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <span className="text-[10px] text-slate-400 block mb-0.5">الحد الأدنى</span>
              <input
                type="number"
                min="5"
                max="60"
                value={minDelay}
                onChange={(e) => onMinDelayChange(Number(e.target.value))}
                className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg p-2 font-bold text-slate-900 dark:text-white"
              />
            </div>
            <span className="text-slate-400 pt-4">-</span>
            <div className="flex-1">
              <span className="text-[10px] text-slate-400 block mb-0.5">الحد الأقصى</span>
              <input
                type="number"
                min="10"
                max="120"
                value={maxDelay}
                onChange={(e) => onMaxDelayChange(Number(e.target.value))}
                className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg p-2 font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* السقف اليومي */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2">
          <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-pink-500" /> السقف اليومي للحملة
          </label>
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5">أقصى عدد رسائل يومياً</span>
            <input
              type="number"
              min="10"
              max="500"
              value={dailyLimit}
              onChange={(e) => onDailyLimitChange(Number(e.target.value))}
              className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg p-2 font-bold text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* خيار الانسحاب التلقائي */}
      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="font-bold text-slate-700 dark:text-slate-300">الانسحاب التلقائي عند كلمة «إيقاف»</span>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
          مفعل دائماً
        </span>
      </div>
    </div>
  );
};

