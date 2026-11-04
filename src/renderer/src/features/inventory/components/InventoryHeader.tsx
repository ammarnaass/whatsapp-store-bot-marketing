import React from 'react';
import { Boxes, History, RefreshCw } from 'lucide-react';

interface InventoryHeaderProps {
  onOpenLogs: () => void;
  onSync: () => void;
  totalCount: number;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({ onOpenLogs, onSync, totalCount }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-slate-200 dark:border-[#1F293D]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#128C7E]/15 to-[#075E54]/20 text-[#128C7E] flex items-center justify-center shrink-0 shadow-xs">
          <Boxes className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black text-slate-900 dark:text-white">إدارة المخزون والتوريد</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#128C7E]/10 text-[#128C7E] dark:bg-[#128C7E]/25">
              {totalCount} صنف
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            متابعة الرصيد الفعلي، حركات الجرد، وتوزيع مفاتيح التراخيص الرقمية
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenLogs}
          type="button"
          className="h-9 px-3 rounded-xl border border-slate-200 dark:border-[#1F293D] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span>سجل الحركات</span>
        </button>

        <button
          onClick={onSync}
          type="button"
          className="h-9 px-3 rounded-xl bg-[#128C7E] hover:bg-[#0da08e] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>مزامنة المخزون</span>
        </button>
      </div>
    </div>
  );
};

