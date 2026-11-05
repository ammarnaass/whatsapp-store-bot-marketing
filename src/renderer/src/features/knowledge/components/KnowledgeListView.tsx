import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { KnowledgeItem } from '../types/knowledge.types';
import { KnowledgeItemCard } from './KnowledgeItemCard';

interface KnowledgeListViewProps {
  items: KnowledgeItem[];
  isLoading: boolean;
  onEdit: (item: KnowledgeItem) => void;
  onDelete: (item: KnowledgeItem) => void;
  onToggleActive: (id: string, currentActive: boolean) => void;
  onOpenCreate: () => void;
}

export const KnowledgeListView: React.FC<KnowledgeListViewProps> = ({
  items,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
  onOpenCreate,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800/40 animate-pulse border border-slate-200 dark:border-slate-800" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center mx-auto">
          <BookOpen className="w-6 h-6" />
        </div>
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
          لا توجد وثائق معرفية مطابقة
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          لم يتم العثور على أي مصدر معرفة يطابق خيارات التصفية الحالية. يمكنك إضافة مصدر جديد لتوجيه الوكيل الذكي.
        </p>
        <button
          type="button"
          onClick={onOpenCreate}
          className="h-8 px-4 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة مصدر معرفة</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <KnowledgeItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
};

