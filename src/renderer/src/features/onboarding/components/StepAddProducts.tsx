import React from 'react';
import { Package, CheckCircle2 } from 'lucide-react';

export const StepAddProducts: React.FC = () => {
  return (
    <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 py-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center">
          <Package className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">الخطوة 3: إضافة أول منتجاتك</h4>
          <p className="text-slate-500 dark:text-slate-400 text-[11px]">منتجات فيزيائية للشحن أو رقمية بمفاتيح تراخيص</p>
        </div>
      </div>

      <p className="leading-relaxed">
        يمكنك استيراد منتجات متجرك دفعة واحدة عبر ملف CSV أو إضافتها يدوياً وتحديد أسعارها ونسب المخزون.
      </p>

      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-[#1F293D] text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-[#128C7E] shrink-0" />
        <span>تم تحميل المنتجات النموذجية الافتراضية بنجاح داخل قاعدة البيانات المحلية وجاهزة للتجربة.</span>
      </div>
    </div>
  );
};
