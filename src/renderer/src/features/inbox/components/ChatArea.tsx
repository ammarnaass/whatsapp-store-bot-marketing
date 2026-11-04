import React from 'react';
import { MessageSquare } from 'lucide-react';
import { ChatItem, ChatMessage } from '../types/inbox.types';
import {
  ChatAreaHeader,
  ChatMessageList,
  ChatQuickActions,
  ChatMessageComposer,
} from './chat-area';

interface ChatAreaProps {
  chat: ChatItem | null;
  messages: ChatMessage[];
  isHumanControl: boolean;
  onToggleHumanControl: () => void;
  inputMsg: string;
  onInputMsgChange: (text: string) => void;
  onSendMessage: (e?: React.FormEvent) => void;
  onSendPaymentLink: () => void;
  isCustomerSidebarOpen?: boolean;
  onToggleCustomerSidebar?: () => void;
  onBack?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  chat,
  messages,
  isHumanControl,
  onToggleHumanControl,
  inputMsg,
  onInputMsgChange,
  onSendMessage,
  onSendPaymentLink,
  isCustomerSidebarOpen = true,
  onToggleCustomerSidebar,
  onBack,
}) => {
  if (!chat) {
    return (
      <section className="w-full h-full bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-sm flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <MessageSquare className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" />
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
          لا توجد محادثة محددة
        </h4>
        <p className="text-xs text-slate-400 max-w-xs">
          اختر محادثة من القائمة الجانبية أو انتظر رسائل العملاء الجديدة عبر واتساب.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full h-full bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 flex flex-col overflow-hidden relative">
      {/* 1. شريط رأس المحادثة وزر تفاصيل العميل والتحكم البشري */}
      <ChatAreaHeader
        chat={chat}
        isHumanControl={isHumanControl}
        onToggleHumanControl={onToggleHumanControl}
        isCustomerSidebarOpen={isCustomerSidebarOpen}
        onToggleCustomerSidebar={onToggleCustomerSidebar}
        onBack={onBack}
      />

      {/* 2. شريط الرسائل التفاعلي المباشر */}
      <ChatMessageList messages={messages} />

      {/* 3. شريط الاقتراحات والإجراءات السريعة ورابط الدفع */}
      <ChatQuickActions
        onSendPaymentLink={onSendPaymentLink}
        onSetInputMsg={onInputMsgChange}
      />

      {/* 4. حقل كتابة الرسائل والإرسال */}
      <ChatMessageComposer
        inputMsg={inputMsg}
        onInputMsgChange={onInputMsgChange}
        onSendMessage={onSendMessage}
        isHumanControl={isHumanControl}
      />
    </section>
  );
};
