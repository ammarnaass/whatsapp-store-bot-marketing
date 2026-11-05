import React from 'react';
import { Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Category } from '../types/category.types';
import { CategoryBadge } from './CategoryBadge';

interface CategoryListItemProps {
  category: Category;
  isFirst: boolean;
  isLast: boolean;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      {/* Category Info & Reorder Controls */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => onMoveUp(category.id)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer"
            title="تحريك لأعلى"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => onMoveDown(category.id)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer"
            title="تحريك لأسفل"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>

        <CategoryBadge name={category.name} icon={category.icon} color={category.color} size="md" />

        <div className="hidden sm:flex flex-col">
          <span className="font-mono text-[10px] text-slate-400">/{category.slug}</span>
          {category.description && (
            <span className="text-[11px] text-slate-500 truncate max-w-xs">{category.description}</span>
          )}
        </div>
      </div>

      {/* Counts & Actions */}
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300 text-[11px] font-bold font-mono">
          {category.products_count ?? 0} منتج
        </span>

        <button
          type="button"
          onClick={() => onEdit(category)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-[#128C7E] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          title="تعديل"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(category)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
          title="حذف"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
