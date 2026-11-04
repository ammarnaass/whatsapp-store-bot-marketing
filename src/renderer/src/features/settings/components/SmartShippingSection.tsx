import React from 'react';
import { Truck } from 'lucide-react';
import { ShippingSettings } from '../types/settings.types';
import { CarrierCard } from './CarrierCard';

interface SmartShippingSectionProps {
  shipping: ShippingSettings;
  onChange: (updated: ShippingSettings) => void;
}

export const SmartShippingSection: React.FC<SmartShippingSectionProps> = ({
  shipping,
  onChange,
}) => {
  const toggleCarrier = (key: 'smsaActive' | 'aramexActive' | 'torodActive' | 'splActive') => {
    onChange({ ...shipping, [key]: !shipping[key] });
  };

  const updateField = <K extends keyof ShippingSettings>(key: K, value: ShippingSettings[K]) => {
    onChange({ ...shipping, [key]: value });
  };

  return (
    <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-[#1F293D]/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                الشحن الذكي وحساب التكلفة التلقائي
              </h2>
              <p className="text-xs text-slate-400">
                إصدار البوالص وإدارة رسوم التوصيل لجميع مناطق المملكة
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#128C7E]/10 text-[#128C7E] text-xs font-bold">
            بوالص آلية
          </span>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            شركات الشحن المعتمدة والمربوطة بالـ API
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <CarrierCard name="سمسا (SMSA)" active={shipping.smsaActive} onToggle={() => toggleCarrier('smsaActive')} />
            <CarrierCard name="أرامكس (Aramex)" active={shipping.aramexActive} onToggle={() => toggleCarrier('aramexActive')} />
            <CarrierCard name="طرود (Torod)" active={shipping.torodActive} onToggle={() => toggleCarrier('torodActive')} />
            <CarrierCard name="سبل (SPL)" active={shipping.splActive} onToggle={() => toggleCarrier('splActive')} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              سعر الشحن الموحد (ر.س)
            </label>
            <input
              type="number"
              value={shipping.flatShippingRate}
              onChange={(e) => updateField('flatShippingRate', Number(e.target.value))}
              className="w-full h-[38px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 text-xs font-bold text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              شحن مجاني للطلبات فوق (ر.س)
            </label>
            <input
              type="number"
              value={shipping.freeShippingThreshold}
              onChange={(e) => updateField('freeShippingThreshold', Number(e.target.value))}
              className="w-full h-[38px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 text-xs font-bold text-slate-900 dark:text-white font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D]">
          <div className="space-y-0.5 max-w-[80%]">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              إصدار وطباعة بوالص الشحن التلقائي (Auto AWB)
            </span>
            <p className="text-[11px] text-slate-400">
              توليد بوليصة الشحن وتعيين المندوب فور اكتمال الدفع الإلكتروني بنجاح.
            </p>
          </div>
          <input
            type="checkbox"
            checked={shipping.autoPrintWaybill}
            onChange={() => updateField('autoPrintWaybill', !shipping.autoPrintWaybill)}
            className="w-5 h-5 accent-[#128C7E] rounded cursor-pointer shrink-0"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-[#1F293D] mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>تغطية 100+ مدينة سعودية</span>
        <span className="text-blue-600 dark:text-blue-400 font-bold">ربط مباشر مع المنصات</span>
      </div>
    </section>
  );
};
