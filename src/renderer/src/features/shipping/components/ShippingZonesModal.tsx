import React from 'react';
import { X, MapPin, Trash2 } from 'lucide-react';
import { ShippingZone } from '../types/shipping.types';
import { ShippingZoneForm } from './ShippingZoneForm';

interface ShippingZonesModalProps {
  isOpen: boolean;
  zones: ShippingZone[];
  onClose: () => void;
  onSaveZone: (zone: { id?: string; name: string; cities: string[]; fee: number; freeOver?: number }) => Promise<any>;
  onDeleteZone: (id: string) => Promise<any>;
}

export const ShippingZonesModal: React.FC<ShippingZonesModalProps> = ({
  isOpen,
  zones,
  onClose,
  onSaveZone,
  onDeleteZone,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">مناطق الشحن والتعرفة</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <ShippingZoneForm onSave={onSaveZone} />

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">المناطق المعتمدة ({zones.length})</h3>
            {zones.map((z) => (
              <div key={z.id} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {z.name}
                    <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded-md">
                      {z.fee} ر.س
                    </span>
                    {z.free_over && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                        مجاني فوق {z.free_over} ر.س
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {z.cities?.length ? z.cities.join('، ') : 'كافة مدن النطاق'}
                  </div>
                </div>
                <button
                  onClick={() => onDeleteZone(z.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                  title="حذف المنطقة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-left">
          <button onClick={onClose} className="px-4 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
