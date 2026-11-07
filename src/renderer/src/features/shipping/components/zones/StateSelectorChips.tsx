import React, { useState, useMemo } from 'react';
import { Search, CheckSquare, Square } from 'lucide-react';
import { getStatesForCountry } from '@shared/shipping/states-registry';
import type { StateInfo } from '@shared/shipping/types';

interface Props {
  countryCode: string;
  selectedStates: string[];
  onChange: (states: string[]) => void;
}

export const StateSelectorChips: React.FC<Props> = ({ countryCode, selectedStates, onChange }) => {
  const [search, setSearch] = useState('');
  const allStates: StateInfo[] = useMemo(() => getStatesForCountry(countryCode), [countryCode]);

  const filtered = useMemo(() => {
    if (!search.trim()) return allStates;
    const q = search.trim().toLowerCase();
    return allStates.filter((s) => s.name.includes(q) || s.code.includes(q) || (s.nameEn && s.nameEn.toLowerCase().includes(q)));
  }, [allStates, search]);

  const regions = useMemo(() => {
    const set = new Set<string>();
    allStates.forEach((s) => s.region && set.add(s.region));
    return Array.from(set);
  }, [allStates]);

  const toggleState = (code: string) => {
    onChange(selectedStates.includes(code) ? selectedStates.filter((c) => c !== code) : [...selectedStates, code]);
  };

  const selectRegion = (reg: string) => {
    const regCodes = allStates.filter((s) => s.region === reg).map((s) => s.code);
    onChange(Array.from(new Set([...selectedStates, ...regCodes])));
  };

  if (allStates.length === 0) {
    return <div className="text-xs text-slate-400 py-2 text-center">لا توجد قائمة ولايات مسجلة لهذه الدولة، سيتم اعتماد تسعيرة الدولة العامة.</div>;
  }

  return (
    <div className="space-y-2.5 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3.5 bg-slate-50/80 dark:bg-slate-800/40">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
          <span>الولايات المشمولة:</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#128C7E] font-bold text-[11px]">
            {selectedStates.length} من {allStates.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <button type="button" onClick={() => onChange(allStates.map((s) => s.code))} className="px-2 py-0.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-700 text-[#128C7E] font-bold flex items-center gap-1">
            <CheckSquare className="w-3 h-3" /> تحديد الكل
          </button>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <button type="button" onClick={() => onChange([])} className="px-2 py-0.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-400 font-bold flex items-center gap-1">
            <Square className="w-3 h-3" /> إلغاء الكل
          </button>
        </div>
      </div>

      {regions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[10px] text-slate-400 font-bold">مناطق سريعة:</span>
          {regions.map((reg) => (
            <button
              key={reg} type="button" onClick={() => selectRegion(reg)}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold"
            >
              + {reg}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-400" />
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن ولاية أو محافظة بالاسم أو الرمز..."
          className="w-full text-xs pr-8 pl-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#128C7E]"
        />
      </div>

      <div className="max-h-36 overflow-y-auto p-1 grid grid-cols-2 sm:grid-cols-3 gap-1.5 scrollbar-thin">
        {filtered.map((state) => {
          const isSelected = selectedStates.includes(state.code);
          return (
            <button
              key={state.code} type="button" onClick={() => toggleState(state.code)}
              className={`flex items-center justify-between text-right px-2.5 py-1.5 rounded-xl text-[11px] transition-all border ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-[#128C7E] text-[#128C7E] font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:border-[#128C7E]/50'
              }`}
            >
              <span className="truncate">{state.name}</span>
              <span className="text-[9px] opacity-70 px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800">{state.code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
