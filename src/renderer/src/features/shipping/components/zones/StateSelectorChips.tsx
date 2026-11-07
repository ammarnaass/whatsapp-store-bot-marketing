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
    return <div className="text-xs text-muted-foreground py-2 text-center">لا توجد قائمة ولايات مسجلة لهذه الدولة، سيتم اعتماد تسعيرة الدولة العامة.</div>;
  }

  return (
    <div className="space-y-2 border border-border/60 rounded-xl p-3 bg-muted/20">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <span>الولايات المشمولة:</span>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
            {selectedStates.length} من {allStates.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <button type="button" onClick={() => onChange(allStates.map((s) => s.code))} className="px-2 py-0.5 rounded hover:bg-muted text-primary font-medium flex items-center gap-1">
            <CheckSquare className="w-3 h-3" /> تحديد الكل
          </button>
          <span className="text-muted-foreground/40">|</span>
          <button type="button" onClick={() => onChange([])} className="px-2 py-0.5 rounded hover:bg-muted text-muted-foreground font-medium flex items-center gap-1">
            <Square className="w-3 h-3" /> إلغاء الكل
          </button>
        </div>
      </div>

      {regions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 pt-1">
          <span className="text-[10px] text-muted-foreground font-medium">مناطق سريعة:</span>
          {regions.map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => selectRegion(reg)}
              className="text-[10px] px-2 py-0.5 rounded-md bg-secondary/80 hover:bg-secondary text-secondary-foreground transition-colors"
            >
              + {reg}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن ولاية أو محافظة بالاسم أو الرمز..."
          className="w-full text-xs pr-8 pl-3 py-1.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="max-h-36 overflow-y-auto p-1 grid grid-cols-2 sm:grid-cols-3 gap-1.5 scrollbar-thin">
        {filtered.map((state) => {
          const isSelected = selectedStates.includes(state.code);
          return (
            <button
              key={state.code}
              type="button"
              onClick={() => toggleState(state.code)}
              className={`flex items-center justify-between text-right px-2 py-1 rounded-md text-[11px] transition-all border ${
                isSelected
                  ? 'bg-primary/15 border-primary text-primary font-bold shadow-xs'
                  : 'bg-background/80 border-border/60 text-muted-foreground hover:border-primary/40'
              }`}
            >
              <span className="truncate">{state.name}</span>
              <span className="text-[9px] opacity-70 px-1 py-0.2 rounded bg-muted/60">{state.code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
