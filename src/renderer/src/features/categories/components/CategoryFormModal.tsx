import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Category, CategoryFormData } from '../types/category.types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../constants/category.constants';
import { useCategoryForm } from '../hooks/useCategoryForm';
import { CategoryBadge } from './CategoryBadge';
import { CategoryParentSelector } from './CategoryParentSelector';

interface CategoryFormModalProps {
  isOpen: boolean;
  initialCategory?: Category | null;
  categories?: Category[];
  onClose: () => void;
  onSave: (data: CategoryFormData) => Promise<boolean>;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen, initialCategory, categories = [], onClose, onSave,
}) => {
  const { formData, errors, handleChange, validate, resetForm } = useCategoryForm(initialCategory);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const ok = await onSave(formData);
      if (ok) {
        resetForm();
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CategoryBadge name={formData.name || 'معاينة'} icon={formData.icon} color={formData.color} size="md" />
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
              {formData.id ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
            </h3>
          </div>
          <button onClick={onClose} type="button" className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم الفئة *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="مثال: عطور وباقات، أجهزة ذكية..."
              className="w-full h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#128C7E]"
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الرمز التعريفي (Slug)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="مثال: perfumes, smart-watches"
              className="w-full h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-mono text-[11px] focus:outline-none focus:border-[#128C7E]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">لون التمييز</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => handleChange('color', col)}
                  className="w-5 h-5 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  style={{ backgroundColor: col }}
                >
                  {formData.color === col && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الأيقونة</label>
            <div className="grid grid-cols-8 gap-1 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              {CATEGORY_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => handleChange('icon', ic)}
                  className={`p-1 rounded-lg flex items-center justify-center ${formData.icon === ic ? 'bg-white dark:bg-slate-700 shadow-xs border border-slate-200' : 'hover:bg-slate-200/50'}`}
                >
                  <CategoryBadge name="" icon={ic} color={formData.color} size="sm" className="px-0 py-0 border-0 bg-transparent" />
                </button>
              ))}
            </div>
          </div>

          {categories.length > 0 && (
            <CategoryParentSelector
              value={formData.parent_id}
              onChange={(pId) => handleChange('parent_id', pId)}
              currentCategoryId={formData.id}
              categories={categories}
            />
          )}

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الوصف (اختياري)</label>
            <input
              type="text"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="وصف مختصر لمحتوى هذا القسم..."
              className="w-full h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-[#128C7E]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="h-8 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100">
              إلغاء
            </button>
            <button type="submit" disabled={isSubmitting} className="h-8 px-5 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white font-bold shadow-md shadow-[#128C7E]/20 transition-all disabled:opacity-50">
              {isSubmitting ? 'جارٍ الحفظ...' : formData.id ? 'حفظ التعديلات' : 'إضافة الفئة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
