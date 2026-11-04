import React from 'react';
import { ProductFormData, ProductFormErrors } from '../../types/products.types';
import { PRODUCT_CATEGORIES } from '../../constants/products.constants';

interface ProductBasicSectionProps {
  formData: ProductFormData;
  errors: ProductFormErrors;
  onChange: <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => void;
}

export const ProductBasicSection: React.FC<ProductBasicSectionProps> = ({
  formData,
  errors,
  onChange,
}) => {
  return (
    <div className="space-y-3.5 text-xs">
      <div>
        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
          اسم المنتج <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="مثال: عطر خشب الصندل الملكي 100 مل"
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#128C7E]/20"
        />
        {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رمز التخزين (SKU)</label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => onChange('sku', e.target.value)}
            placeholder="مثال: PERF-SNDL-01"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الباركود الدولي (EAN / UPC)</label>
          <input
            type="text"
            value={formData.barcode || ''}
            onChange={(e) => onChange('barcode', e.target.value)}
            placeholder="مثال: 6281000000000"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">التصنيف</label>
          <select
            value={formData.category}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">نوع المنتج</label>
          <select
            value={formData.type}
            onChange={(e) => onChange('type', e.target.value as 'physical' | 'digital')}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value="physical">فيزيائي (شحن وتوصيل)</option>
            <option value="digital">رقمي (مفتاح تسليم فوري)</option>
          </select>
        </div>
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">العلامة التجارية</label>
          <input
            type="text"
            value={formData.brand || ''}
            onChange={(e) => onChange('brand', e.target.value)}
            placeholder="مثال: أطياب الشرق"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">وصف المنتج التفصيلي</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="أدخل مميزات ومواصفات المنتج لكي يشرحها الوكيل الذكي للعملاء بالتفصيل..."
          className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white leading-relaxed"
        />
      </div>

      <div className="flex items-center gap-6 pt-1 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.active}
            onChange={(e) => onChange('active', e.target.checked)}
            className="rounded text-[#128C7E] focus:ring-[#128C7E]"
          />
          <span className="font-medium text-slate-700 dark:text-slate-300">منتج نشط ومتاح للطلب في المتجر</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => onChange('is_featured', e.target.checked)}
            className="rounded text-amber-600 focus:ring-amber-500"
          />
          <span className="font-medium text-slate-700 dark:text-slate-300">تمييز المنتج في كروت واتساب (Featured)</span>
        </label>
      </div>
    </div>
  );
};

