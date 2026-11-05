import React from 'react';
import { Edit2, Trash2, Share2, Sparkles, Box } from 'lucide-react';
import { Collection } from '../types/collection.types';
import { COLLECTION_ICONS_MAP } from '../constants/collection.constants';

interface CollectionCardProps {
  collection: Collection;
  onEdit: (coll: Collection) => void;
  onDelete: (id: string) => void;
  onShare: (coll: Collection) => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onEdit,
  onDelete,
  onShare,
}) => {
  const IconComp = COLLECTION_ICONS_MAP[collection.icon || 'Sparkles'] || Sparkles;

  return (
    <div className="group flex flex-col justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all duration-200">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: collection.color || '#7C3AED' }}
          >
            <IconComp className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onShare(collection)}
              className="p-1.5 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
              title="مشاركة عبر واتساب"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(collection)}
              className="p-1.5 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg transition-colors"
              title="تعديل"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(collection.id)}
              className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
              title="حذف"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
          {collection.name}
        </h3>
        {collection.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
            {collection.description}
          </p>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Box className="w-3.5 h-3.5" />
          <span>{collection.products_count ?? 0} منتج</span>
        </span>
        {collection.is_smart && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium">
            ذكية
          </span>
        )}
      </div>
    </div>
  );
};

