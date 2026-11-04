import React from 'react';
import { Search, Crown, MessageCircle, ShoppingBag, Clock } from 'lucide-react';
import { CustomerSegmentFilter } from '../types/customers.types';

interface CustomersFilterBarProps {
  activeSegment: CustomerSegmentFilter;
  onSegmentChange: (seg: CustomerSegmentFilter) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cityFilter: string;
  onCityChange: (city: string) => void;
  filteredCount: number;
  totalCount: number;
}

export const CustomersFilterBar: React.FC<CustomersFilterBarProps> = ({
  activeSegment,
  onSegmentChange,
  searchQuery,
  onSearchChange,
  cityFilter,
  onCityChange,
  filteredCount,
  totalCount
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 space-y-4">
      {/* Segment Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        <button
          onClick={() => onSegmentChange('all')}
          type="button"
          className={`h-[38px] inline-flex items-center gap-2 px-3.5 rounded-xl cursor-pointer transition-all ${
            activeSegment === 'all'
              ? 'bg-[#128C7E] text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <span>الكل</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums bg-white/20 text-white">8,640</span>
        </button>

        <button
          onClick={() => onSegmentChange('vip')}
          type="button"
          className={`h-[38px] inline-flex items-center gap-2 px-3.5 rounded-xl cursor-pointer transition-all ${
            activeSegment === 'vip'
              ? 'bg-[#7C3AED] text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-amber-300" />
          <span>كبار العملاء VIP</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums bg-white/20 text-white">482</span>
        </button>

        <button
          onClick={() => onSegmentChange('whatsapp_active')}
          type="button"
          className={`h-[38px] inline-flex items-center gap-2 px-3.5 rounded-xl cursor-pointer transition-all ${
            activeSegment === 'whatsapp_active'
              ? 'bg-[#128C7E] text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
          <span>نشطون عبر واتساب</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums bg-white/20 text-white">3,410</span>
        </button>

        <button
          onClick={() => onSegmentChange('cart_abandoner')}
          type="button"
          className={`h-[38px] inline-flex items-center gap-2 px-3.5 rounded-xl cursor-pointer transition-all ${
            activeSegment === 'cart_abandoner'
              ? 'bg-[#128C7E] text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
          <span>سلات متروكة متكررة</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums bg-white/20 text-white">230</span>
        </button>

        <button
          onClick={() => onSegmentChange('churn_risk')}
          type="button"
          className={`h-[38px] inline-flex items-center gap-2 px-3.5 rounded-xl cursor-pointer transition-all ${
            activeSegment === 'churn_risk'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>بحاجة لإعادة تنشيط</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums bg-rose-200/40 text-rose-800 dark:text-rose-200">
            195
          </span>
        </button>
      </div>

      {/* Filter Control Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالاسم، رقم الجوال (+966)، المدينة، أو وسوم الشراء..."
            className="w-full h-[38px] pr-10 pl-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/15 transition-all"
          />
        </div>

        {/* City Selector */}
        <div className="md:col-span-3">
          <select
            value={cityFilter}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full h-[38px] px-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#128C7E] cursor-pointer transition-all"
          >
            <option value="all">كل المدن والمناطق</option>
            <option value="الرياض">الرياض</option>
            <option value="جدة">جدة</option>
            <option value="الدمام">الدمام</option>
            <option value="الخبر">الخبر</option>
            <option value="أبها">أبها</option>
          </select>
        </div>

        <div className="md:col-span-3 flex items-center justify-end text-xs text-slate-500 font-bold font-mono tabular-nums">
          عرض {filteredCount} من أصل {totalCount} عميل
        </div>
      </div>
    </div>
  );
};
