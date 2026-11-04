import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface CarrierCardProps {
  name: string;
  active: boolean;
  onToggle: () => void;
}

export const CarrierCard: React.FC<CarrierCardProps> = ({
  name,
  active,
  onToggle,
}) => {
  return (
    <div
      onClick={onToggle}
      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer ${
        active
          ? 'bg-emerald-50/50 dark:bg-[#128C7E]/20 border-emerald-200 dark:border-emerald-800/50'
          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
      }`}
    >
      <CheckCircle2 className={`w-5 h-5 ${active ? 'text-[#128C7E]' : 'text-slate-400'}`} />
      <span className="text-xs font-bold text-slate-900 dark:text-white">{name}</span>
      <span className={`text-[10px] font-bold ${active ? 'text-[#128C7E]' : 'text-slate-400'}`}>
        {active ? 'متصل ونشط' : 'معطّل'}
      </span>
    </div>
  );
};

