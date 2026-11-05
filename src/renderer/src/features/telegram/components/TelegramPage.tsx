import React from 'react';
import { Send, Bot, Zap, ShieldCheck, HelpCircle } from 'lucide-react';
import { TelegramBotCard } from './TelegramBotCard';
import { TelegramStatusBadge } from './TelegramStatusBadge';
import { useTelegramBot } from '../hooks/useTelegramBot';

export const TelegramPage: React.FC = () => {
  const { status, autoReply } = useTelegramBot();
  const isOnline = status.isConnected && status.isPolling;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1F293D]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0088cc] to-[#38bdf8] text-white flex items-center justify-center shadow-lg shadow-[#0088cc]/25 shrink-0">
            <Send className="w-6 h-6 -rotate-45 ml-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">بوابة بوت تليغرام (Telegram Gateway)</h1>
              <TelegramStatusBadge status={status} size="md" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ربط مباشر مع Telegram Bot API لاستقبال رسائل العملاء، والرد الذكي الآلي وتوليد الطلبات
            </p>
          </div>
        </div>
      </div>

      {/* Overview Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0088cc] flex items-center justify-center shrink-0">
            <Send className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">حالة الاتصال</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
              {isOnline ? 'متصل ونشط بالاستقصاء' : 'غير متصل حالياً'}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block font-medium">معرف البوت التفاعلي</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate block dir-ltr" dir="ltr">
              {status.botInfo?.username ? `@${status.botInfo.username}` : 'لم يحدد بعد'}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">الرد الآلي الذكي</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
              {autoReply ? 'مفعل عبر وكيل المتجر' : 'معطل (إشراف بشري)'}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">وضع الاستقبال</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Long Polling (بدون خادم)</span>
          </div>
        </div>
      </div>

      {/* Main Telegram Card */}
      <TelegramBotCard />

      {/* Fast Help & BotFather Card */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-[#1F293D] flex items-start gap-3 text-xs">
        <HelpCircle className="w-4 h-4 text-[#0088cc] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 dark:text-slate-200">كيف تبدأ إعداد البوت في 3 خطوات بسيطة؟</h4>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            1. افتح تطبيق تليغرام وابحث عن <strong>@BotFather</strong> ثم أرسل الأمر <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[11px]">/newbot</code>.
            <br />
            2. اختر اسماً للبوت ومعرفاً ينتهي بـ <code>bot</code>، وانسخ رمز التوكن (Token).
            <br />
            3. الصق التوكن أعلاه واضغط على <strong>فحص التوكن</strong> ثم فعّل البوت؛ سيتم استلام الرسائل تلقائياً في صندوق الوارد.
          </p>
        </div>
      </div>
    </div>
  );
};
