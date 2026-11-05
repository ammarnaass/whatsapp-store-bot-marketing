import React, { useState } from 'react';
import { Plus, X, Layers, RefreshCw, Network, List } from 'lucide-react';
import { Category, CategoryFormData } from '../types/category.types';
import { CategoryListItem } from './CategoryListItem';
import { CategoryTreeItem } from './CategoryTreeItem';
import { CategoryFormModal } from './CategoryFormModal';
import { CategoryDeleteModal } from './CategoryDeleteModal';
import { useCategoryTree } from '../hooks/useCategoryTree';

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
  isOpen, categories, isLoading, onClose, onSaveCategory, onDeleteCategory, onReorder, onRefresh,
}) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  const { tree } = useCategoryTree(categories);
  if (!isOpen) return null;

  const handleOpenAdd = (parentCat?: Category) => {
    setEditingCategory(parentCat ? ({ parent_id: parentCat.id, name: '', slug: '', icon: 'Folder', color: parentCat.color || '#10B981', active: true, sort_order: 1 } as any) : null);
    setIsFormOpen(true);
  };

  const toggleCollapse = (id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleMove = (id: string, dir: 'up' | 'down') => {
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) return;
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
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
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">إدارة فئات وأقسام المنتجات الهرمية</h2>
              <p className="text-[11px] text-slate-400">تنظيم تصنيفات المتجر وفروعها لمساعدة وكيل واتساب والفلترة</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={onRefresh} type="button" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" title="تحديث">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onClose} type="button" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><X className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-600 dark:text-slate-300">الإجمالي: <span className="font-mono text-[#128C7E]">{categories.length}</span></span>
            <div className="flex items-center bg-slate-200/60 dark:bg-slate-750 p-0.5 rounded-lg">
              <button type="button" onClick={() => setViewMode('tree')} className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${viewMode === 'tree' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'}`}><Network className="w-3 h-3" /> شجرة</button>
              <button type="button" onClick={() => setViewMode('list')} className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'}`}><List className="w-3 h-3" /> قائمة</button>
            </div>
          </div>
          <button onClick={() => handleOpenAdd()} type="button" className="h-8 px-3.5 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white font-bold flex items-center gap-1.5 shadow-sm transition-all"><Plus className="w-3.5 h-3.5" /><span>إضافة فئة رئيسية</span></button>
        </div>

        {/* Categories List / Tree */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 scrollbar-thin">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">لا توجد فئات مسجلة حالياً.</div>
          ) : viewMode === 'tree' ? (
            tree.map((node) => (
              <CategoryTreeItem key={node.id} node={node} onEdit={(cat) => { setEditingCategory(cat); setIsFormOpen(true); }} onDelete={setDeletingCategory} onAddSub={(p) => handleOpenAdd(p)} collapsedIds={collapsedIds} toggleCollapse={toggleCollapse} />
            ))
          ) : (
            categories.map((cat, idx) => (
              <CategoryListItem key={cat.id} category={cat} isFirst={idx === 0} isLast={idx === categories.length - 1} onEdit={(c) => { setEditingCategory(c); setIsFormOpen(true); }} onDelete={setDeletingCategory} onMoveUp={(id) => handleMove(id, 'up')} onMoveDown={(id) => handleMove(id, 'down')} />
            ))
          )}
        </div>

        {/* Modals */}
        <CategoryFormModal isOpen={isFormOpen} initialCategory={editingCategory} categories={categories} onClose={() => setIsFormOpen(false)} onSave={onSaveCategory} />
        <CategoryDeleteModal isOpen={Boolean(deletingCategory)} category={deletingCategory} allCategories={categories} onClose={() => setDeletingCategory(null)} onConfirm={onDeleteCategory} />
      </div>
    </div>
  );
};
