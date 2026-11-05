import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ContrastRating } from '../types/tokens.types';

interface ContrastRatioBadgeProps {
  label: string;
  rating: ContrastRating;
}

export const ContrastRatioBadge: React.FC<ContrastRatioBadgeProps> = ({ label, rating }) => {
  const isAAA = rating.level === 'AAA';
  const isAA = rating.level === 'AA';
  const isFail = rating.level === 'FAIL';

  const badgeColor = isAAA
    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
    : isAA
    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60'
    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60';

  const Icon = isAAA ? CheckCircle2 : isAA ? CheckCircle2 : ShieldAlert;

  return (
    <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${badgeColor}`}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 shrink-0" />
        <div>
          <span className="font-bold block text-[11px]">{label}</span>
          <span className="text-[10px] opacity-80">{rating.message}</span>
        </div>
      </div>
      <div className="text-left font-mono font-bold text-xs shrink-0 pl-1">
        <span>{rating.ratioText}</span>
        <span className="mr-1.5 px-1.5 py-0.5 rounded text-[9px] font-sans font-black uppercase bg-black/10 dark:bg-white/10">
          {rating.level}
        </span>
      </div>
    </div>
  );
};
