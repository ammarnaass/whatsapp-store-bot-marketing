import React from 'react';
import { MessageSquare, ShoppingBag, Bot, Info, ArrowLeft, Trash2 } from 'lucide-react';
import { AppNotification } from '../types/notification.types';

interface NotificationItemCardProps {
  notification: AppNotification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
  onNavigateTab?: (tab: string, id?: string) => void;
}

export const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  notification,
  onMarkAsRead,
  onRemove,
  onNavigateTab,
}) => {
  const getIcon = () => {
    switch (notification.category) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-[#128C7E]" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-blue-500" />;
      case 'ai_alert':
        return <Bot className="w-4 h-4 text-[#7C3AED]" />;
      default:
        return <Info className="w-4 h-4 text-amber-500" />;
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.actionTab && onNavigateTab) {
      onNavigateTab(notification.actionTab, notification.actionId);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group flex gap-3 ${
        notification.read
          ? 'bg-white dark:bg-[#111827] border-slate-100 dark:border-[#1F293D] opacity-85 hover:opacity-100 hover:border-slate-300'
          : 'bg-emerald-50/40 dark:bg-[#128C7E]/10 border-emerald-200/60 dark:border-[#128C7E]/30 shadow-xs'
      }`}
    >
      {/* Category Icon */}
      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
            {notification.title}
          </h4>
          <span className="text-[10px] text-slate-400 font-mono shrink-0">
            {notification.timestamp}
          </span>
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>

        {/* Footer info & Action Pill */}
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 dark:border-[#1F293D]/60 text-[10px]">
          {notification.phone ? (
            <span className="font-mono text-[#075E54] dark:text-emerald-300 font-bold dir-ltr">
              +{notification.phone}
            </span>
          ) : (
            <span className="text-slate-400">إشعار نظام</span>
          )}

          {notification.actionTab && (
            <span className="text-[#128C7E] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              عرض التفاصيل <ArrowLeft className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>

      {/* Delete on hover button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(notification.id);
        }}
        type="button"
        title="حذف هذا الإشعار"
        className="opacity-0 group-hover:opacity-100 absolute top-2 left-2 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-opacity"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Unread indicator */}
      {!notification.read && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
      )}
    </div>
  );
};

