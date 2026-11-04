import React from 'react';
import { History, CheckCircle2, MessageSquare, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface AlertLogItem {
  id: string;
  title: string;
  channel: string;
  time: string;
  status: 'sent' | 'pending' | 'failed';
}

const RECENT_LOGS: AlertLogItem[] = [
  { id: '1', title: 'طلب VIP جديد بقيمة 1,450 ر.س', channel: 'WhatsApp', time: 'منذ 14 دقيقة', status: 'sent' },
  { id: '2', title: 'تحويل محادثة عميل للتدخل البشري (#9421)', channel: 'WhatsApp + Desktop', time: 'منذ 48 دقيقة', status: 'sent' },
  { id: '3', title: 'تنبيه تدني مخزون (عطر لافندر - 3 قطع)', channel: 'Desktop', time: 'منذ ساعتين', status: 'sent' },
  { id: '4', title: 'ملخص الصباح التنفيذي اليومي', channel: 'WhatsApp + Email', time: 'اليوم، 09:00 ص', status: 'sent' },
];

export const AlertsRecentLogCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">سجل التنبيهات الأخيرة وحالة الإرسال</h3>
            <p className="text-[11px] text-slate-400">تدقيق حي للإشعارات الموجهة لإدارة المتجر</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>الخدمة متصلة</span>
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-[#1F293D]">
        {RECENT_LOGS.map((log) => (
          <div key={log.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{log.title}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>{log.channel}</span>
                  <span>•</span>
                  <span>{log.time}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تم الإرسال</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

