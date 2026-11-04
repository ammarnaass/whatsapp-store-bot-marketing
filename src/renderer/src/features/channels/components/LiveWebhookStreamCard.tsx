import React from 'react';
import { Network, RefreshCw, MessageSquare, Sparkles, CheckCircle2, Server } from 'lucide-react';
import { WebhookLog } from '../types/channels.types';
import { EmptyState } from '../../data-management';

interface LiveWebhookStreamCardProps {
  logs: WebhookLog[];
  onRefresh: () => void;
}

export const LiveWebhookStreamCard: React.FC<LiveWebhookStreamCardProps> = ({
  logs,
  onRefresh
}) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            شريط تدفق خطافات الويب المباشر (Live Webhook Event Stream)
          </h3>
          <span className="text-xs text-slate-400 hidden sm:inline">
            آخر {logs.length} استدعاءات من Meta API
          </span>
        </div>

        <button
          onClick={onRefresh}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#128C7E]" />
          <span>تحديث السجل</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs font-bold">
              <th className="py-2.5 px-4 rounded-r-xl">الحالة (Status)</th>
              <th className="py-2.5 px-4">نوع الحدث (Event Payload)</th>
              <th className="py-2.5 px-4">معرّف المرسل (Origin WID)</th>
              <th className="py-2.5 px-4">زمن الاستجابة (Latency)</th>
              <th className="py-2.5 px-4 rounded-l-xl">التوقيت اللحظي</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8">
                  <EmptyState
                    icon={<Network className="w-8 h-8 text-amber-500" />}
                    title="سجل الويب هوك فارغ حالياً"
                    description="لم يتم تسجيل أي أحداث ويب هوك بعد. ستظهر السجلات هنا لحظياً فور استلامها أو يمكنك تعبئة بيانات تجريبية."
                    sectionKey="channels"
                  />
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-[#128C7E]/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-sans">
                    <div className="flex items-center gap-2">
                      {log.iconType === 'chat' && (
                        <MessageSquare className="w-4 h-4 text-[#128C7E]" />
                      )}
                      {log.iconType === 'button' && (
                        <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                      )}
                      {log.iconType === 'delivered' && (
                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                      )}
                      {log.iconType === 'system' && (
                        <Server className="w-4 h-4 text-blue-500" />
                      )}
                      <span className="font-bold">{log.event}</span>
                    </div>
                  </td>
                  <td
                    className="py-3 px-4 text-slate-500 dark:text-slate-400 font-bold"
                    dir="ltr"
                  >
                    {log.origin}
                  </td>
                  <td className="py-3 px-4 text-[#128C7E] font-bold">{log.latency}</td>
                  <td className="py-3 px-4 text-slate-400 font-sans">{log.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
