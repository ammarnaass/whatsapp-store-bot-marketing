import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Collection, CollectionFormData, Product } from '../types/collection.types';
import { COLLECTION_COLORS, COLLECTION_ICONS } from '../constants/collection.constants';
import { useCollectionForm } from '../hooks/useCollectionForm';
import { CollectionBadge } from './CollectionBadge';
import { CollectionProductPicker } from './CollectionProductPicker';

interface CollectionFormModalProps {
  isOpen: boolean;
  initialCollection?: Collection | null;
  allProducts: Product[];
  onClose: () => void;
  onSave: (data: CollectionFormData) => Promise<boolean>;
}

export const CollectionFormModal: React.FC<CollectionFormModalProps> = ({
  isOpen, initialCollection, allProducts, onClose, onSave,
}) => {
  const { formData, errors, handleChange, toggleProduct, validate, resetForm } = useCollectionForm(initialCollection);
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
      <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CollectionBadge name={formData.name || 'معاينة'} icon={formData.icon} color={formData.color} size="md" />
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
              {initialCollection ? 'تعديل المجموعة التسويقية' : 'إنشاء مجموعة جديدة'}
            </h3>
          </div>
          <button onClick={onClose} type="button" className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs overflow-y-auto flex-1 scrollbar-thin">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المجموعة *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="مثال: الأكثر مبيعاً، عروض اليوم الوطني..."
              className="w-full h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-600"
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">لون التمييز</label>
              <div className="flex flex-wrap gap-1.5">
                {COLLECTION_COLORS.map((col) => (
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
              <div className="grid grid-cols-6 gap-1 p-1 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                {COLLECTION_ICONS.slice(0, 6).map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => handleChange('icon', ic)}
                    className={`p-1 rounded-lg flex items-center justify-center ${formData.icon === ic ? 'bg-white dark:bg-slate-700 shadow-xs' : 'hover:bg-slate-200/50'}`}
                  >
                    <CollectionBadge name="" icon={ic} color={formData.color} size="sm" className="px-0 py-0 border-0 bg-transparent" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">وصف المجموعة</label>
            <input
              type="text"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="وصف مختصر للترويج بالواتساب..."
              className="w-full h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <CollectionProductPicker
            selectedIds={formData.product_ids || []}
            onToggleProduct={toggleProduct}
            allProducts={allProducts}
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="h-8 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100">
              إلغاء
            </button>
            <button type="submit" disabled={isSubmitting} className="h-8 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20 transition-all disabled:opacity-50">
              {isSubmitting ? 'جارٍ الحفظ...' : initialCollection ? 'حفظ التعديلات' : 'إنشاء المجموعة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
