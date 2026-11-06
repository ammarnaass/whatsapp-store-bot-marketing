import React from 'react';
import { AppWindow, Plus, Search, RefreshCw } from 'lucide-react';

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddNew: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const SoftwareHeader: React.FC<Props> = ({
  searchQuery, onSearchChange, onAddNew, onRefresh, isLoading,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
          <AppWindow className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            حلول البرمجيات والتراخيص
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            إدارة برامج الكاشير، المحلات، الروضات، بيع التفعيلات الرقمية والشاشات الإرشادية
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="relative flex-1 sm:w-64">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث عن برنامج أو إصدار..."
            className="w-full h-9 pr-9 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50"
          title="تحديث القائمة"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={onAddNew}
          className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>إضافة برنامج وتفعيل</span>
        </button>
      </div>
    </div>
  );
};
