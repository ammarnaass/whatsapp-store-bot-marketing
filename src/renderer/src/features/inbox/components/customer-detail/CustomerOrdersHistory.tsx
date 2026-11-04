import React from 'react';
import { Package, Clock } from 'lucide-react';
import { CustomerOrderSummary } from '../../types/customer-detail.types';

interface CustomerOrdersHistoryProps {
  orders: CustomerOrderSummary[];
}

export const CustomerOrdersHistory: React.FC<CustomerOrdersHistoryProps> = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
        <span className="text-[11px] text-slate-400">لا توجد طلبات سابقة مسجلة لهذا العميل</span>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">مؤكد</span>;
      case 'SHIPPED':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">مشحون</span>;
      case 'DELIVERED':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">مستلم</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-2">
      <span className="text-[11px] font-bold text-slate-400 block mb-1">سجل الطلبات الأخيرة:</span>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5">
        {orders.map((o) => (
          <div
            key={o.id}
            className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/60 flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{o.id}</span>
              {getStatusBadge(o.status)}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                {o.created_at ? new Date(o.created_at).toLocaleDateString('ar-SA') : 'مؤخراً'}
              </span>
              <span className="font-bold text-[#128C7E] font-mono tabular-nums">{o.total} ر.س</span>
            </div>

            {o.items && o.items.length > 0 && (
              <div className="pt-1 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-400 flex items-center gap-1 truncate">
                <Package className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{o.items.map((i) => i.product_name).join('، ')}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

