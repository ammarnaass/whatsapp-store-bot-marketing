import React from 'react';
import { Bell, Send, CheckCircle2 } from 'lucide-react';
import { AdminAlertSettings } from '../../types/settings.types';

interface AlertsHeaderProps {
  alerts: AdminAlertSettings;
  onSendTestAlert: () => void;
  isSendingAlert: boolean;
}

export const AlertsHeader: React.FC<AlertsHeaderProps> = ({
  alerts,
  onSendTestAlert,
  isSendingAlert,
}) => {
  const activeCount = [
    alerts.newOrderAlert,
    alerts.vipOrdersAlert,
    alerts.abandonedCartAlert,
    alerts.lowStockAlert,
    alerts.humanEscalationAlert,
    alerts.channelDisconnectAlert,
    alerts.morningDigestAlert,
    alerts.eveningDigestAlert,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-[#1F293D]">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0"
          style={{ backgroundColor: 'var(--color-brand-primary)' }}
        >
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-900 dark:text-white">إشعارات النظام وتنبيهات الإدارة</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              {activeCount} تنبيهات مفعلة
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            توجيه التنبيهات الفورية للمدير عبر واتساب، سطح المكتب، والبريد الإلكتروني 24/7
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onSendTestAlert}
          disabled={isSendingAlert}
          className="h-9 px-4 rounded-xl text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-brand-primary)' }}
        >
          <Send className={`w-3.5 h-3.5 ${isSendingAlert ? 'animate-bounce' : ''}`} />
          <span>{isSendingAlert ? 'جارٍ الإرسال...' : 'إرسال تنبيه تجريبي'}</span>
        </button>
      </div>
    </div>
  );
};

