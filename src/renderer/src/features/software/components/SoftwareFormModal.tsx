import React, { useState, useEffect } from 'react';
import { X, Save, AppWindow } from 'lucide-react';
import { SoftwareWithInventory, SoftwareLicenseType } from '../types/software.types';
import { softwareService } from '../services/software.service';
import { SoftwareFormFields, FormState } from './SoftwareFormFields';

interface Props { item: SoftwareWithInventory | null; isOpen: boolean; onClose: () => void; onSaved: () => void; }

const DEFAULT_FORM: FormState = {
  name: '', ver: 'v1.0.0', cat: 'نقاط بيع ومحلات', lic: 'lifetime' as SoftwareLicenseType,
  price: 900, dl: '', site: '', img: '', inst: '1. تثبيت البرنامج.\n2. إدخال كود التفعيل الرقمي.',
  imgsRaw: '', shotsRaw: '', keysRaw: '',
};

export const SoftwareFormModal: React.FC<Props> = ({ item, isOpen, onClose, onSaved }) => {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.software_name || '', ver: item.version || 'v1.0.0', cat: item.category || 'نقاط بيع ومحلات',
        lic: item.license_type || 'lifetime', price: item.price || 0, dl: item.download_url || '', site: item.website_url || '',
        img: item.cover_image || '', inst: item.activation_instructions || '',
        imgsRaw: (item.activation_guide_images || []).join('\n'), shotsRaw: (item.screenshots || []).join('\n'), keysRaw: '',
      });
    } else { setForm(DEFAULT_FORM); }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    const payload = {
      software_name: form.name, version: form.ver, category: form.cat, license_type: form.lic, price: form.price,
      download_url: form.dl, website_url: form.site, cover_image: form.img, activation_instructions: form.inst,
      activation_guide_images: form.imgsRaw.split('\n').map((s) => s.trim()).filter(Boolean),
      screenshots: form.shotsRaw.split('\n').map((s) => s.trim()).filter(Boolean),
      initialKeys: form.keysRaw.split('\n').map((s) => s.trim()).filter(Boolean),
    };
    try {
      const res = item ? await softwareService.update(item.id, payload) : await softwareService.create(payload);
      if (res.success) { onSaved(); onClose(); }
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AppWindow className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">{item ? 'تعديل البرنامج' : 'إضافة حل برمجي وتفعيل'}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <SoftwareFormFields form={form} setForm={setForm} isEdit={Boolean(item)} />
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="h-8 px-3 rounded-xl border border-slate-200 text-slate-600 font-bold">إلغاء</button>
            <button type="submit" disabled={loading} className="h-8 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 disabled:opacity-50">
              <Save className="w-3.5 h-3.5" /> <span>{loading ? 'جارٍ الحفظ...' : 'حفظ البرنامج'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
