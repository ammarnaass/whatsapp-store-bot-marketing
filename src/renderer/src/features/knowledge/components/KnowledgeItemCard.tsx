import React from 'react';
import { Edit2, Trash2, Cpu, Zap, Star } from 'lucide-react';
import { KnowledgeItem } from '../types/knowledge.types';
import { KnowledgeCategoryBadge } from './KnowledgeCategoryBadge';

interface KnowledgeItemCardProps {
  item: KnowledgeItem;
  onEdit: (item: KnowledgeItem) => void;
  onDelete: (item: KnowledgeItem) => void;
  onToggleActive: (id: string, currentActive: boolean) => void;
}

export const KnowledgeItemCard: React.FC<KnowledgeItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <div
      className={`p-4 rounded-2xl bg-white dark:bg-[#111827] border transition-all flex flex-col justify-between space-y-3 shadow-xs hover:border-[#128C7E]/40 ${
        item.active ? 'border-slate-200 dark:border-[#1F293D]' : 'border-slate-200/60 dark:border-slate-800/60 opacity-60'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <KnowledgeCategoryBadge category={item.category} sourceType={item.source_type} />

        <div className="flex items-center gap-2">
          {item.priority && item.priority >= 4 && (
            <span className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold" title="أولوية استرجاع عالية">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>مهم</span>
            </span>
          )}

          <label className="relative inline-flex items-center cursor-pointer" title={item.active ? 'مفعل بالوكيل' : 'معطل'}>
            <input
              type="checkbox"
              checked={item.active}
              onChange={() => onToggleActive(item.id, item.active)}
              className="sr-only peer"
            />
            <div className="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#128C7E]" />
          </label>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-1.5 flex-1">
        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
          {item.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
          {item.summary || item.content}
        </p>
      </div>

      {/* Footer Metrics & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono">
            <Cpu className="w-3 h-3 text-purple-500" />
            <span>{item.tokens_count || 100} T</span>
          </span>
          <span className="flex items-center gap-1 font-mono">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>{item.hit_count || 0} استدعاء</span>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#128C7E] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="تعديل الوثيقة"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
            title="حذف"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

