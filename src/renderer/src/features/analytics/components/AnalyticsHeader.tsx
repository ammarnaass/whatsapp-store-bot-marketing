import React from 'react';
import { Sparkles, Download } from 'lucide-react';
import { AnalyticsPeriod } from '../types/analytics.types';

interface AnalyticsHeaderProps {
  period: AnalyticsPeriod;
  onPeriodChange: (p: AnalyticsPeriod) => void;
  comparePrevious: boolean;
  onToggleCompare: () => void;
  onExport: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  period,
  onPeriodChange,
  comparePrevious,
  onToggleCompare,
  onExport
}) => {
  const periods = [
    { id: 'today' as const, label: 'اليوم' },
    { id: '7d' as const, label: 'آخر 7 أيام' },
    { id: '30d' as const, label: 'آخر 30 يوماً' },
    { id: 'quarter' as const, label: 'هذا الربع' }
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            التحليلات وذكاء المحادثات
          </h1>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-violet-100 dark:bg-[#7C3AED]/20 text-[#7C3AED] border border-violet-200/50">
            <Sparkles className="w-3.5 h-3.5" />
            تحليلات تنبؤية
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          مؤشرات أداء مبيعات واتساب، تحليلات سلوك العملاء، ودقة إغلاق صفقات وكيل الذكاء الاصطناعي
          لحظياً.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Period Selector Toggle */}
        <div className="h-[38px] flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => onPeriodChange(p.id)}
              type="button"
              className={`h-[30px] px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                period === p.id
                  ? 'bg-white dark:bg-[#111827] text-[#128C7E] elevation-1'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Comparison Toggle */}
        <button
          onClick={onToggleCompare}
          type="button"
          className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 elevation-1 ${
            comparePrevious
              ? 'bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] border border-emerald-300 dark:border-emerald-800'
              : 'wasell-btn-secondary'
          }`}
        >
          <span>مقارنة بالفترة السابقة</span>
        </button>

        {/* Export Comprehensive Report */}
        <button
          onClick={onExport}
          type="button"
          className="h-[38px] flex items-center gap-2 px-4 rounded-xl wasell-btn-primary elevation-2 glow-whatsapp text-xs font-bold transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>تصدير التقرير الشامل</span>
        </button>
      </div>
    </div>
  );
};
