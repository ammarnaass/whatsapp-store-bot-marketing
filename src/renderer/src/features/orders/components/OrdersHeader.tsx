import React from 'react';
import { Download, RefreshCw, PlusCircle } from 'lucide-react';

interface OrdersHeaderProps {
  onExport: () => void;
  onSync: () => void;
  onAddNew: () => void;
  totalOrdersCount: number;
}

export const OrdersHeader: React.FC<OrdersHeaderProps> = ({
  onExport,
  onSync,
  onAddNew,
  totalOrdersCount
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-slate-400">إدارة المبيعات والتجارة الذكية</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#128C7E]"></span>
          <span className="text-xs font-bold text-[#128C7E]">تحديث مباشر</span>
        </div>
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            إدارة الطلبات ومبيعات الواتساب
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E7F6F2] dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 font-mono tabular-nums">
            {totalOrdersCount} طلباً مسجلاً
          </span>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2.5">
        <button
          onClick={onExport}
          type="button"
          className="h-[38px] flex items-center gap-2 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer elevation-1"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>تصدير الطلبات (Excel)</span>
        </button>
        <button
          onClick={onSync}
          type="button"
          className="h-[38px] flex items-center gap-2 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[#128C7E] text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer elevation-1"
        >
          <RefreshCw className="w-4 h-4" />
          <span>مزامنة سريعة (سلة / زد)</span>
        </button>
        <button
          onClick={onAddNew}
          type="button"
          className="h-[38px] flex items-center gap-2 px-4 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold shadow-md shadow-[#128C7E]/25 transition-all cursor-pointer glow-whatsapp"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إنشاء طلب واتساب يدوي</span>
        </button>
      </div>
    </div>
  );
};
