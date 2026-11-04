import React from 'react';
import { Database, Sparkles } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';

interface DataControlBadgeProps {
  onOpenManager: () => void;
}

export const DataControlBadge: React.FC<DataControlBadgeProps> = ({ onOpenManager }) => {
  const isMockDataActive = useDataStore((s) => s.isMockDataActive);

  return (
    <button
      onClick={onOpenManager}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm cursor-pointer ${
        isMockDataActive
          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/40'
          : 'bg-emerald-50 dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
      }`}
      title="إدارة البيانات التجريبية والوهمية (توليد وحذف)"
    >
      <Database className="w-3.5 h-3.5" />
      <span className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            isMockDataActive ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
          }`}
        />
        <span>{isMockDataActive ? 'بيانات تجريبية نشطة' : 'بيانات نظيفة فارغة'}</span>
      </span>
      <Sparkles className="w-3 h-3 opacity-60" />
    </button>
  );
};
