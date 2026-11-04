import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import { DataSection } from '../types/data-management.types';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  sectionKey?: DataSection;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  sectionKey
}) => {
  const seedSection = useDataStore((s) => s.seedSection);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white dark:bg-[#111827] rounded-2xl border border-dashed border-slate-200 dark:border-[#1F293D] shadow-sm animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4 ring-8 ring-slate-50/50 dark:ring-slate-800/30">
        {icon}
      </div>
      <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        {primaryActionLabel && onPrimaryAction && (
          <button
            onClick={onPrimaryAction}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#128C7E] hover:bg-[#0d6e63] text-white text-xs font-bold shadow-md shadow-[#128C7E]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{primaryActionLabel}</span>
          </button>
        )}

        {sectionKey && (
          <button
            onClick={() => seedSection(sectionKey)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 text-[#7C3AED] dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/50 text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>تعبئة بيانات تجريبية (Demo)</span>
          </button>
        )}
      </div>
    </div>
  );
};
