import React, { useState } from 'react';
import { Plus, X, Layers, RefreshCw } from 'lucide-react';
import { Category, CategoryFormData } from '../types/category.types';
import { CategoryListItem } from './CategoryListItem';
import { CategoryFormModal } from './CategoryFormModal';
import { CategoryDeleteModal } from './CategoryDeleteModal';

interface CategoriesManagerModalProps {
  isOpen: boolean;
  categories: Category[];
  isLoading: boolean;
  onClose: () => void;
  onSaveCategory: (data: CategoryFormData) => Promise<boolean>;
  onDeleteCategory: (id: string, reassignToId?: string) => Promise<boolean>;
  onReorder: (ids: string[]) => Promise<boolean>;
  onRefresh: () => void;
}

export const CategoriesManagerModal: React.FC<CategoriesManagerModalProps> = ({
  isOpen,
  categories,
  isLoading,
  onClose,
  onSaveCategory,
  onDeleteCategory,
  onReorder,
  onRefresh,
}) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  if (!isOpen) return null;

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setIsFormOpen(true);
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;

    const newOrder = [...categories];
    const [moved] = newOrder.splice(idx, 1);
    newOrder.splice(targetIdx, 0, moved);
    onReorder(newOrder.map((c) => c.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#128C7E]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                إدارة فئات وأقسام المنتجات
              </h2>
              <p className="text-[11px] text-slate-400">
                تنظيم تصنيفات المتجر لفلترة سريعة ومساعدة وكيل واتساب الذكي
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onRefresh}
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              title="تحديث"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onClose} type="button" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
            إجمالي الفئات: <span className="font-mono text-[#128C7E]">{categories.length}</span>
          </span>
          <button
            onClick={handleOpenAdd}
            type="button"
            className="h-8 px-3.5 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-[#128C7E]/25 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة فئة جديدة</span>
          </button>
        </div>

        {/* Categories List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 scrollbar-thin">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              لا توجد فئات مسجلة حالياً. انقر على "إضافة فئة جديدة" للبدء.
            </div>
          ) : (
            categories.map((cat, idx) => (
              <CategoryListItem
                key={cat.id}
                category={cat}
                isFirst={idx === 0}
                isLast={idx === categories.length - 1}
                onEdit={handleOpenEdit}
                onDelete={setDeletingCategory}
                onMoveUp={(id) => handleMove(id, 'up')}
                onMoveDown={(id) => handleMove(id, 'down')}
              />
            ))
          )}
        </div>

        {/* Modals */}
        <CategoryFormModal
          isOpen={isFormOpen}
          initialCategory={editingCategory}
          onClose={() => setIsFormOpen(false)}
          onSave={onSaveCategory}
        />

        <CategoryDeleteModal
          isOpen={Boolean(deletingCategory)}
          category={deletingCategory}
          allCategories={categories}
          onClose={() => setDeletingCategory(null)}
          onConfirm={onDeleteCategory}
        />
      </div>
    </div>
  );
};
