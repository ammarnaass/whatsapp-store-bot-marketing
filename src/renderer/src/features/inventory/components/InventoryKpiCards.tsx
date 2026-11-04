import React from 'react';
import { Package, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { StockSummary } from '../types/inventory.types';

interface InventoryKpiCardsProps {
  summary: StockSummary;
}

export const InventoryKpiCards: React.FC<InventoryKpiCardsProps> = ({ summary }) => {
  const cards = [
    {
      title: 'إجمالي الرصيد بالمخزن',
      value: summary.totalQuantity,
      sub: `${summary.totalSkus} صنف مسجل`,
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-100 dark:border-blue-900/40',
    },
    {
      title: 'المتاح للبيع الفوري',
      value: summary.availableQuantity,
      sub: 'جاهز للحجز بكتالوج واتساب',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-100 dark:border-emerald-900/40',
    },
    {
      title: 'أوشك على النفاد',
      value: summary.lowStockCount,
      sub: 'أقل من 5 قطع متبقية',
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-100 dark:border-amber-900/40',
    },
    {
      title: 'نفد من المخزون',
      value: summary.outOfStockCount,
      sub: 'يتطلب إعادة توريد فوري',
      icon: AlertOctagon,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-100 dark:border-rose-900/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className={`p-4 rounded-2xl border ${c.border} ${c.bg} flex items-center justify-between transition-all`}>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{c.title}</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1 font-mono tabular-nums">{c.value}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">{c.sub}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${c.color} bg-white dark:bg-slate-900/80 flex items-center justify-center shadow-xs shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

