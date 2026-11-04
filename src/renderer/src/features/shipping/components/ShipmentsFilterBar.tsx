import React from 'react';
import { Search, Filter } from 'lucide-react';
import { ShipmentFilterState } from '../types/shipping.types';
import { STATUS_FILTER_OPTIONS, CARRIERS_LIST } from '../constants/shipping.constants';

interface ShipmentsFilterBarProps {
  filters: ShipmentFilterState;
  onChange: (updater: (prev: ShipmentFilterState) => ShipmentFilterState) => void;
}

export const ShipmentsFilterBar: React.FC<ShipmentsFilterBarProps> = ({
  filters,
  onChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, search: e.target.value }))
          }
          placeholder="بحث برقم البوليصة، اسم العميل، الهاتف، أو المدينة..."
          className="w-full pl-3 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1 shrink-0">
          {STATUS_FILTER_OPTIONS.map((opt) => {
            const isActive = filters.status === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange((prev) => ({ ...prev, status: opt.value }))}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="relative shrink-0">
          <select
            value={filters.carrier}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, carrier: e.target.value }))
            }
            className="pl-3 pr-8 py-1.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 appearance-none cursor-pointer"
          >
            <option value="ALL">جميع الشركات</option>
            {CARRIERS_LIST.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

