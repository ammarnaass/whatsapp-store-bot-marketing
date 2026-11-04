import React from 'react';
import { Search, Filter } from 'lucide-react';
import { OrderStatusFilter, OrderSourceFilter, OrderPaymentFilter } from '../types/orders.types';

interface OrdersFiltersProps {
  activeStatus: OrderStatusFilter;
  onStatusChange: (status: OrderStatusFilter) => void;
  sourceFilter: OrderSourceFilter;
  onSourceChange: (source: OrderSourceFilter) => void;
  paymentFilter: OrderPaymentFilter;
  onPaymentChange: (payment: OrderPaymentFilter) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  counts: {
    all: number;
    confirmed: number;
    shipping: number;
    delivered: number;
  };
}

export const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  activeStatus,
  onStatusChange,
  sourceFilter,
  onSourceChange,
  paymentFilter,
  onPaymentChange,
  searchQuery,
  onSearchChange,
  counts
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1">
      {/* Status Segment Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
        <button
          onClick={() => onStatusChange('all')}
          type="button"
          className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeStatus === 'all'
              ? 'bg-[#128C7E] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>كافة الطلبات</span>
          <span className="font-mono tabular-nums">({counts.all})</span>
        </button>
        <button
          onClick={() => onStatusChange('confirmed')}
          type="button"
          className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeStatus === 'confirmed'
              ? 'bg-[#128C7E] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>مؤكد وجديد</span>
          <span className="font-mono tabular-nums">({counts.confirmed})</span>
        </button>
        <button
          onClick={() => onStatusChange('shipping')}
          type="button"
          className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeStatus === 'shipping'
              ? 'bg-[#128C7E] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>قيد التجهيز والشحن</span>
          <span className="font-mono tabular-nums">({counts.shipping})</span>
        </button>
        <button
          onClick={() => onStatusChange('delivered')}
          type="button"
          className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeStatus === 'delivered'
              ? 'bg-[#128C7E] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>تم التوصيل بنجاح</span>
          <span className="font-mono tabular-nums">({counts.delivered})</span>
        </button>
      </div>

      {/* Search Input & Dropdown Filters */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="relative flex-1 sm:w-60">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث برقم الطلب، اسم العميل، الجوال..."
            className="w-full h-[38px] bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pr-9 pl-4 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/15 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Source Dropdown Filter */}
        <select
          value={sourceFilter}
          onChange={(e) => onSourceChange(e.target.value as OrderSourceFilter)}
          className="h-[38px] bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#128C7E] cursor-pointer transition-all"
        >
          <option value="all">كل مصادر الإغلاق</option>
          <option value="agent">🤖 وكيل الذكاء الاصطناعي (AI)</option>
          <option value="human">👤 تدخل موظف بشري</option>
        </select>

        {/* Payment Dropdown Filter */}
        <select
          value={paymentFilter}
          onChange={(e) => onPaymentChange(e.target.value as OrderPaymentFilter)}
          className="h-[38px] bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#128C7E] cursor-pointer transition-all"
        >
          <option value="all">كل طرق الدفع</option>
          <option value="apple_pay">Apple Pay</option>
          <option value="tamara">تمارا (تقسيط)</option>
          <option value="tabby">تابي (تقسيط)</option>
          <option value="cod">الدفع عند الاستلام (COD)</option>
        </select>
      </div>
    </div>
  );
};
