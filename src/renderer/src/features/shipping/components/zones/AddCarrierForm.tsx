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
    <form onSubmit={handleSubmit} className="p-3.5 bg-muted/30 rounded-2xl border border-border space-y-2.5 text-xs">
      <div className="font-extrabold text-foreground flex items-center justify-between">
        <span className="flex items-center gap-1.5"><Plus className="w-4 h-4 text-primary" /> إضافة شركة / تسعيرة</span>
        <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value as any)} className="px-2 py-0.5 rounded bg-background border border-border text-[11px] font-semibold text-foreground">
          <option value="both">🏠 منزل + 🏢 مكتب (Stop Desk)</option>
          <option value="home">🏠 توصيل منزلي فقط</option>
          <option value="desk">🏢 استلام مكتبي فقط</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-1 items-center">
        <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-0.5"><Zap className="w-3 h-3 text-amber-500" /> اقتراحات:</span>
        {presets.slice(0, 5).map((p) => (
          <button type="button" key={p.code} onClick={() => applyPreset(p.code)} className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-medium text-foreground hover:border-primary">
            {p.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم الشركة (مثال: ياليدين)" className="p-2 bg-background rounded-lg border border-border font-bold text-foreground" required />
        <div className="flex gap-1">
          <input type="number" min="0" value={cost} onChange={(e) => setCost(Number(e.target.value))} placeholder="سعر المنزل" title="سعر التوصيل للمنزل" className="w-2/3 p-2 bg-background rounded-lg border border-border font-bold font-mono text-foreground" required />
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-1/3 p-1.5 bg-background rounded-lg border border-border font-bold text-foreground">
            {SUPPORTED_CURRENCIES.map((c) => (<option key={c.code} value={c.code}>{c.code}</option>))}
          </select>
        </div>
        <input type="number" min="0" value={deskCost ?? ''} onChange={(e) => setDeskCost(e.target.value ? Number(e.target.value) : undefined)} placeholder="سعر المكتب (Stop Desk)" className="p-2 bg-background rounded-lg border border-border font-mono text-foreground" />
        <input type="number" min="0" value={freeOver ?? ''} onChange={(e) => setFreeOver(e.target.value ? Number(e.target.value) : undefined)} placeholder="مجاني فوق (اختياري)" className="p-2 bg-background rounded-lg border border-border text-foreground" />
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/60">
        <div className="flex items-center gap-3">
          <input type="text" value={estimatedDelivery} onChange={(e) => setEstimatedDelivery(e.target.value)} placeholder="مدة التوصيل" className="p-1.5 bg-background rounded-lg border border-border text-foreground text-[11px] w-36" />
          <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-foreground text-[11px]">
            <input type="checkbox" checked={codAvailable} onChange={(e) => setCodAvailable(e.target.checked)} className="rounded text-primary" />
            <span>الدفع عند الاستلام</span>
          </label>
        </div>
        <button type="submit" disabled={isSubmitting} className="h-8 px-4 rounded-lg bg-primary text-primary-foreground font-bold flex items-center gap-1 hover:bg-primary/90">
          <Check className="w-3.5 h-3.5" /> <span>حفظ التسعيرة</span>
        </button>
      </div>
    </form>
  );
};
