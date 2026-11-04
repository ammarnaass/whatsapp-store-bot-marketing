import React from 'react';
import { ProductFormData, ProductFormErrors } from '../../types/products.types';
import { StockStatusBadge } from '../badges/StockStatusBadge';

interface ProductInventorySectionProps {
  formData: ProductFormData;
  errors: ProductFormErrors;
  onChange: <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => void;
}

export const ProductInventorySection: React.FC<ProductInventorySectionProps> = ({
  formData,
  errors,
  onChange,
}) => {
  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 block">حالة المخزون المتوقعة:</span>
          <span className="text-[11px] text-slate-400">مؤشر توافر القطع في المستودع</span>
        </div>
        <StockStatusBadge stock={formData.stock} threshold={formData.low_stock_threshold} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            الكمية المتوفرة في المستودع <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => onChange('stock', Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
          />
          {errors.stock && <p className="text-rose-500 text-[11px] mt-1">{errors.stock}</p>}
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            حد التنبيه عند انخفاض المخزون
          </label>
          <input
            type="number"
            min="0"
            value={formData.low_stock_threshold}
            onChange={(e) => onChange('low_stock_threshold', Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
          />
          <p className="text-[11px] text-slate-400 mt-1">يتم إرسال إشعار للتاجر عند وصول الكمية لهذا الحد</p>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.allow_backorders}
            onChange={(e) => onChange('allow_backorders', e.target.checked)}
            className="rounded text-[#128C7E] focus:ring-[#128C7E]"
          />
          <div>
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              السماح بالطلب المسبق (Backorders)
            </span>
            <span className="text-[11px] text-slate-400">
              استمرار قبول طلبات العملاء عبر واتساب حتى في حال نفاد الكمية من المستودع
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};

