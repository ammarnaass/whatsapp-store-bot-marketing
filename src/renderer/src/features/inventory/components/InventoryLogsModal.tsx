import React, { useState, useEffect } from 'react';
import { X, History, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { InventoryLog } from '../types/inventory.types';
import { api } from '../../../api-bridge';

interface InventoryLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryLogsModal: React.FC<InventoryLogsModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      api.inventory.getLogs({ limit: 40 })
        .then((res) => setLogs(res || []))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1F293D] overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">سجل حركات وتدقيق المخزون</h3>
              <p className="text-[11px] text-slate-400">كافة عمليات التوريد، الخصم، وتأكيدات وإلغاءات الطلبات</p>
            </div>
          </div>
          <button onClick={onClose} type="button" className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto divide-y divide-slate-100 dark:divide-[#1F293D]">
          {isLoading ? (
            <p className="text-center py-8 text-xs text-slate-400">جارِ جلب السجلات...</p>
          ) : logs.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400">لا توجد حركات مخزون مسجلة حتى الآن.</p>
          ) : (
            logs.map((log) => {
              const isPositive = log.change_qty > 0;
              return (
                <div key={log.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isPositive ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60' : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60'}`}>
                      {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{log.product_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.sku}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{log.reason}</span>
                    </div>
                  </div>

                  <div className="text-left font-mono">
                    <span className={`text-xs font-bold block ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPositive ? `+${log.change_qty}` : log.change_qty}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {log.quantity_before} ➔ {log.quantity_after}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

