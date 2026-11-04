import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';

interface ShippingZoneFormProps {
  onSave: (zone: { name: string; cities: string[]; fee: number; freeOver?: number }) => Promise<any>;
}

export const ShippingZoneForm: React.FC<ShippingZoneFormProps> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [fee, setFee] = useState(25);
  const [freeOver, setFreeOver] = useState<number | undefined>(200);
  const [citiesInput, setCitiesInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const cities = citiesInput
        .split(/[,،]/)
        .map((c) => c.trim())
        .filter(Boolean);
      await onSave({ name: name.trim(), cities, fee: Number(fee), freeOver: freeOver ? Number(freeOver) : undefined });
      setName('');
      setCitiesInput('');
      setFee(25);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
        <Plus className="w-4 h-4 text-cyan-600" />
        <span>إضافة منطقة شحن جديدة</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="اسم المنطقة (مثل: المنطقة الجنوبية)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          required
        />
        <input
          type="number"
          placeholder="تكلفة الشحن (ر.س)"
          value={fee}
          onChange={(e) => setFee(Number(e.target.value))}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="المدن مفصولة بفاصلة (أبها، جازان...)"
          value={citiesInput}
          onChange={(e) => setCitiesInput(e.target.value)}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        />
        <input
          type="number"
          placeholder="شحن مجاني للطلبات فوق (ر.س)"
          value={freeOver ?? ''}
          onChange={(e) => setFreeOver(e.target.value ? Number(e.target.value) : undefined)}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium flex items-center justify-center gap-1.5 shadow-xs"
      >
        <Check className="w-4 h-4" />
        <span>حفظ المنطقة</span>
      </button>
    </form>
  );
};

