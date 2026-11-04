import React from 'react';
import { Search, Table as TableIcon, LayoutGrid } from 'lucide-react';
import { ProductViewMode, ProductTabFilter } from '../types/products.types';

interface ProductsFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: ProductTabFilter;
  onTabChange: (tab: ProductTabFilter) => void;
  viewMode: ProductViewMode;
  onViewModeChange: (mode: ProductViewMode) => void;
  counts: {
    all: number;
    demanded: number;
    lowStock: number;
    aiDisabled: number;
  };
}

export const ProductsFilterBar: React.FC<ProductsFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  counts
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
        <button
          onClick={() => onTabChange('all')}
          type="button"
          className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-[#128C7E] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>جميع المنتجات</span>
          <span className="font-mono tabular-nums">({counts.all})</span>
        </button>
        <button
          onClick={() => onTabChange('demanded')}
          type="button"
          className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'demanded'
              ? 'bg-[#7C3AED] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>الأكثر طلباً بـ AI</span>
          <span className="font-mono tabular-nums">({counts.demanded})</span>
        </button>
        <button
          onClick={() => onTabChange('low_stock')}
          type="button"
          className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'low_stock'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>المخزون المنخفض</span>
          <span className="font-mono tabular-nums">({counts.lowStock})</span>
        </button>
        <button
          onClick={() => onTabChange('ai_disabled')}
          type="button"
          className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'ai_disabled'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>معطل بالوكيل الذكي</span>
          <span className="font-mono tabular-nums">({counts.aiDisabled})</span>
        </button>
      </div>

      {/* Search Input & View Mode Toggles */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="البحث بالاسم، الفئة، أو SKU..."
            className="w-full h-[38px] bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pr-9 pl-4 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/15 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="h-[38px] flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onViewModeChange('table')}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-[#111827] text-[#128C7E] elevation-1'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="عرض كجدول بيانات"
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-[#111827] text-[#128C7E] elevation-1'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="عرض كبطاقات شبكية"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
