import React from 'react';
import { Truck, Edit2, Trash2, MapPin, ChevronLeft } from 'lucide-react';
import { ShippingZone } from '../../types/shipping.types';
import { SUPPORTED_SHIPPING_COUNTRIES } from '../../constants/carriers-presets';

interface Props {
  zone: ShippingZone;
  onManageMethods: (zone: ShippingZone) => void;
  onEdit: (zone: ShippingZone) => void;
  onDelete: (id: string) => void;
}

export const ShippingZoneCard: React.FC<Props> = ({ zone, onManageMethods, onEdit, onDelete }) => {
  const country = SUPPORTED_SHIPPING_COUNTRIES.find((c) => c.code === zone.country_code);
  const flag = country?.flag || '🌐';
  const methods = zone.methods || [];
  const activeCount = methods.filter((m) => m.is_active).length;

  return (
    <div className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl select-none" title={zone.country_name}>{flag}</span>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">{zone.name}</h4>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">{zone.country_name} ({zone.country_code})</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(zone)} className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="تعديل المنطقة">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(zone.id)} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="حذف المنطقة">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{zone.cities && zone.cities.length > 0 ? zone.cities.join('، ') : 'كافة مدن الدولة'}</span>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] mb-1.5 font-bold">
            <span className="text-slate-500 dark:text-slate-400">شركات وطرق الشحن المعتمدة:</span>
            <span className="text-[#128C7E] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-mono">{activeCount} نشطة</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {methods.length === 0 ? (
              <span className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">لم تتم إضافة شركات شحن بعد</span>
            ) : (
              methods.map((m) => (
                <span
                  key={m.id}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    m.is_active ? 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' : 'bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 border-transparent line-through'
                  }`}
                >
                  {m.name} ({m.cost} {m.currency})
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => onManageMethods(zone)}
        className="w-full h-9 mt-2 px-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-[#128C7E] dark:hover:bg-[#128C7E] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
      >
        <Truck className="w-4 h-4" />
        <span>إدارة شركات الشحن والأسعار</span>
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
