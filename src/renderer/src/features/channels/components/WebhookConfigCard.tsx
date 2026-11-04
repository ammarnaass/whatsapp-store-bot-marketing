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
  onCopy
}) => {
  return (
    <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-sm flex flex-col justify-between space-y-5">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              خطافات الويب (Webhooks)
            </h2>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-[#128C7E]/20 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            استماع لحظي
          </span>
        </div>

        <div className="space-y-3.5">
          {/* Callback URL */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              عنوان الرد السريع (Callback URL)
            </span>
            <div className="relative flex items-center">
              <input
                type="text"
                readOnly
                value={callbackUrl}
                dir="ltr"
                className="w-full font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 pl-20 focus:outline-none select-all"
              />
              <button
                onClick={onWebhookPing}
                disabled={isPingingWebhook}
                type="button"
                className="absolute left-1.5 px-3 py-1 bg-[#128C7E] text-white hover:bg-[#075E54] text-xs font-bold rounded-lg flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
              >
                <Play className={`w-3 h-3 ${isPingingWebhook ? 'animate-spin' : ''}`} />
                <span>{isPingingWebhook ? 'فحص...' : 'فحص'}</span>
              </button>
            </div>
          </div>

          {/* Verify Token */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              رمز التحقق السري (Verify Token)
            </span>
            <div className="relative flex items-center">
              <input
                type="text"
                value={verifyToken}
                onChange={(e) => onVerifyTokenChange(e.target.value)}
                dir="ltr"
                className="w-full font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 pl-16 focus:outline-none focus:border-[#128C7E]"
              />
              <button
                onClick={() => onCopy(verifyToken, 'رمز التحقق Verify Token')}
                type="button"
                className="absolute left-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                نسخ
              </button>
            </div>
          </div>

          {/* Subscribed Events Checkboxes */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
              الأحداث المسجلة والمفعلة (Subscribed Events):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['messages', 'message_reads', 'quality_updates', 'interactive_flow'].map((ev) => (
                <div
                  key={ev}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-[#1F293D] flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#128C7E] shrink-0" />
                  <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    {ev}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-[#1F293D]">
        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>تتم معالجة كل رسالة خلال أقل من 120ms عبر خط أنابيب الذكاء الاصطناعي</span>
        </span>
      </div>
    </div>
  );
};
