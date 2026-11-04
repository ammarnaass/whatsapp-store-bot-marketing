import React from 'react';
import { Package, Truck, Clock, CheckCircle2 } from 'lucide-react';
import { LogisticsKPIs } from '../types/shipping.types';

interface ShippingKpisProps {
  kpis: LogisticsKPIs;
}

export const ShippingKpis: React.FC<ShippingKpisProps> = ({ kpis }) => {
  const cards = [
    {
      label: 'إجمالي الشحنات النشطة',
      value: kpis.totalShipments,
      unit: 'شحنة',
      icon: Package,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/30',
      border: 'border-cyan-100 dark:border-cyan-900/40',
    },
    {
      label: 'قيد الترانزيت والشحن',
      value: kpis.inTransit,
      unit: 'شحنة',
      icon: Truck,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-100 dark:border-blue-900/40',
    },
    {
      label: 'مع المندوب للتسليم اليوم',
      value: kpis.outForDelivery,
      unit: 'شحنة',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-100 dark:border-amber-900/40',
    },
    {
      label: 'نسبة الإنجاز والتسليم',
      value: `${kpis.successRate}%`,
      unit: `${kpis.deliveredToday} تم تسليمها`,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-100 dark:border-emerald-900/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border ${c.border} shadow-sm flex items-center justify-between transition hover:shadow`}
          >
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {c.label}
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {c.value}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {c.unit}
                </span>
              </div>
            </div>
            <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.color} flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

