import React from 'react';
import { Sparkles, Download, RefreshCw } from 'lucide-react';
import { AnalyticsPeriod } from '../types/analytics.types';

interface AnalyticsHeaderProps {
  period: AnalyticsPeriod;
  onPeriodChange: (p: AnalyticsPeriod) => void;
  comparePrevious: boolean;
  onToggleCompare: () => void;
  onExport: () => void;
  loading?: boolean;
  onRefresh?: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  period,
  onPeriodChange,
  comparePrevious,
  onToggleCompare,
  onExport,
  loading = false,
  onRefresh,
}) => {
  const periods = [
    { id: 'today' as const, label: 'اليوم' },
    { id: '7d' as const, label: 'آخر 7 أيام' },
    { id: '30d' as const, label: 'آخر 30 يوماً' },
    { id: 'quarter' as const, label: 'هذا الربع' },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            التحليلات وذكاء المحادثات
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-100 dark:bg-[#7C3AED]/20 text-[#7C3AED] border border-violet-200/50">
            <Sparkles className="w-3.5 h-3.5" />
            تحليلات تنبؤية
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          مؤشرات مبيعات واتساب، استفسارات ونوايا العملاء، ودقة إغلاق صفقات وكيل الذكاء الاصطناعي لحظياً.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="h-[36px] flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => onPeriodChange(p.id)}
              type="button"
              className={`h-[28px] px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                period === p.id
                  ? 'bg-white dark:bg-[#111827] text-[#128C7E] elevation-1 font-black'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          onClick={onToggleCompare}
          type="button"
          className={`h-[36px] px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            comparePrevious
              ? 'bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] border border-emerald-300 dark:border-emerald-800'
              : 'wasell-btn-secondary'
          }`}
        >
          <span>مقارنة سابقة</span>
        </button>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            type="button"
            className="h-[36px] w-[36px] rounded-xl wasell-btn-secondary flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#128C7E]' : ''}`} />
          </button>
        )}

        <button
          onClick={onExport}
          type="button"
          className="h-[36px] flex items-center gap-2 px-3.5 rounded-xl wasell-btn-primary elevation-2 glow-whatsapp text-xs font-bold transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>تصدير CSV</span>
        </button>
      </div>
    </div>
  );
};
