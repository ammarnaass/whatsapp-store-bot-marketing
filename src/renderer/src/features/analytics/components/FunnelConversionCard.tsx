import React from 'react';
import { BarChart2 } from 'lucide-react';
import { FunnelStepItem } from '../types/analytics.types';

interface FunnelConversionCardProps {
  steps?: FunnelStepItem[];
}

export const FunnelConversionCard: React.FC<FunnelConversionCardProps> = ({ steps = [] }) => {
  const finalRate = steps.length > 0 ? steps[steps.length - 1].rate : '0%';

  return (
    <div className="lg:col-span-7 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 space-y-5">
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
        <span className="text-xs font-bold text-[#128C7E] bg-emerald-50 dark:bg-[#128C7E]/20 px-2.5 py-1 rounded-full font-mono">
          تحويل نهائي: {finalRate}
        </span>
      </div>

      <div className="space-y-3 pt-2">
        {steps.map((step) => (
          <div key={step.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-800 dark:text-slate-200">{step.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-900 dark:text-white font-mono font-black">
                  {step.count.toLocaleString()}
                </span>
                <span className="text-slate-400 text-[10px] font-mono">({step.rate})</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${step.color}`}
                style={{ width: step.rate }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
