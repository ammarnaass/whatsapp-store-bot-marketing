import React, { useEffect } from 'react';
import { MessageSquare, ShoppingBag, Bot, Info, X } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';
import { AppNotification } from '../types/notification.types';

export const NotificationToastContainer: React.FC = () => {
  const toasts = useNotificationStore((s) => s.toasts);
  const dismissToast = useNotificationStore((s) => s.dismissToast);
  const setDrawerOpen = useNotificationStore((s) => s.setDrawerOpen);

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id)}
          onOpenCenter={() => {
            dismissToast(toast.id);
            setDrawerOpen(true);
          }}
        />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  toast: AppNotification;
  onDismiss: () => void;
  onOpenCenter: () => void;
}> = ({ toast, onDismiss, onOpenCenter }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getIcon = () => {
    switch (toast.category) {
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

  return (
    <div
      onClick={onOpenCenter}
      className="pointer-events-auto p-3.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-2xl shadow-2xl flex items-start gap-3 cursor-pointer animate-in slide-in-from-bottom duration-300 hover:scale-[1.02] transition-transform"
    >
      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
          {toast.title}
        </h5>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
          {toast.message}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        type="button"
        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

