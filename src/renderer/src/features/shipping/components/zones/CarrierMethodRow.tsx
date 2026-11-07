import React from 'react';
import { Truck, Trash2, Clock } from 'lucide-react';
import { ShippingMethod } from '../../types/shipping.types';
import { formatCurrency } from '@shared/currencies';

interface Props {
  method: ShippingMethod;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}

export const CarrierMethodRow: React.FC<Props> = ({ method, onToggle, onDelete }) => {
  const isDeskOnly = method.delivery_type === 'desk';
  const isHomeOnly = method.delivery_type === 'home';

  return (
    <div className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
      method.is_active ? 'bg-card border-border shadow-2xs' : 'bg-muted/40 border-border/50 opacity-60'
    }`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          method.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        }`}>
          <Truck className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h5 className="font-extrabold text-xs text-foreground truncate">{method.name}</h5>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {isDeskOnly ? '🏢 مكتب فقط' : isHomeOnly ? '🏠 منزل فقط' : '🏠 منزل + 🏢 مكتب'}
            </span>
            {method.cod_available && (
              <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 px-1.5 py-0.5 rounded">دفع عند الاستلام</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
            {method.estimated_delivery && (
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>{method.estimated_delivery}</span></span>
            )}
            {method.free_over ? (
              <span className="text-emerald-600 font-semibold">• مجاني فوق {formatCurrency(method.free_over, method.currency)}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-left font-mono">
          {!isDeskOnly && (
            <div className="text-xs font-black text-foreground">
              <span className="text-[10px] text-muted-foreground font-sans ml-1">🏠 للمنزل:</span>
              {formatCurrency(method.cost, method.currency)}
            </div>
          )}
          {method.desk_cost != null && !isHomeOnly && (
            <div className="text-[11px] font-bold text-primary">
              <span className="text-[10px] text-muted-foreground font-sans ml-1">🏢 للمكتب:</span>
              {formatCurrency(method.desk_cost, method.currency)}
            </div>
          )}
        </div>

        <button
          onClick={() => onToggle(method.id, !method.is_active)}
          className={`h-6 px-2.5 rounded-full text-[10px] font-bold transition ${
            method.is_active ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
          }`}
        >
          {method.is_active ? 'مفعّل' : 'معطّل'}
        </button>

        <button onClick={() => onDelete(method.id)} className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg" title="حذف">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
