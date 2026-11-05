import React from 'react';
import { ChevronLeft, Folder } from 'lucide-react';
import { Category } from '../types/category.types';
import { getCategoryBreadcrumbPath } from '../hooks/useCategoryTree';

interface CategoryBreadcrumbsProps {
  categoryId?: string | null;
  categories: Category[];
  onSelectCategory?: (id: string) => void;
  className?: string;
}

export const CategoryBreadcrumbs: React.FC<CategoryBreadcrumbsProps> = ({
  categoryId,
  categories,
  onSelectCategory,
  className = '',
}) => {
  if (!categoryId) return null;

  const path = getCategoryBreadcrumbPath(categoryId, categories);
  if (path.length === 0) return null;

  return (
    <nav className={`flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto ${className}`}>
      <Folder className="w-3.5 h-3.5 shrink-0 text-slate-400" />
      {path.map((item, index) => {
        const isLast = index === path.length - 1;
        return (
          <React.Fragment key={item.id}>
            {index > 0 && <ChevronLeft className="w-3 h-3 text-slate-400 shrink-0" />}
            {isLast ? (
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {item.name}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onSelectCategory?.(item.id)}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 truncate hover:underline transition-colors"
              >
                {item.name}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
