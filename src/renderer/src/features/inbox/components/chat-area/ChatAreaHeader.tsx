import React from 'react';
import { Bot, UserCheck, User, ArrowRight } from 'lucide-react';
import { ChatItem } from '../../types/inbox.types';

interface ChatAreaHeaderProps {
  chat: ChatItem;
  isHumanControl: boolean;
  onToggleHumanControl: () => void;
  isCustomerSidebarOpen?: boolean;
  onToggleCustomerSidebar?: () => void;
  onBack?: () => void;
}

export const ChatAreaHeader: React.FC<ChatAreaHeaderProps> = ({
  chat,
  isHumanControl,
  onToggleHumanControl,
  isCustomerSidebarOpen = true,
  onToggleCustomerSidebar,
  onBack,
}) => {
  const initial = chat.name ? chat.name.slice(0, 1) : 'U';

  return (
    <div className="px-3 sm:px-5 py-3 border-b border-slate-100 dark:border-[#1F293D] flex items-center justify-between shrink-0 bg-white dark:bg-[#111827] z-10">
      {/* Contact Profile Summary */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 -mr-1 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition shrink-0"
            title="العودة لقائمة المحادثات"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        <div className="relative shrink-0">
          {chat.avatar ? (
            <img
              src={chat.avatar}
              alt={chat.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
            />
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center font-bold text-sm ring-2 ring-slate-100 dark:ring-slate-800">
              {initial}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate">{chat.name}</h3>
            <span className="text-[10px] sm:text-[11px] font-mono tabular-nums text-[#075E54] dark:text-emerald-300 font-bold bg-[#E7F6F2] dark:bg-[#128C7E]/20 px-2 py-0.5 rounded-full dir-ltr hidden xs:inline">
              +{chat.phone}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="hidden sm:inline">متصل الآن ·</span>
            <span className="text-[#7C3AED] font-bold truncate">
              {isHumanControl ? 'استلام إنساني' : 'الذكاء الاصطناعي'}
            </span>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {onToggleCustomerSidebar && (
          <button
            onClick={onToggleCustomerSidebar}
            type="button"
            title="إظهار / إخفاء بيانات العميل الحقيقية"
            className={`h-[34px] sm:h-[36px] px-2.5 sm:px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isCustomerSidebarOpen
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-[#128C7E] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#128C7E]" />
            <span className="hidden sm:inline">معلومات العميل</span>
          </button>
        )}

        <button
          onClick={onToggleHumanControl}
          type="button"
          className={`h-[34px] sm:h-[36px] px-2.5 sm:px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer elevation-1 ${
            isHumanControl
              ? 'bg-[#7C3AED] text-white hover:bg-violet-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {isHumanControl ? <Bot className="w-4 h-4" /> : <UserCheck className="w-4 h-4 text-[#128C7E]" />}
          <span className="hidden sm:inline">{isHumanControl ? 'إعادة للوكيل' : 'استلام يدوي'}</span>
        </button>
      </div>
    </div>
  );
};
