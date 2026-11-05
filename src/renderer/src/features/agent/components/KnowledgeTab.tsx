import React, { useState } from 'react';
import {
  useKnowledge,
  KnowledgeKpiStats,
  KnowledgeFilterBar,
  KnowledgeListView,
  KnowledgeFormModal,
  KnowledgeDeleteModal,
  KnowledgeTestSimulator,
  KnowledgeItem,
} from '../../knowledge';

interface KnowledgeTabProps {
  suggestAlternatives: boolean;
  onToggleSuggestAlternatives: (val: boolean) => void;
  autoDiscountOnHesitation: boolean;
  onToggleAutoDiscount: (val: boolean) => void;
}

export const KnowledgeTab: React.FC<KnowledgeTabProps> = ({
  suggestAlternatives,
  onToggleSuggestAlternatives,
  autoDiscountOnHesitation,
  onToggleAutoDiscount,
}) => {
  const {
    items,
    filteredItems,
    stats,
    isLoading,
    filters,
    setFilters,
    saveItem,
    removeItem,
    toggleActive,
  } = useKnowledge();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<KnowledgeItem | null>(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: KnowledgeItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  return (
    <div className="flex flex-col space-y-5 animate-in fade-in duration-150">
      {/* 1. KPI Stats Summary */}
      <KnowledgeKpiStats stats={stats} />

      {/* 2. Interactive Knowledge Test Simulator */}
      <KnowledgeTestSimulator />

      {/* 3. Sales Behavior Toggles */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
          قواعد السلوك البيعي للوكيل
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] cursor-pointer">
            <div className="flex flex-col pr-2">
              <span className="font-bold text-slate-900 dark:text-white">اقتراح بدائل ذكية</span>
              <span className="text-[11px] text-slate-400">توصية بمنتجات بديلة عند نفاد المخزون</span>
            </div>
            <input
              type="checkbox"
              checked={suggestAlternatives}
              onChange={(e) => onToggleSuggestAlternatives(e.target.checked)}
              className="w-4 h-4 rounded text-[#128C7E] focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] cursor-pointer">
            <div className="flex flex-col pr-2">
              <span className="font-bold text-slate-900 dark:text-white">كوبونات تحفيزية للإغلاق</span>
              <span className="text-[11px] text-slate-400">منح خصم تحفيزي فوري عند تردد العميل</span>
            </div>
            <input
              type="checkbox"
              checked={autoDiscountOnHesitation}
              onChange={(e) => onToggleAutoDiscount(e.target.checked)}
              className="w-4 h-4 rounded text-[#128C7E] focus:ring-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 4. Filter Bar */}
      <KnowledgeFilterBar
        filters={filters}
        onChangeFilters={setFilters}
        onOpenCreate={handleOpenAdd}
        totalCount={items.length}
      />

      {/* 5. List View */}
      <KnowledgeListView
        items={filteredItems}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={setDeletingItem}
        onToggleActive={toggleActive}
        onOpenCreate={handleOpenAdd}
      />

      {/* 6. Form Modal */}
      <KnowledgeFormModal
        isOpen={isFormOpen}
        initialItem={editingItem}
        onClose={() => setIsFormOpen(false)}
        onSave={saveItem}
      />

      {/* 7. Delete Confirmation Modal */}
      <KnowledgeDeleteModal
        isOpen={Boolean(deletingItem)}
        item={deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={removeItem}
      />
    </div>
  );
};
