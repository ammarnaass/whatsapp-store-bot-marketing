import React from 'react';
import { X, Truck, AlertCircle } from 'lucide-react';
import { ShippingZone, ShippingMethod } from '../../types/shipping.types';
import { SUPPORTED_SHIPPING_COUNTRIES } from '../../constants/carriers-presets';
import { CarrierMethodRow } from './CarrierMethodRow';
import { AddCarrierForm } from './AddCarrierForm';

interface Props {
  isOpen: boolean;
  zone: ShippingZone | null;
  onClose: () => void;
  onSaveMethod: (data: Partial<ShippingMethod>) => Promise<void>;
  onDeleteMethod: (id: string) => Promise<void>;
  onToggleMethod: (id: string, active: boolean) => Promise<void>;
}

export const ZoneMethodsModal: React.FC<Props> = ({
  isOpen,
  zone,
  onClose,
  onSaveMethod,
  onDeleteMethod,
  onToggleMethod,
}) => {
  if (!isOpen || !zone) return null;

  const country = SUPPORTED_SHIPPING_COUNTRIES.find((c) => c.code === zone.country_code);
  const flag = country?.flag || '🌐';
  const methods = zone.methods || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl select-none">{flag}</span>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>شركات وأسعار الشحن لـ {zone.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#128C7E] font-mono">
                  {methods.length} خيارات
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                الدولة: {zone.country_name} • المدن: {zone.cities && zone.cities.length > 0 ? zone.cities.join('، ') : 'كافة المدن'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Add Carrier Form */}
          <AddCarrierForm zone={zone} onSave={onSaveMethod} />

          {/* List of Carriers */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#128C7E]" />
                <span>الشركات المعتمدة في هذه الدولة ({methods.length})</span>
              </h4>
            </div>

            {methods.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-1.5">
                <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                <p className="font-bold text-xs text-slate-700 dark:text-slate-300">لا توجد شركات شحن مضافة بعد</p>
                <p className="text-[11px] text-slate-400">اختر من الاقتراحات السريعة أعلاه أو أضف شركة مخصصة مع تسعيرتها.</p>
              </div>
            ) : (
              methods.map((method) => (
                <CarrierMethodRow
                  key={method.id}
                  method={method}
                  onToggle={onToggleMethod}
                  onDelete={onDeleteMethod}
                />
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            إغلاق وحفظ
          </button>
        </div>
      </div>
    </div>
  );
};

