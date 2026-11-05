import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Category } from '../types/category.types';

interface CategoryDeleteModalProps {
  category: Category | null;
  allCategories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, reassignToId?: string) => Promise<boolean>;
}

export const CategoryDeleteModal: React.FC<CategoryDeleteModalProps> = ({
  category,
  allCategories,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [reassignToId, setReassignToId] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !category) return null;

  const otherCategories = allCategories.filter((c) => c.id !== category.id);
  const productsCount = category.products_count || 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const ok = await onConfirm(category.id, reassignToId || undefined);
      if (ok) onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">تأكيد حذف الفئة</h3>
          </div>
          <button onClick={onClose} type="button" className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          هل أنت متأكد من رغبتك في حذف الفئة <span className="font-bold text-slate-900 dark:text-white">"{category.name}"</span>؟ لا يمكن التراجع عن هذا الإجراء.
        </p>

        {productsCount > 0 && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-xs space-y-2">
            <p className="font-bold text-amber-800 dark:text-amber-300">
              يوجد {productsCount} منتج مرتبط بهذه الفئة حالياً.
            </p>
            <label className="block text-[11px] text-amber-700 dark:text-amber-400">
              اختر فئة بديلة لنقل هذه المنتجات إليها:
            </label>
            <select
              value={reassignToId}
              onChange={(e) => setReassignToId(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg border border-amber-200 dark:border-amber-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="">بدون فئة (إلغاء التصنيف)</option>
              {otherCategories.map((c) => (
                <option key={c.id} value={c.id}>نقل إلى: {c.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-8 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 text-xs transition-all disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'جارٍ الحذف...' : 'حذف الفئة'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
