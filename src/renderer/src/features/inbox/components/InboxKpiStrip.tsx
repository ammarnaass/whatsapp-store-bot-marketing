import React from 'react';
import { MessageSquare, Bot, AlertCircle, ShoppingBag, TrendingUp } from 'lucide-react';
import { ChatItem } from '../types/inbox.types';

interface InboxKpiStripProps {
  chats: ChatItem[];
}

export const InboxKpiStrip: React.FC<InboxKpiStripProps> = ({ chats }) => {
  const hasChats = chats.length > 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat 1: Total Active Chats */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4.5 border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            إجمالي المحادثات النشطة
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
              {hasChats ? 142 : 0}
            </span>
            <span className="text-[11px] font-bold text-[#128C7E] bg-emerald-50 dark:bg-[#128C7E]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14% اليوم
            </span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center">
          <MessageSquare className="w-5 h-5" />
        </div>
      </div>

      {/* Stat 2: AI Autonomy Ratio */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4.5 border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            إدارة الذكاء الاصطناعي الكاملة
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono tabular-nums text-[#7C3AED]">
              {hasChats ? '87.3%' : '0%'}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {hasChats ? '124 محادثة مستقلة' : '0 محادثة'}
            </span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </div>
      </div>

      {/* Stat 3: Urgent Intervention Required */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4.5 border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
            تتطلب تدخلاً بشرياً عاجلاً
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono tabular-nums text-rose-600 dark:text-rose-400">
              {hasChats ? 4 : 0}
            </span>
            <span className="text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 px-2 py-0.5 rounded-full animate-pulse border border-rose-200 dark:border-rose-900/50">
              استجابة مطلوبة الآن
            </span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
          <AlertCircle className="w-5 h-5" />
        </div>
      </div>

      {/* Stat 4: Automated Closed Sales */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4.5 border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            مبيعات مغلقة آلياً (اليوم)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono tabular-nums text-[#128C7E]">
              {hasChats ? '18,450' : 0}{' '}
              <span className="text-xs font-normal text-slate-400">ر.س</span>
            </span>
            <span className="text-[11px] font-bold text-[#075E54] dark:text-emerald-300 bg-[#E7F6F2] dark:bg-[#075E54]/30 px-2 py-0.5 rounded-full">
              {hasChats ? '38 طلب ناجح' : '0 طلب'}
            </span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-xl bg-[#E7F6F2] dark:bg-[#075E54]/40 text-[#075E54] dark:text-emerald-300 flex items-center justify-center">
          <ShoppingBag className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
};
