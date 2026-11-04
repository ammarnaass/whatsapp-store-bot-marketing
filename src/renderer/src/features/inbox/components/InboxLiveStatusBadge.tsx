import React from 'react';

export const InboxLiveStatusBadge: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#128C7E]"></span>
        </span>
        <span className="text-[11px] font-bold text-[#128C7E]">مزامنة حية نشطة (Live)</span>
      </div>
      <span className="text-[10px] text-slate-400 font-medium">استقبال فوري &lt; 500ms</span>
    </div>
  );
};

