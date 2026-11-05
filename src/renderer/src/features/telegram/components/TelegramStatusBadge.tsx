import React from 'react';
import { Send, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { TelegramStatusResult } from '../types/telegram.types';

interface TelegramStatusBadgeProps {
  status: TelegramStatusResult;
  size?: 'sm' | 'md';
}

export const TelegramStatusBadge: React.FC<TelegramStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const isOnline = status.isConnected && status.isPolling;
  const isConfigured = status.isConnected && !status.isPolling;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  if (isOnline) {
    return (
      <span className={`inline-flex items-center font-bold rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#0088cc] border border-blue-200 dark:border-blue-800 ${sizeClasses}`}>
        <span className="w-2 h-2 rounded-full bg-[#0088cc] animate-pulse"></span>
        <span>تليغرام: متصل ونشط</span>
      </span>
    );
  }

  if (isConfigured) {
    return (
      <span className={`inline-flex items-center font-bold rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 ${sizeClasses}`}>
        <AlertCircle className="w-3 h-3" />
        <span>تليغرام: متوقف مؤقتاً</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 ${sizeClasses}`}>
      <XCircle className="w-3 h-3" />
      <span>تليغرام: غير متصل</span>
    </span>
  );
};

