import React from 'react';
import { ChevronDown, ChevronLeft, Plus, Edit2, Trash2, Folder } from 'lucide-react';
import { Category, CategoryNode } from '../types/category.types';
import { CATEGORY_ICONS_MAP } from '../constants/category.constants';

interface CategoryTreeItemProps {
  node: CategoryNode;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onAddSub: (parentCat: Category) => void;
  collapsedIds: Set<string>;
  toggleCollapse: (id: string) => void;
}

export const CategoryTreeItem: React.FC<CategoryTreeItemProps> = ({
  node,
  onEdit,
  onDelete,
  onAddSub,
  collapsedIds,
  toggleCollapse,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isCollapsed = collapsedIds.has(node.id);
  const IconComp = CATEGORY_ICONS_MAP[node.icon || 'Folder'] || Folder;

  return (
    <div className="flex flex-col select-none">
      <div
        className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200"
        style={{ marginRight: `${node.level * 20}px` }}
      >
        {/* معلومات الفئة والأيقونة وتوسيع الشجرة */}
        <div className="flex items-center gap-2.5 min-w-0">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleCollapse(node.id)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={isCollapsed ? 'توسيع الفروع' : 'طي الفروع'}
            >
              {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          ) : (
            <div className="w-6 h-6 flex items-center justify-center text-slate-300 dark:text-slate-600 text-xs">
              {node.level > 0 ? '↳' : '•'}
            </div>
          )}

          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ backgroundColor: node.color || '#10B981' }}
          >
            <IconComp className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                {node.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                {node.products_count ?? 0} منتج
              </span>
              {node.level > 0 && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  فرعي
                </span>
              )}
            </div>
            {node.description && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs mt-0.5">
                {node.description}
              </p>
            )}
          </div>
        </div>

        {/* أزرار الإجراءات السريعة */}
        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onAddSub(node)}
            className="p-1.5 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
            title="إضافة فئة فرعية تحتها"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(node)}
            className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
            title="تعديل الفئة"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(node)}
            className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
            title="حذف الفئة"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* عناصر الأبناء التابعة */}
      {hasChildren && !isCollapsed && (
        <div className="mt-1 space-y-1 relative pr-3 before:absolute before:right-3 before:top-0 before:bottom-2 before:w-[1.5px] before:bg-slate-200 dark:before:bg-slate-800">
          {node.children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              node={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSub={onAddSub}
              collapsedIds={collapsedIds}
              toggleCollapse={toggleCollapse}
            />
          ))}
        </div>
      )}
    </div>
  );
};
