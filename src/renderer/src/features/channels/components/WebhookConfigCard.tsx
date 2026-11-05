import React from 'react';
import { Radio, Play, CheckCircle2, Zap } from 'lucide-react';

interface WebhookConfigCardProps {
  callbackUrl: string;
  verifyToken: string;
  onVerifyTokenChange: (token: string) => void;
  isPingingWebhook: boolean;
  onWebhookPing: () => void;
  onCopy: (text: string, label: string) => void;
}

export const WebhookConfigCard: React.FC<WebhookConfigCardProps> = ({
  callbackUrl,
  verifyToken,
  onVerifyTokenChange,
  isPingingWebhook,
  onWebhookPing,
  onCopy,
}) => {
  return (
    <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] elevation-1 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              خطافات الويب لـ Meta (Webhooks)
            </h2>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-[#128C7E]/20 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            استماع لحظي :3005
          </span>
        </div>

        <div className="space-y-3">
          {/* Callback URL */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              عنوان الرد السريع لـ Meta (Callback URL)
            </span>
            <div className="relative flex items-center">
              <input
                type="text"
                readOnly
                value={callbackUrl}
                dir="ltr"
                className="w-full font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 pl-20 focus:outline-none"
              />
              <button
                onClick={onWebhookPing}
                disabled={isPingingWebhook}
                type="button"
                className="absolute left-1.5 px-3 py-1 bg-[#128C7E] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Play className={`w-3 h-3 ${isPingingWebhook ? 'animate-spin' : ''}`} />
                <span>{isPingingWebhook ? '...' : 'فحص'}</span>
              </button>
            </div>
          </div>

          {/* Verify Token */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              رمز التحقق السري (Verify Token)
            </span>
            <div className="relative flex items-center">
              <input
                type="text"
                value={verifyToken}
                onChange={(e) => onVerifyTokenChange(e.target.value)}
                dir="ltr"
                className="w-full font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 pl-14 focus:outline-none focus:border-[#128C7E]"
              />
              <button
                onClick={() => onCopy(verifyToken, 'Verify Token')}
                type="button"
                className="absolute left-1.5 px-2 py-0.5 bg-white dark:bg-slate-800 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                نسخ
              </button>
            </div>
          </div>

          {/* Subscribed Events */}
          <div className="pt-1">
            <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
              الأحداث المشتركة في Meta App Dashboard:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {['messages', 'message_deliveries', 'message_reads', 'interactive_replies'].map((ev) => (
                <div
                  key={ev}
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#128C7E]" />
                  <span className="font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">{ev}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-[#1F293D]">
        <span className="text-xs text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>الرد الآلي على مصافحة hub.challenge مفعّل بنجاح 200 OK</span>
        </span>
      </div>
    </div>
  );
};
