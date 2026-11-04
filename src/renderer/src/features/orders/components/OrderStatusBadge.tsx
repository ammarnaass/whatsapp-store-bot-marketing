import React from 'react';
import { CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'confirmed':
    case 'CONFIRMED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>مؤكد وجاهز</span>
        </span>
      );
    case 'shipping':
    case 'SHIPPED':
    case 'PREPARING':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
          <Truck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          <span>قيد الشحن</span>
        </span>
      );
    case 'delivered':
    case 'DELIVERED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-[#075E54] dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/60 dark:border-teal-900/60">
          <CheckCircle2 className="w-3 h-3 text-[#128C7E]" />
          <span>تم التسليم</span>
        </span>
      );
    case 'cancelled':
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60">
          <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>ملغي</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60">
          <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>{status}</span>
        </span>
      );
  }
};

