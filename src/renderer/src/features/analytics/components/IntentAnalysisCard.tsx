import React from 'react';
import { PieChart, Flame } from 'lucide-react';

export const IntentAnalysisCard: React.FC = () => {
  const items = [
    { label: 'الاستفسار عن الأسعار وأكواد الخصم', percent: 38, color: 'bg-[#128C7E]' },
    { label: 'مواصفات المنتجات والمقاسات', percent: 27, color: 'bg-[#7C3AED]' },
    { label: 'تتبع الشحنات ومواعيد التسليم', percent: 19, color: 'bg-emerald-400' },
    { label: 'سياسات الاسترجاع والضمان الذهبي', percent: 11, color: 'bg-amber-400' },
    { label: 'طلب التحدث مع موظف بشري', percent: 5, color: 'bg-rose-500' }
  ];

  return (
    <div className="lg:col-span-5 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-sm space-y-5 flex flex-col justify-between">
      <div>
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-1">
          <PieChart className="w-4 h-4 text-[#7C3AED]" />
          <span>توزيع استفسارات العملاء والنية الشرائية (Intent Analysis)</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">تصنيف النوايا بدقة بواسطة Gemini Flash</p>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                <span className="text-slate-900 dark:text-white">{item.percent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Hours Strip */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">
              ساعات الذروة لمبيعات واتساب
            </span>
            <span className="text-[10px] text-slate-400">
              08:00 مساءً إلى 11:30 مساءً (أعلى تحويل)
            </span>
          </div>
        </div>
        <span className="text-[#128C7E] font-extrabold">+64% تحويل</span>
      </div>
    </div>
  );
};
