import React from 'react';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';

export const NotificationBellButton: React.FC = () => {
  const notifications = useNotificationStore((s) => s.notifications);
  const setDrawerOpen = useNotificationStore((s) => s.setDrawerOpen);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setDrawerOpen(true)}
        type="button"
        className="w-[38px] h-[38px] rounded-xl border border-slate-200 dark:border-[#1F293D] bg-white dark:bg-[#111827] elevation-1 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer group"
        title="مركز التنبيهات والإشعارات الفورية"
      >
        <Bell className="w-4 h-4 group-hover:scale-110 transition-transform text-slate-700 dark:text-slate-200" />
      </button>

      {unreadCount > 0 && (
        <>
          {/* Animated ping dot */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75" />
          {/* Numerical badge */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums pointer-events-none shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        </>
      )}
    </div>
  );
};

