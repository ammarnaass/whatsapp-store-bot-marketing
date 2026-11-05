import React from 'react';
import { Category } from '../types/category.types';
import { getDescendantCategoryIds } from '../hooks/useCategoryTree';

interface CategoryParentSelectorProps {
  value: string | null | undefined;
  onChange: (parentId: string | null) => void;
  currentCategoryId?: string;
  categories: Category[];
  disabled?: boolean;
}

export const CategoryParentSelector: React.FC<CategoryParentSelectorProps> = ({
  value,
  onChange,
  currentCategoryId,
  categories,
  disabled = false,
}) => {
  // استثناء الفئة الحالية وكافة الفئات المنحدرة منها لتجنب الحلقات الدائرية
  const excludedIds = React.useMemo(() => {
    if (!currentCategoryId) return new Set<string>();
    return new Set(getDescendantCategoryIds(currentCategoryId, categories));
  }, [currentCategoryId, categories]);

  const availableParents = categories.filter((c) => !excludedIds.has(c.id));

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
        الفئة الأب (اختياري - للفئات الفرعية)
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? e.target.value : null)}
        disabled={disabled}
        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
      >
        <option value="">-- فئة رئيسية مستقلة (بدون أب) --</option>
        {availableParents.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.parent_id ? `↳ ${cat.name}` : `📁 ${cat.name}`}
          </option>
        ))}
      </select>
      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        اختر فئة رئيسية إذا كنت تريد جعل هذا التصنيف فرعاً تابعاً لها.
      </p>
    </div>
  );
};

