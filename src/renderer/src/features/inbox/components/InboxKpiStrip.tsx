import React from 'react';
import { MessageSquare, Bot, AlertCircle, ShoppingBag, TrendingUp } from 'lucide-react';
import { ChatItem } from '../types/inbox.types';

interface InboxKpiStripProps {
  chats: ChatItem[];
}

export const InboxKpiStrip: React.FC<InboxKpiStripProps> = ({ chats }) => {
  const totalChats = chats.length;
  const aiChats = chats.filter((c) => c.isAi && !c.needsHuman).length;
  const humanChats = chats.filter((c) => c.needsHuman).length;
  const aiRate = totalChats > 0 ? Math.round((aiChats / totalChats) * 100) : 0;
  const cartChats = chats.filter((c) => (c.cartValue || 0) > 0).length;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat 1: Total Active Chats */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4.5 border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            إجمالي المحادثات المتصلة
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
              {totalChats}
            </span>
            <span className="text-[11px] font-bold text-[#128C7E] bg-emerald-50 dark:bg-[#128C7E]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              واتساب متزامن
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
            إدارة الذكاء الاصطناعي (AI)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono tabular-nums text-[#7C3AED]">
              {aiRate}%
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {aiChats} محادثة مستقلة
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
            تتطلب تدخلاً بشرياً
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono tabular-nums text-rose-600 dark:text-rose-400">
              {humanChats}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${humanChats > 0 ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 animate-pulse border-rose-200 dark:border-rose-900/50' : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
              {humanChats > 0 ? 'استجابة مطلوبة' : 'لا يوجد تأخير'}
            </span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
          <AlertCircle className="w-5 h-5" />
        </div>
      </div>

      {/* Stat 4: Automated Closed Sales / Cart Opportunities */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4.5 border border-slate-200 dark:border-[#1F293D] elevation-1 wasell-card-hover flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            فرص الشراء والسلات
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono tabular-nums text-[#128C7E]">
              {cartChats}
            </span>
            <span className="text-[11px] font-bold text-[#075E54] dark:text-emerald-300 bg-[#E7F6F2] dark:bg-[#075E54]/30 px-2 py-0.5 rounded-full">
              سلات نشطة
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
