import React from 'react';
import { Clock, ShieldCheck, Sliders } from 'lucide-react';

export const AntiBanSafeguards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="wasell-card p-4 space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#128C7E] mb-1">
          <Clock className="w-4 h-4" /> الفاصل العشوائي البشري (Jitter Delay)
        </div>
        <div className="text-base font-extrabold text-slate-900 dark:text-white">20 – 45 ثانية</div>
        <p className="text-[11px] text-slate-400 mt-1">يحاكي الإرسال الطبيعي لتجنب رصد الرسائل المكررة من واتساب</p>
      </div>

      <div className="wasell-card p-4 space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#7C3AED] mb-1">
          <ShieldCheck className="w-4 h-4" /> الانسحاب الفوري الآمن (Opt-Out)
        </div>
        <div className="text-base font-extrabold text-slate-900 dark:text-white">كلمة «إيقاف» مفعلة</div>
        <p className="text-[11px] text-slate-400 mt-1">تضاف أي جهة اتصال تطلب الإيقاف لقائمة الحظر تلقائياً وفوراً</p>
      </div>

      <div className="wasell-card p-4 space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-500 mb-1">
          <Sliders className="w-4 h-4" /> السقف اليومي للرقم
        </div>
        <div className="text-base font-extrabold text-slate-900 dark:text-white">200 رسالة / يوم</div>
        <p className="text-[11px] text-slate-400 mt-1">توقف إجباري لحماية رقم المتجر عند الوصول للحد اليومي</p>
      </div>
    </div>
  );
};
