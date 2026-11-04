import React from 'react';
import { Search, Bot, MessageSquare, CheckCheck, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';
import { ChatItem, ChatFilterMode } from '../types/inbox.types';
import { EmptyState } from '../../data-management';

interface InboxSidebarProps {
  chats: ChatItem[];
  selectedChatId: string;
  onSelectChat: (id: string) => void;
  filterMode: ChatFilterMode;
  onFilterModeChange: (mode: ChatFilterMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const InboxSidebar: React.FC<InboxSidebarProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
  filterMode,
  onFilterModeChange,
  searchQuery,
  onSearchChange
}) => {
  return (
    <section className="col-span-12 lg:col-span-4 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 flex flex-col overflow-hidden h-full">
      {/* Search and Quick Filtering Header */}
      <div className="p-4 border-b border-slate-100 dark:border-[#1F293D] flex flex-col gap-3">
        <div className="relative w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث برقم الجوال، اسم العميل، أو المحادثة..."
            className="w-full h-[38px] pr-9 pl-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#128C7E] transition-all"
          />
        </div>

        {/* Filter Chips Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
          <button
            onClick={() => onFilterModeChange('all')}
            type="button"
            className={`h-8 px-3 rounded-xl whitespace-nowrap cursor-pointer transition-all flex items-center justify-center ${
              filterMode === 'all'
                ? 'bg-[#128C7E] text-white elevation-1'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            الكل ({chats.length})
          </button>
          <button
            onClick={() => onFilterModeChange('human')}
            type="button"
            className={`h-8 px-3 rounded-xl whitespace-nowrap cursor-pointer flex items-center gap-1.5 transition-all justify-center ${
              filterMode === 'human'
                ? 'bg-rose-600 text-white elevation-1'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            تدخل بشري
          </button>
          <button
            onClick={() => onFilterModeChange('ai')}
            type="button"
            className={`h-8 px-3 rounded-xl whitespace-nowrap cursor-pointer flex items-center gap-1.5 transition-all justify-center ${
              filterMode === 'ai'
                ? 'bg-[#7C3AED] text-white elevation-1'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-[#7C3AED]" />
            الذكاء الاصطناعي
          </button>
          <button
            onClick={() => onFilterModeChange('abandoned')}
            type="button"
            className={`h-8 px-3 rounded-xl whitespace-nowrap cursor-pointer transition-all flex items-center justify-center ${
              filterMode === 'abandoned'
                ? 'bg-[#128C7E] text-white elevation-1'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            سلات متروكة
          </button>
          <button
            onClick={() => onFilterModeChange('vip')}
            type="button"
            className={`h-8 px-3 rounded-xl whitespace-nowrap cursor-pointer transition-all flex items-center justify-center ${
              filterMode === 'vip'
                ? 'bg-[#128C7E] text-white elevation-1'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            VIP
          </button>
        </div>
      </div>

      {/* Chats Scrollable Queue */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {chats.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={<MessageSquare className="w-8 h-8 text-emerald-500" />}
              title="لا توجد محادثات نشطة"
              description="صندوق الوارد فارغ حالياً. ستظهر المحادثات الجديدة هنا فور ورودها من واتساب."
              sectionKey="chats"
            />
          </div>
        ) : (
          chats.map((c) => {
            const isSelected = c.id === selectedChatId;
            return (
              <div
                key={c.id}
                onClick={() => onSelectChat(c.id)}
                className={`p-3.5 cursor-pointer transition-all relative ${
                  isSelected
                    ? 'bg-emerald-50/50 dark:bg-[#128C7E]/20 border-r-4 border-[#128C7E]'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    {c.isAi ? (
                      <span
                        className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#128C7E] border-2 border-white dark:border-slate-900"
                        title="AI يدير المحادثة"
                      ></span>
                    ) : (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        !
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {c.name}
                        </h4>
                        {c.isVip && (
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#E7F6F2] text-[#075E54] dark:bg-[#128C7E]/20 dark:text-emerald-300">
                            VIP
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono tabular-nums whitespace-nowrap">{c.time}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                      <CheckCheck className="w-3.5 h-3.5 text-[#128C7E] shrink-0" />
                      <p className="truncate">{c.lastMessage}</p>
                    </div>

                    {/* Tags & Context Pill */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {c.isAi && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] text-[11px] font-bold">
                          <Sparkles className="w-3 h-3" />
                          {c.tag || 'الوكيل يتفاوض'}
                        </span>
                      )}
                      {c.needsHuman && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-[11px] font-bold">
                          <AlertCircle className="w-3 h-3" />
                          {c.tag || 'تدخل بشري عاجل'}
                        </span>
                      )}
                      {c.cartValue && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] text-[11px] font-bold">
                          <ShoppingBag className="w-3 h-3" />
                          <span className="font-mono tabular-nums">سلة {c.cartValue} ر.س</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
