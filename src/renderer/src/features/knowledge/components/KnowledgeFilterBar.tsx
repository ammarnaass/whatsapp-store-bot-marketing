import React from 'react';
import { Search, Plus, Layers } from 'lucide-react';
import { KnowledgeFilterState } from '../types/knowledge.types';
import { KNOWLEDGE_CATEGORIES, KNOWLEDGE_SOURCE_TYPES } from '../constants/knowledge.constants';

interface KnowledgeFilterBarProps {
  filters: KnowledgeFilterState;
  onChangeFilters: (filters: KnowledgeFilterState) => void;
  onOpenCreate: () => void;
  totalCount: number;
}

export const KnowledgeFilterBar: React.FC<KnowledgeFilterBarProps> = ({
  filters,
  onChangeFilters,
  onOpenCreate,
  totalCount,
}) => {
  return (
    <div className="flex flex-col gap-3 bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-xs">
      {/* Category Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <div className="flex items-center gap-1.5 flex-nowrap">
          <button
            type="button"
            onClick={() => onChangeFilters({ ...filters, category: 'all' })}
            className={`h-8 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
              filters.category === 'all'
                ? 'bg-[#128C7E] text-white border-[#128C7E] shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>كافة التصنيفات</span>
            <span className="font-mono tabular-nums opacity-80">({totalCount})</span>
          </button>

          {KNOWLEDGE_CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onChangeFilters({ ...filters, category: cat.value })}
                className={`h-8 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                  isSelected
                    ? 'text-white border-transparent shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
                style={isSelected ? { backgroundColor: cat.color } : undefined}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="h-8 px-3.5 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm shadow-[#128C7E]/25 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة مصدر معرفة</span>
        </button>
      </div>

      {/* Search & Source Type Selector */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChangeFilters({ ...filters, search: e.target.value })}
            placeholder="البحث في عناوين المعرفة، الإجابات، أو الكلمات المفتاحية..."
            className="w-full h-9 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pr-9 pl-4 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#128C7E]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={filters.source_type}
          onChange={(e) => onChangeFilters({ ...filters, source_type: e.target.value as any })}
          className="h-9 px-3 w-full sm:w-56 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#128C7E]"
        >
          <option value="all">كافة أنواع المصادر (الكل)</option>
          {KNOWLEDGE_SOURCE_TYPES.map((st) => (
            <option key={st.value} value={st.value}>
              {st.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

