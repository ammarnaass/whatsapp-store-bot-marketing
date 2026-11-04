import React from 'react';
import { BarChart2 } from 'lucide-react';

export const FunnelConversionCard: React.FC = () => {
  const steps = [
    {
      label: 'جلسات واتساب المستلمة',
      count: '12,450',
      rate: '100%',
      width: '100%',
      color: 'bg-slate-300 dark:bg-slate-700'
    },
    {
      label: 'استعراض المنتجات والكتالوج',
      count: '8,120',
      rate: '65.2%',
      width: '65.2%',
      color: 'bg-[#128C7E]/70'
    },
    {
      label: 'إضافة للسلة والتفاوض الذكي',
      count: '3,940',
      rate: '48.5%',
      width: '48.5%',
      color: 'bg-[#7C3AED]/80'
    },
    {
      label: 'توليد روابط الدفع المباشرة',
      count: '3,090',
      rate: '78.4%',
      width: '38.4%',
      color: 'bg-[#128C7E]'
    },
    {
      label: 'إتمام السداد وتأكيد الشحنة',
      count: '2,420',
      rate: '78.3%',
      width: '30.2%',
      color: 'bg-[#075E54]'
    }
  ];

  return (
    <div className="lg:col-span-7 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#128C7E]" />
            <span>قمع التحويل البيعي عبر محادثات واتساب (Funnel Conversion)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            تتبع مسار العميل من أول رسالة إلى إتمام السداد الفعلي
          </p>
        </div>
        <span className="text-xs font-bold text-[#128C7E] bg-emerald-50 dark:bg-[#128C7E]/20 px-2.5 py-1 rounded-full">
          تحويل نهائي: 19.4%
        </span>
      </div>

      <div className="space-y-3 pt-2">
        {steps.map((step, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-800 dark:text-slate-200">{step.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-900 dark:text-white font-black">{step.count}</span>
                <span className="text-slate-400 text-[10px]">({step.rate})</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${step.color}`}
                style={{ width: step.width }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
