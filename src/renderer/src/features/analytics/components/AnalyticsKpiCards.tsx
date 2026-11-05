import React from 'react';
import { DollarSign, ArrowUpRight, TrendingUp, Zap, Clock, ShoppingCart } from 'lucide-react';
import { AnalyticsSummaryKpis } from '../types/analytics.types';

interface AnalyticsKpiCardsProps {
  kpis: AnalyticsSummaryKpis;
  comparePrevious?: boolean;
}

export const AnalyticsKpiCards: React.FC<AnalyticsKpiCardsProps> = ({ kpis, comparePrevious = true }) => {
  const cards = [
    {
      title: 'إجمالي إيرادات واتساب',
      value: kpis.revenue.toLocaleString(),
      unit: 'ر.س',
      icon: DollarSign,
      iconBg: 'bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E]',
      badge: `+${kpis.revenueGrowth}%`,
      badgeSub: 'مقارنة بالفترة السابقة',
    },
    {
      title: 'الطلبات ومعدل التحويل',
      value: kpis.totalOrders.toLocaleString(),
      unit: 'طلب',
      subUnit: `تحويل ${kpis.conversionRate}%`,
      icon: ShoppingCart,
      iconBg: 'bg-purple-50 dark:bg-[#7C3AED]/20 text-[#7C3AED]',
      badge: `+${kpis.ordersGrowth}%`,
      badgeSub: `${kpis.activeChats} محادثة نشطة`,
    },
    {
      title: 'معدل الأتمتة التفاعلية',
      value: `${kpis.automationRate}%`,
      unit: '',
      subUnit: 'إغلاق بدون تدخل بشري',
      icon: Zap,
      iconBg: 'bg-amber-50 dark:bg-amber-500/20 text-amber-500',
      badge: '99.4%',
      badgeSub: 'دقة الردود المعتمدة',
    },
    {
      title: 'سرعة استجابة الوكيل والتكلفة',
      value: `${kpis.avgLatencyMs}`,
      unit: 'ms',
      subUnit: `$${kpis.estimatedCost} تكلفة التوكنز`,
      icon: Clock,
      iconBg: 'bg-sky-50 dark:bg-sky-500/20 text-sky-500',
      badge: `${(kpis.tokenUsage / 1000).toFixed(1)}k`,
      badgeSub: 'توكن مستهلك',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{c.title}</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
                    {c.value}
                  </span>
                  {c.unit && <span className="text-xs font-bold text-slate-400">{c.unit}</span>}
                </div>
                {c.subUnit && <span className="text-[11px] font-bold text-[#128C7E] block mt-0.5">{c.subUnit}</span>}
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${c.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="pt-3 mt-3 flex items-center justify-between border-t border-slate-100 dark:border-[#1F293D] text-xs">
              {comparePrevious && (
                <div className="flex items-center gap-1 font-bold text-[#128C7E] font-mono tabular-nums">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{c.badge}</span>
                </div>
              )}
              <span className="text-[11px] text-slate-400">{c.badgeSub}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
