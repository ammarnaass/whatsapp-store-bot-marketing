import React from 'react';
import { MessageSquare, RefreshCw } from 'lucide-react';

interface InboxEmptyViewProps {
  isSyncing?: boolean;
  onSyncChats?: () => void;
}

export const InboxEmptyView: React.FC<InboxEmptyViewProps> = ({
  isSyncing = false,
  onSyncChats,
}) => {
  return (
    <div className="p-6 flex flex-col items-center justify-center text-center h-full my-auto">
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#128C7E] flex items-center justify-center mb-3">
        <MessageSquare className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
        لا توجد محادثات نشطة بعد
      </h4>
      <p className="text-xs text-slate-400 max-w-xs mb-4">
        تم تفريغ البيانات الوهمية. يمكنك جلب محادثاتك ورسائلك الحالية من واتساب مباشرة عبر النقر أدناه.
      </p>
      {onSyncChats && (
        <button
          onClick={onSyncChats}
          disabled={isSyncing}
          type="button"
          className="px-4 py-2 rounded-xl bg-[#128C7E] hover:bg-[#0e7064] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'جارٍ جلب المحادثات...' : 'مزامنة محادثات واتساب الآن'}</span>
        </button>
      )}
    </div>
  );
};

