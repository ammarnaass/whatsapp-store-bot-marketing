import React from 'react';
import { Layers, Settings, Sparkles } from 'lucide-react';
import { Collection, CollectionFilterId } from '../types/collection.types';
import { COLLECTION_ICONS_MAP } from '../constants/collection.constants';

interface CollectionsFilterBarProps {
  collections: Collection[];
  selectedId: CollectionFilterId;
  onSelect: (id: CollectionFilterId) => void;
  onManage?: () => void;
  className?: string;
}

export const CollectionsFilterBar: React.FC<CollectionsFilterBarProps> = ({
  collections,
  selectedId,
  onSelect,
  onManage,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto py-1 scrollbar-none ${className}`}>
      {/* خيار الكل */}
      <button
        type="button"
        onClick={() => onSelect('all')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
          selectedId === 'all'
            ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
            : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600'
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
        <span>جميع المجموعات</span>
      </button>

      {/* شرائح المجموعات */}
      {collections.map((coll) => {
        const isSelected = selectedId === coll.id;
        const IconComp = COLLECTION_ICONS_MAP[coll.icon || 'Sparkles'] || Sparkles;

        return (
          <button
            key={coll.id}
            type="button"
            onClick={() => onSelect(coll.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
              isSelected
                ? 'text-white shadow-sm'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:opacity-90'
            }`}
            style={{
              backgroundColor: isSelected ? coll.color || '#7C3AED' : undefined,
              borderColor: isSelected ? coll.color || '#7C3AED' : undefined,
            }}
          >
            <IconComp className="w-3.5 h-3.5 shrink-0" />
            <span>{coll.name}</span>
            {typeof coll.products_count === 'number' && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {coll.products_count}
              </span>
            )}
          </button>
        );
      })}

      {/* زر إدارة المجموعات */}
      {onManage && (
        <button
          type="button"
          onClick={onManage}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-dashed border-slate-300 dark:border-slate-700 transition-colors whitespace-nowrap shrink-0"
          title="إدارة المجموعات التسويقية"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>إدارة</span>
        </button>
      )}
    </div>
  );
};

