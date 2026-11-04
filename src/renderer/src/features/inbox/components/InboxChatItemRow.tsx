import React from 'react';
import { CheckCheck, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';
import { ChatItem } from '../types/inbox.types';

interface InboxChatItemRowProps {
  chat: ChatItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const InboxChatItemRow: React.FC<InboxChatItemRowProps> = ({
  chat,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(chat.id)}
      className={`p-3.5 cursor-pointer transition-all relative ${
        isSelected
          ? 'bg-emerald-50/50 dark:bg-[#128C7E]/20 border-r-4 border-[#128C7E]'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* الصورة الرمزية ومؤشرات النشاط */}
        <div className="relative shrink-0">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
          />
          {chat.isAi ? (
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

        {/* تفاصيل المحادثة والرسالة */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                {chat.name}
              </h4>
              {chat.isVip && (
                <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#E7F6F2] text-[#075E54] dark:bg-[#128C7E]/20 dark:text-emerald-300">
                  VIP
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-mono tabular-nums whitespace-nowrap">{chat.time}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            <CheckCheck className="w-3.5 h-3.5 text-[#128C7E] shrink-0" />
            <p className="truncate">{chat.lastMessage}</p>
          </div>

          {/* شارات السياق والوسوم */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {chat.isAi && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] text-[11px] font-bold">
                <Sparkles className="w-3 h-3" />
                {chat.tag || 'الوكيل يتفاوض'}
              </span>
            )}
            {chat.needsHuman && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-[11px] font-bold">
                <AlertCircle className="w-3 h-3" />
                {chat.tag || 'تدخل بشري عاجل'}
              </span>
            )}
            {chat.cartValue && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] text-[11px] font-bold">
                <ShoppingBag className="w-3 h-3" />
                <span className="font-mono tabular-nums">سلة {chat.cartValue} ر.س</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

