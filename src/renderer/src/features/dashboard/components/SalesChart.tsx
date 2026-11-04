import React from 'react';
import { TrendingUp } from 'lucide-react';

interface SalesChartProps {
  totalRevenue?: number;
}

export const SalesChart: React.FC<SalesChartProps> = ({ totalRevenue = 1240 }) => {
  return (
    <div className="lg:col-span-2 wasell-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#128C7E]" />
            حركة المبيعات خلال 30 يوماً
          </h3>
          <p className="text-xs text-slate-400">إجمالي الإيرادات المحققة عبر واتساب</p>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-1 bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] rounded-lg">
          {totalRevenue.toLocaleString('ar-SA')} ر.س
        </span>
      </div>

      <div className="h-44 w-full flex items-end pt-4">
        <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#128C7E" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#128C7E" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <polygon
            fill="url(#salesGrad)"
            points="0,150 0,110 50,95 100,120 150,70 200,85 250,50 300,65 350,30 400,45 450,20 500,15 500,150"
          />
          <polyline
            fill="none"
            stroke="#128C7E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="0,110 50,95 100,120 150,70 200,85 250,50 300,65 350,30 400,45 450,20 500,15"
          />
          <circle cx="250" cy="50" r="4" fill="#128C7E" />
          <circle cx="350" cy="30" r="4" fill="#128C7E" />
          <circle cx="500" cy="15" r="5" fill="#25D366" />
        </svg>
      </div>

      <div className="flex justify-between text-[11px] text-slate-400 font-mono border-t pt-2 border-slate-100 dark:border-[#1F293D]">
        <span>قبل 30 يوماً</span>
        <span>قبل 15 يوماً</span>
        <span>اليوم</span>
      </div>
    </div>
  );
};
