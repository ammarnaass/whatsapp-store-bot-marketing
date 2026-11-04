import React from 'react';
import { Bell, CheckCheck, Trash2, X } from 'lucide-react';

interface NotificationHeaderProps {
  unreadCount: number;
  totalCount: number;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  unreadCount,
  totalCount,
  onMarkAllAsRead,
  onClearAll,
  onClose,
}) => {
  return (
    <div className="p-4 border-b border-slate-200 dark:border-[#1F293D] flex items-center justify-between shrink-0 bg-white dark:bg-[#111827]">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#128C7E] flex items-center justify-center font-bold">
          <Bell className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
            مركز الإشعارات الفورية
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {unreadCount} جديد
              </span>
            )}
          </h3>
          <span className="text-[10px] text-slate-400">
            {totalCount} إشعار مسجل محلياً
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            type="button"
            title="تحديد الكل كمقروء"
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#128C7E] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
          </button>
        )}

        {totalCount > 0 && (
          <button
            onClick={onClearAll}
            type="button"
            title="مسح كافة الإشعارات"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onClose}
          type="button"
          title="إغلاق الدرج"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer mr-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

