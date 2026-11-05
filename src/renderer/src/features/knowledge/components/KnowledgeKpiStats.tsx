import React from 'react';
import { BookOpen, CheckCircle, Cpu, Zap } from 'lucide-react';
import { KnowledgeStats } from '../types/knowledge.types';

interface KnowledgeKpiStatsProps {
  stats: KnowledgeStats;
}

export const KnowledgeKpiStats: React.FC<KnowledgeKpiStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 block">إجمالي وثائق المعرفة</span>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {stats.totalItems} مصدر
          </span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#128C7E] flex items-center justify-center shrink-0">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 block">مصادر مفعلة بالوكيل</span>
          <span className="text-lg font-extrabold text-[#128C7E] font-mono tabular-nums">
            {stats.activeItems} نشط
          </span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center shrink-0">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 block">حجم الذاكرة المقدر</span>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            ~{stats.totalTokens.toLocaleString('ar-SA')} Token
          </span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 block">إجمالي استدعاءات الوكيل</span>
          <span className="text-lg font-extrabold text-amber-600 font-mono tabular-nums">
            {stats.totalHits} استرجاع
          </span>
        </div>
      </div>
    </div>
  );
};
