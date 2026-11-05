import React from 'react';
import { Layers, Settings2 } from 'lucide-react';
import { Category } from '../types/category.types';
import { CategoryBadge } from './CategoryBadge';

interface CategoryFilterChipsProps {
  categories: Category[];
  selectedId: string | 'all';
  onSelect: (id: string | 'all') => void;
  totalProductsCount: number;
  onOpenManageModal?: () => void;
}

export const CategoryFilterChips: React.FC<CategoryFilterChipsProps> = ({
  categories,
  selectedId,
  onSelect,
  totalProductsCount,
  onOpenManageModal,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-thin">
      <div className="flex items-center gap-1.5 flex-nowrap">
        {/* شريحة جميع الفئات */}
        <button
          type="button"
          onClick={() => onSelect('all')}
          className={`h-8 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
            selectedId === 'all'
              ? 'bg-[#128C7E] text-white border-[#128C7E] shadow-xs'
              : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>كافة الفئات</span>
          <span className="font-mono tabular-nums opacity-80">({totalProductsCount})</span>
        </button>

        {/* شرائح الفئات المخصصة */}
        {categories.filter((c) => c.active).map((cat) => {
          const isSelected = selectedId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={`h-8 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                isSelected
                  ? 'text-white border-transparent shadow-xs'
                  : 'bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              style={isSelected ? { backgroundColor: cat.color || '#128C7E' } : undefined}
            >
              {!isSelected && <CategoryBadge name="" icon={cat.icon} color={cat.color} size="sm" className="px-1 py-0.5 border-0 bg-transparent" />}
              <span>{cat.name}</span>
              {typeof cat.products_count === 'number' && (
                <span className="font-mono tabular-nums opacity-80">({cat.products_count})</span>
              )}
            </button>
          );
        })}
      </div>

      {onOpenManageModal && (
        <button
          type="button"
          onClick={onOpenManageModal}
          className="h-8 px-2.5 rounded-xl text-xs font-bold shrink-0 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
          title="إدارة وتعديل الفئات"
        >
          <Settings2 className="w-3.5 h-3.5 text-[#128C7E]" />
          <span className="hidden sm:inline">إدارة الفئات</span>
        </button>
      )}
    </div>
  );
};
