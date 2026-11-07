import React, { useState, useEffect } from 'react';
import { X, Globe, Check } from 'lucide-react';
import { ShippingZone } from '../../types/shipping.types';
import { GLOBAL_COUNTRIES_LIST, getCountryByCode } from '@shared/shipping/countries.data';
import { StateSelectorChips } from './StateSelectorChips';

interface Props {
  isOpen: boolean; initialData?: ShippingZone | null;
  onClose: () => void; onSave: (data: Partial<ShippingZone>) => Promise<void>;
}

export const ShippingZoneFormModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSave }) => {
  const [countryCode, setCountryCode] = useState('DZ');
  const [name, setName] = useState('');
  const [scopeType, setScopeType] = useState<'all_states' | 'specific_states' | 'specific_cities'>('all_states');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [citiesInput, setCitiesInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCountryCode(initialData.country_code || 'DZ');
      setName(initialData.name || '');
      setScopeType(initialData.scope_type || 'all_states');
      setSelectedStates(initialData.states || []);
      setCitiesInput((initialData.cities || []).join('، '));
    } else {
      setCountryCode('DZ');
      setName('الجزائر (سائر الولايات)');
      setScopeType('all_states');
      setSelectedStates([]);
      setCitiesInput('');
    }
  }, [initialData, isOpen]);

  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    setSelectedStates([]);
    const c = getCountryByCode(code);
    if (!initialData) setName(`${c.name} (${scopeType === 'all_states' ? 'سائر الولايات' : 'نطاق مخصص'})`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const c = getCountryByCode(countryCode);
      const cities = citiesInput.split(/[,،]/).map((s) => s.trim()).filter(Boolean);
      await onSave({
        id: initialData?.id, name: name.trim(), country_code: countryCode, country_name: c.name,
        scope_type: scopeType, states: selectedStates, cities, is_active: true,
      });
    } finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        <div className="flex items-center justify-between p-3.5 px-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">{initialData ? 'تعديل نطاق الشحن' : 'إضافة دولة / منطقة شحن جديدة'}</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold mb-1 text-foreground">الدولة المستهدفة</label>
              <select value={countryCode} onChange={(e) => handleCountryChange(e.target.value)} className="w-full px-2.5 py-1.5 bg-background rounded-lg border border-border text-foreground font-medium">
                {GLOBAL_COUNTRIES_LIST.map((c) => (<option key={c.code} value={c.code}>{c.flag} {c.name} ({c.code})</option>))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-foreground">تغطية النطاق</label>
              <select value={scopeType} onChange={(e) => setScopeType(e.target.value as any)} className="w-full px-2.5 py-1.5 bg-background rounded-lg border border-border text-foreground font-medium">
                <option value="all_states">كافة الولايات (شحن شامل)</option>
                <option value="specific_states">ولايات / محافظات محددة</option>
                <option value="specific_cities">مدن / بلديات مخصصة</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-foreground">اسم نطاق الشحن</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: الجزائر العاصمة والوسط، أو الشرق والغرب" className="w-full px-3 py-1.5 bg-background rounded-lg border border-border text-foreground font-bold" required />
          </div>

          {scopeType === 'specific_states' && (
            <StateSelectorChips countryCode={countryCode} selectedStates={selectedStates} onChange={setSelectedStates} />
          )}

          {scopeType === 'specific_cities' && (
            <div>
              <label className="block font-semibold mb-1 text-foreground">المدن أو البلديات (مفصولة بفاصلة)</label>
              <textarea rows={2} value={citiesInput} onChange={(e) => setCitiesInput(e.target.value)} placeholder="الجزائر، بئر مراد رايس، حيدرة..." className="w-full px-3 py-1.5 bg-background rounded-lg border border-border text-foreground resize-none" />
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg text-muted-foreground hover:bg-muted font-semibold">إلغاء</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold flex items-center gap-1 hover:bg-primary/90">
              <Check className="w-3.5 h-3.5" /> <span>{initialData ? 'تحديث النطاق' : 'حفظ النطاق'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
