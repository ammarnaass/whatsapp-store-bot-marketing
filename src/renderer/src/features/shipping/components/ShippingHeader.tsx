import React from 'react';
import { Truck, Plus, MapPin, RefreshCw } from 'lucide-react';

interface ShippingHeaderProps {
  totalCount: number;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenCreateModal: () => void;
  onOpenZonesModal: () => void;
}

export const ShippingHeader: React.FC<ShippingHeaderProps> = ({
  totalCount,
  isLoading,
  onRefresh,
  onOpenCreateModal,
  onOpenZonesModal,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-100 dark:border-cyan-900/50 shadow-sm">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              الشحن واللوجستيات
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300">
              {totalCount} شحنة
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            إدارة البوالص، تتبع شركات التوصيل، والتحديث الآلي للعملاء عبر واتساب
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition shadow-sm disabled:opacity-50"
          title="تحديث البيانات"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={onOpenZonesModal}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition shadow-sm"
        >
          <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>مناطق الشحن والتعرفة</span>
        </button>

        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-sm shadow-cyan-600/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>إصدار بوليصة جديدة</span>
        </button>
      </div>
    </div>
  );
};

