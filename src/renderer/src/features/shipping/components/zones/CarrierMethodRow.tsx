import React from 'react';
import { Truck, Trash2, Clock, CheckCircle2, DollarSign } from 'lucide-react';
import { ShippingMethod } from '../../types/shipping.types';
import { formatCurrency } from '@shared/currencies';

interface Props {
  method: ShippingMethod;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}

export const CarrierMethodRow: React.FC<Props> = ({ method, onToggle, onDelete }) => {
  return (
    <div className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
      method.is_active
        ? 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 shadow-2xs'
        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60'
    }`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          method.is_active ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#128C7E]' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
        }`}>
          <Truck className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h5 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{method.name}</h5>
            {method.cod_available && (
              <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 px-1.5 py-0.5 rounded">دفع عند الاستلام</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            {method.estimated_delivery && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{method.estimated_delivery}</span>
              </span>
            )}
            {method.free_over ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                • مجاني للطلبات فوق {formatCurrency(method.free_over, method.currency)}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-left font-mono">
          <span className="font-black text-sm text-slate-900 dark:text-white">
            {formatCurrency(method.cost, method.currency)}
          </span>
          {method.cod_fee && method.cod_fee > 0 ? (
            <span className="block text-[10px] text-slate-400">+ {formatCurrency(method.cod_fee, method.currency)} COD</span>
          ) : null}
        </div>

        <button
          onClick={() => onToggle(method.id, !method.is_active)}
          className={`h-6 px-2.5 rounded-full text-[10px] font-bold transition ${
            method.is_active
              ? 'bg-emerald-100 text-[#128C7E] dark:bg-emerald-950/60 dark:text-emerald-300'
              : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
          }`}
        >
          {method.is_active ? 'مفعّل' : 'معطّل'}
        </button>

        <button
          onClick={() => onDelete(method.id)}
          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
          title="حذف طريقة الشحن"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
