import React from 'react';
import { SoftwareLicenseType } from '../types/software.types';

export interface FormState {
  name: string; ver: string; cat: string; lic: SoftwareLicenseType; price: number;
  dl: string; site: string; img: string; inst: string; imgsRaw: string; shotsRaw: string; keysRaw: string;
}

export const SoftwareFormFields: React.FC<{
  form: FormState; setForm: (f: FormState) => void; isEdit: boolean;
}> = ({ form, setForm, isEdit }) => {
  return (
    <div className="space-y-3 text-xs">
      <div className="grid grid-cols-3 gap-2.5">
        <div className="col-span-2">
          <label className="block font-bold mb-1">اسم البرنامج *</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="برنامج نقاط بيع POS Pro" className="w-full h-8 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
        </div>
        <div>
          <label className="block font-bold mb-1">الإصدار</label>
          <input value={form.ver} onChange={(e) => setForm({ ...form, ver: e.target.value })} className="w-full h-8 px-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div>
          <label className="block font-bold mb-1">التصنيف</label>
          <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })} className="w-full h-8 px-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <option value="نقاط بيع ومحلات">نقاط بيع ومحلات</option>
            <option value="روضات ومدارس">روضات ومدارس</option>
            <option value="مخازن ومستودعات">مخازن ومستودعات</option>
            <option value="محاسبة وفواتير">محاسبة وفواتير</option>
          </select>
        </div>
        <div>
          <label className="block font-bold mb-1">نوع التفعيل</label>
          <select value={form.lic} onChange={(e) => setForm({ ...form, lic: e.target.value as any })} className="w-full h-8 px-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <option value="lifetime">دائم مدى الحياة</option>
            <option value="yearly">اشتراك سنوي</option>
            <option value="monthly">اشتراك شهري</option>
          </select>
        </div>
        <div>
          <label className="block font-bold mb-1">السعر (ر.س)</label>
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full h-8 px-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block font-bold mb-1">رابط التحميل (Setup)</label>
          <input type="url" value={form.dl} onChange={(e) => setForm({ ...form, dl: e.target.value })} placeholder="https://domain.com/setup.exe" className="w-full h-8 px-2 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-[11px]" />
        </div>
        <div>
          <label className="block font-bold mb-1">الموقع الرسمي</label>
          <input type="url" value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} placeholder="https://domain.com" className="w-full h-8 px-2 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-[11px]" />
        </div>
      </div>

      <div>
        <label className="block font-bold mb-1">رابط صورة الغلاف أو الشعار</label>
        <input type="url" value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} placeholder="https://images.unsplash.com/..." className="w-full h-8 px-2 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-[11px]" />
      </div>

      <div>
        <label className="block font-bold mb-1">شرح خطوات التفعيل للعميل</label>
        <textarea rows={2} value={form.inst} onChange={(e) => setForm({ ...form, inst: e.target.value })} className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block font-bold mb-1">صور مكان التفعيل (سطور)</label>
          <textarea rows={2} value={form.imgsRaw} onChange={(e) => setForm({ ...form, imgsRaw: e.target.value })} placeholder="https://img-activation.jpg" className="w-full p-1.5 rounded-xl border border-slate-200 font-mono text-[10px]" />
        </div>
        <div>
          <label className="block font-bold mb-1">صور واجهات البرنامج (سطور)</label>
          <textarea rows={2} value={form.shotsRaw} onChange={(e) => setForm({ ...form, shotsRaw: e.target.value })} placeholder="https://img-ui.jpg" className="w-full p-1.5 rounded-xl border border-slate-200 font-mono text-[10px]" />
        </div>
      </div>

      {!isEdit && (
        <div>
          <label className="block font-bold mb-1">مفاتيح تفعيل أولية (مفتاح في كل سطر)</label>
          <textarea rows={2} value={form.keysRaw} onChange={(e) => setForm({ ...form, keysRaw: e.target.value })} placeholder="KEY-1234-ABCD&#10;KEY-5678-EFGH" className="w-full p-1.5 rounded-xl border border-slate-200 font-mono text-[10px]" />
        </div>
      )}
    </div>
  );
};
