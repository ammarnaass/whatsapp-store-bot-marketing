import React from 'react';
import { Bot } from 'lucide-react';
import { ChatFilterMode } from '../types/inbox.types';

interface InboxFilterChipsProps {
  totalCount: number;
  filterMode: ChatFilterMode;
  onFilterModeChange: (mode: ChatFilterMode) => void;
}

export const InboxFilterChips: React.FC<InboxFilterChipsProps> = ({
  totalCount,
  filterMode,
  onFilterModeChange,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
      <button
        onClick={() => onFilterModeChange('all')}
        type="button"
        className={`h-8 px-3 rounded-xl whitespace-nowrap cursor-pointer transition-all flex items-center justify-center ${
          filterMode === 'all'
            ? 'bg-[#128C7E] text-white elevation-1'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        الكل ({totalCount})
      </button>

      <button
        onClick={() => onFilterModeChange('human')}
        type="button"
        className={`h-8 px-3 rounded-xl whitespace-nowrap cursor-pointer flex items-center gap-1.5 transition-all justify-center ${
          filterMode === 'human'
            ? 'bg-rose-600 text-white elevation-1'
            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
        تدخل بشري
      </button>

      <button
        onClick={() => onFilterModeChange('ai')}
        type="button"
        className={`h-8 px-3 rounded-xl whitespace-nowrap cursor-pointer flex items-center gap-1.5 transition-all justify-center ${
          filterMode === 'ai'
            ? 'bg-[#7C3AED] text-white elevation-1'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        <Bot className="w-3.5 h-3.5 text-[#7C3AED]" />
        الذكاء الاصطناعي
      </button>

      <button
        onClick={() => onFilterModeChange('abandoned')}
        type="button"
        className={`h-8 px-3 rounded-xl whitespace-nowrap cursor-pointer transition-all flex items-center justify-center ${
          filterMode === 'abandoned'
            ? 'bg-[#128C7E] text-white elevation-1'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        سلات متروكة
      </button>

      <button
        onClick={() => onFilterModeChange('vip')}
        type="button"
        className={`h-8 px-3 rounded-xl whitespace-nowrap cursor-pointer transition-all flex items-center justify-center ${
          filterMode === 'vip'
            ? 'bg-[#128C7E] text-white elevation-1'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        VIP
      </button>
    </div>
  );
};

