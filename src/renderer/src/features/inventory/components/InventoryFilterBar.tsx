import React from 'react';
import { Search } from 'lucide-react';
import { InventoryTabFilter } from '../types/inventory.types';

interface InventoryFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: InventoryTabFilter;
  onTabChange: (tab: InventoryTabFilter) => void;
  counts: Record<InventoryTabFilter, number>;
}

export const InventoryFilterBar: React.FC<InventoryFilterBarProps> = ({
  searchQuery, onSearchChange, activeTab, onTabChange, counts,
}) => {
  const tabs: { key: InventoryTabFilter; label: string }[] = [
    { key: 'all', label: 'كافة الأصناف' },
    { key: 'low_stock', label: 'أوشك على النفاد' },
    { key: 'out_of_stock', label: 'نفد الرصيد' },
    { key: 'digital', label: 'تراخيص رقمية' },
    { key: 'physical', label: 'منتجات فيزيائية' },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث بالاسم، رمز SKU، أو الفئة..."
          className="w-full h-10 pr-9 pl-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:border-[#128C7E] outline-none transition-all text-slate-900 dark:text-white"
        />
      </div>

      {/* Segmented Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        {tabs.map((t) => {
          const isActive = activeTab === t.key;
          const count = counts[t.key] || 0;
          return (
            <button
              key={t.key}
              onClick={() => onTabChange(t.key)}
              type="button"
              className={`h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#128C7E] text-white shadow-xs'
                  : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#1F293D] hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{t.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

