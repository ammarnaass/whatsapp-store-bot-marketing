import React from 'react';
import { Clock, ShieldCheck, Zap } from 'lucide-react';
import { DEFAULT_ANTI_BAN_SETTINGS } from '../constants/marketing.constants';

export const AntiBanSafeguardsCard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* 1. فاصل التأخير البشري */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] p-3.5 rounded-2xl elevation-1 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
            الفاصل العشوائي (Jitter Delay)
          </span>
          <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
            {DEFAULT_ANTI_BAN_SETTINGS.minDelaySec} – {DEFAULT_ANTI_BAN_SETTINGS.maxDelaySec} ثانية
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            محاكاة الكتابة البشرية لمنع كشف الروبوت
          </span>
        </div>
      </div>

      {/* 2. الانسحاب الفوري الآمن */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] p-3.5 rounded-2xl elevation-1 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
            الانسحاب الآمن (Opt-Out)
          </span>
          <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
            كلمة «{DEFAULT_ANTI_BAN_SETTINGS.optOutKeyword}»
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            حظر الرقم فوراً عند طلب الإيقاف لتفادي الشكاوى
          </span>
        </div>
      </div>

      {/* 3. سقف الإرسال اليومي */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] p-3.5 rounded-2xl elevation-1 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
            السقف اليومي للحساب
          </span>
          <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
            {DEFAULT_ANTI_BAN_SETTINGS.dailyLimit} رسالة / يوم
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            إيقاف الحملة تلقائياً لحماية رقم واتساب
          </span>
        </div>
      </div>
    </div>
  );
};

