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
  const [cost, setCost] = useState<number>(600);
  const [deskCost, setDeskCost] = useState<number | undefined>(400);
  const [deliveryType, setDeliveryType] = useState<'both' | 'home' | 'desk'>('both');
  const [currency, setCurrency] = useState(zone.country_code === 'DZ' ? 'DZD' : zone.country_code === 'SA' ? 'SAR' : 'USD');
  const [freeOver, setFreeOver] = useState<number | undefined>(8000);
  const [estimatedDelivery, setEstimatedDelivery] = useState('24 إلى 48 ساعة');
  const [codAvailable, setCodAvailable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presets = PRESET_CARRIERS.filter((p) => p.country === zone.country_code || p.country === 'ALL' || (zone.country_code === 'GLOBAL' && p.country === 'GLOBAL'));

  const applyPreset = (code: string) => {
    setCarrierCode(code);
    const p = PRESET_CARRIERS.find((it) => it.code === code);
    if (p) {
      setName(p.name); setCost(p.defaultCost);
      setDeskCost(Math.round(p.defaultCost * 0.7));
      setCurrency(p.currency); setEstimatedDelivery(p.defaultDays);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(), carrier_code: carrierCode, cost: Number(cost),
        desk_cost: deskCost ? Number(deskCost) : null, delivery_type: deliveryType,
        currency, free_over: freeOver ? Number(freeOver) : null,
        estimated_delivery: estimatedDelivery, cod_available: codAvailable, is_active: true,
      });
      setName(''); setCarrierCode('custom');
    } finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
      <div className="font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
        <span className="flex items-center gap-1.5"><Plus className="w-4 h-4 text-[#128C7E]" /> إضافة شركة / تسعيرة</span>
        <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value as any)} className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200">
          <option value="both">🏠 منزل + 🏢 مكتب (Stop Desk)</option>
          <option value="home">🏠 توصيل منزلي فقط</option>
          <option value="desk">🏢 استلام مكتبي فقط</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-1 items-center">
        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5"><Zap className="w-3 h-3 text-amber-500" /> اقتراحات:</span>
        {presets.slice(0, 5).map((p) => (
          <button type="button" key={p.code} onClick={() => applyPreset(p.code)} className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-semibold text-slate-700 dark:text-slate-200 hover:border-[#128C7E]">
            {p.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم الشركة (مثال: ياليدين)" className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white" required />
        <div className="flex gap-1">
          <input type="number" min="0" value={cost} onChange={(e) => setCost(Number(e.target.value))} placeholder="سعر المنزل" title="سعر التوصيل للمنزل" className="w-2/3 p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold font-mono text-slate-900 dark:text-white" required />
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-1/3 p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
            {SUPPORTED_CURRENCIES.map((c) => (<option key={c.code} value={c.code}>{c.code}</option>))}
          </select>
        </div>
        <input type="number" min="0" value={deskCost ?? ''} onChange={(e) => setDeskCost(e.target.value ? Number(e.target.value) : undefined)} placeholder="سعر المكتب (Stop Desk)" className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white" />
        <input type="number" min="0" value={freeOver ?? ''} onChange={(e) => setFreeOver(e.target.value ? Number(e.target.value) : undefined)} placeholder="مجاني فوق (اختياري)" className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" />
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/80">
        <div className="flex items-center gap-3">
          <input type="text" value={estimatedDelivery} onChange={(e) => setEstimatedDelivery(e.target.value)} placeholder="مدة التوصيل" className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-[11px] w-36" />
          <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 dark:text-slate-300 text-[11px]">
            <input type="checkbox" checked={codAvailable} onChange={(e) => setCodAvailable(e.target.checked)} className="rounded text-[#128C7E]" />
            <span>الدفع عند الاستلام</span>
          </label>
        </div>
        <button type="submit" disabled={isSubmitting} className="h-8.5 px-4 rounded-xl bg-[#128C7E] text-white font-bold flex items-center gap-1 hover:bg-[#0ea593]">
          <Check className="w-3.5 h-3.5" /> <span>حفظ التسعيرة</span>
        </button>
      </div>
    </form>
  );
};
