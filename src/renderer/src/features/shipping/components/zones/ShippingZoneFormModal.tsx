import React, { useState, useEffect } from 'react';
import { X, Globe, MapPin, Check } from 'lucide-react';
import { ShippingZone } from '../../types/shipping.types';
import { SUPPORTED_SHIPPING_COUNTRIES } from '../../constants/carriers-presets';

interface Props {
  isOpen: boolean; initialData?: ShippingZone | null;
  onClose: () => void; onSave: (data: Partial<ShippingZone>) => Promise<void>;
}

export const ShippingZoneFormModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSave }) => {
  const [countryCode, setCountryCode] = useState('SA');
  const [name, setName] = useState('');
  const [citiesInput, setCitiesInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCountryCode(initialData.country_code || 'SA');
      setName(initialData.name || '');
      setCitiesInput((initialData.cities || []).join('، '));
    } else {
      setCountryCode('SA');
      setName('المملكة العربية السعودية (كافة المناطق)');
      setCitiesInput('');
    }
  }, [initialData, isOpen]);

  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    const country = SUPPORTED_SHIPPING_COUNTRIES.find((c) => c.code === code);
    if (country && !initialData) setName(`${country.name} (كافة المدن)`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const country = SUPPORTED_SHIPPING_COUNTRIES.find((c) => c.code === countryCode);
      const cities = citiesInput.split(/[,،]/).map((c) => c.trim()).filter(Boolean);
      await onSave({
        id: initialData?.id, name: name.trim(), country_code: countryCode,
        country_name: country?.name || 'دولة أخرى', cities, is_active: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#128C7E]" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {initialData ? 'تعديل منطقة ودولة الشحن' : 'إضافة دولة / منطقة شحن جديدة'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">اختر الدولة المستهدفة</label>
            <select
              value={countryCode}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold cursor-pointer"
            >
              {SUPPORTED_SHIPPING_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">اسم المنطقة الجغرافية</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: الجزائر - سائر الولايات أو الرياض والخرج"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
              required
            />
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">المدن أو الولايات المشمولة</label>
            <textarea
              rows={3}
              value={citiesInput}
              onChange={(e) => setCitiesInput(e.target.value)}
              placeholder="اترك هذا الحقل فارغاً لتغطية كافة مدن الدولة، أو اكتب المدن مفصولة بفاصلة (مثال: الرياض، جدة، مكة أو الجزائر، وهران، سطيف)"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white leading-relaxed resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold">إلغاء</button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-[#128C7E] text-white font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#0ea593]">
              <Check className="w-4 h-4" />
              <span>{initialData ? 'تحديث المنطقة' : 'حفظ المنطقة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
