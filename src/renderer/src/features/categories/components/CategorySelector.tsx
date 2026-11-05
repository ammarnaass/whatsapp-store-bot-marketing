import React from 'react';
import { Plus } from 'lucide-react';
import { Category } from '../types/category.types';
import { CategoryBadge } from './CategoryBadge';

interface CategorySelectorProps {
  value: string;
  categories: Category[];
  onChange: (categoryName: string, categoryId?: string) => void;
  onOpenCreate?: () => void;
  disabled?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  categories,
  onChange,
  onOpenCreate,
  disabled = false,
}) => {
  const activeCategories = categories.filter((c) => c.active);
  const selectedCat = categories.find((c) => c.name === value || c.id === value);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs">
          التصنيف / الفئة
        </label>
        {onOpenCreate && (
          <button
            type="button"
            onClick={onOpenCreate}
            className="text-[11px] font-bold text-[#128C7E] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>فئة جديدة</span>
          </button>
        )}
      </div>

      <div className="relative flex items-center">
        <select
          value={selectedCat ? selectedCat.id : value}
          onChange={(e) => {
            const cat = categories.find((c) => c.id === e.target.value);
            if (cat) {
              onChange(cat.name, cat.id);
            } else {
              onChange(e.target.value);
            }
          }}
          disabled={disabled}
          className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#128C7E] disabled:opacity-50"
        >
          {activeCategories.length === 0 ? (
            <option value={value}>{value || 'عام'}</option>
          ) : (
            activeCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))
          )}
        </select>

        {selectedCat && (
          <div className="absolute left-7 pointer-events-none">
            <CategoryBadge
              name=""
              icon={selectedCat.icon}
              color={selectedCat.color}
              size="sm"
              className="px-0 py-0 border-0 bg-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
};
