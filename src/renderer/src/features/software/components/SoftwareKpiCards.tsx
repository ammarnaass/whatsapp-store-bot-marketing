import React from 'react';
import { AppWindow, KeyRound, CheckCircle2, DollarSign } from 'lucide-react';
import { SoftwareKpis } from '../types/software.types';

interface Props {
  kpis: SoftwareKpis;
}

export const SoftwareKpiCards: React.FC<Props> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400">إجمالي الأنظمة والبرامج</p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{kpis.totalSolutions}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
          <AppWindow className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400">تراخيص متاحة للتسليم</p>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{kpis.availableKeys}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
          <KeyRound className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400">تفعيلات مباعة للعملاء</p>
          <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">{kpis.soldKeys}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400">عائدات مبيعات التراخيص</p>
          <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
            {kpis.totalRevenue.toLocaleString()} ر.س
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
