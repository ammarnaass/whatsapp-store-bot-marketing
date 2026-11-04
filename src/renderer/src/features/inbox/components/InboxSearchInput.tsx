import React from 'react';
import { Search, RefreshCw } from 'lucide-react';

interface InboxSearchInputProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isSyncing?: boolean;
  onSyncChats?: () => void;
}

export const InboxSearchInput: React.FC<InboxSearchInputProps> = ({
  searchQuery,
  onSearchChange,
  isSyncing = false,
  onSyncChats,
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="بحث برقم الجوال أو اسم العميل..."
          className="w-full h-[38px] pr-9 pl-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#128C7E] transition-all"
        />
      </div>
      {onSyncChats && (
        <button
          onClick={onSyncChats}
          disabled={isSyncing}
          title="مزامنة محادثات واتساب الحقيقية"
          type="button"
          className="h-[38px] px-3 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] hover:bg-emerald-100 dark:hover:bg-[#128C7E]/30 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isSyncing ? 'جارٍ المزامنة...' : 'مزامنة واتساب'}</span>
        </button>
      )}
    </div>
  );
};

