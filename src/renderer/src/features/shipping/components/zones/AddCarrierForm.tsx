import React, { useState } from 'react';
import { Plus, Check, Zap } from 'lucide-react';
import { ShippingMethod, ShippingZone } from '../../types/shipping.types';
import { PRESET_CARRIERS } from '../../constants/carriers-presets';
import { SUPPORTED_CURRENCIES } from '@shared/currencies';

interface Props {
  zone: ShippingZone; onSave: (data: Partial<ShippingMethod>) => Promise<void>;
}

export const AddCarrierForm: React.FC<Props> = ({ zone, onSave }) => {
  const [carrierCode, setCarrierCode] = useState('custom');
  const [name, setName] = useState('');
  const [cost, setCost] = useState<number>(25);
  const [currency, setCurrency] = useState(zone.country_code === 'DZ' ? 'DZD' : zone.country_code === 'SA' ? 'SAR' : 'USD');
  const [freeOver, setFreeOver] = useState<number | undefined>(200);
  const [estimatedDelivery, setEstimatedDelivery] = useState('24 إلى 48 ساعة');
  const [codAvailable, setCodAvailable] = useState(true);
  const [codFee, setCodFee] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const relevantPresets = PRESET_CARRIERS.filter(
    (p) => p.country === zone.country_code || p.country === 'ALL' || (zone.country_code === 'GLOBAL' && p.country === 'GLOBAL')
  );

  const applyPreset = (code: string) => {
    setCarrierCode(code);
    const p = PRESET_CARRIERS.find((it) => it.code === code);
    if (p) {
      setName(p.name);
      setCost(p.defaultCost);
      setCurrency(p.currency);
      setEstimatedDelivery(p.defaultDays);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(), carrier_code: carrierCode, cost: Number(cost),
        currency, free_over: freeOver ? Number(freeOver) : null,
        estimated_delivery: estimatedDelivery, cod_available: codAvailable,
        cod_fee: Number(codFee || 0), is_active: true,
      });
      setName('');
      setCarrierCode('custom');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
      <div className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
        <Plus className="w-4 h-4 text-[#128C7E]" />
        <span>إضافة شركة شحن أو تسعيرة جديدة لهذه الدولة</span>
      </div>

      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> اقتراحات سريعة:</span>
        {relevantPresets.slice(0, 5).map((p) => (
          <button
            type="button" key={p.code} onClick={() => applyPreset(p.code)}
            className="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:border-[#128C7E] transition"
          >
            {p.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="اسم شركة الشحن (مثال: سمسا إكسبريس)"
          className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold" required
        />
        <div className="flex gap-1.5">
          <input
            type="number" min="0" step="0.5" value={cost} onChange={(e) => setCost(Number(e.target.value))}
            placeholder="سعر الشحن" className="w-2/3 p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold font-mono" required
          />
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-1/3 p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold">
            {SUPPORTED_CURRENCIES.map((c) => (<option key={c.code} value={c.code}>{c.code}</option>))}
          </select>
        </div>
        <input
          type="number" min="0" value={freeOver ?? ''} onChange={(e) => setFreeOver(e.target.value ? Number(e.target.value) : undefined)}
          placeholder="مجاني للطلبات فوق (اختياري)" className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <input
          type="text" value={estimatedDelivery} onChange={(e) => setEstimatedDelivery(e.target.value)}
          placeholder="مدة التوصيل (مثال: 24-48 ساعة)"
          className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
        />
        <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="flex items-center gap-1.5 cursor-pointer font-bold">
            <input type="checkbox" checked={codAvailable} onChange={(e) => setCodAvailable(e.target.checked)} className="rounded text-[#128C7E]" />
            <span>الدفع عند الاستلام</span>
          </label>
          <button type="submit" disabled={isSubmitting} className="h-8 px-4 rounded-lg bg-[#128C7E] text-white font-bold flex items-center gap-1 hover:bg-[#0ea593]">
            <Check className="w-3.5 h-3.5" />
            <span>حفظ الشركة</span>
          </button>
        </div>
      </div>
    </form>
  );
};
