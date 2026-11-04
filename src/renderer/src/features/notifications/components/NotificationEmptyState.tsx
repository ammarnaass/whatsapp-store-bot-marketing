import React from 'react';
import { BellOff } from 'lucide-react';

export const NotificationEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 my-auto">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 text-slate-400">
        <BellOff className="w-7 h-7 text-slate-300 dark:text-slate-600" />
      </div>
      <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">
        لا توجد إشعارات جديدة
      </h4>
      <p className="text-[11px] text-slate-400 max-w-xs">
        ستظهر هنا تلقائياً كافة رسائل واتساب الجديدة، تحديثات الطلبات، وتنبيهات الوكيل الذكي.
      </p>
    </div>
  );
};

