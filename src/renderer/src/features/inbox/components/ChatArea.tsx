import React from 'react';
import {
  MessageSquare,
  Bot,
  UserCheck,
  Sparkles,
  CheckCheck,
  CreditCard,
  Paperclip,
  Send,
  Package
} from 'lucide-react';
import { ChatItem, ChatMessage } from '../types/inbox.types';

interface ChatAreaProps {
  chat: ChatItem | null;
  messages: ChatMessage[];
  isHumanControl: boolean;
  onToggleHumanControl: () => void;
  inputMsg: string;
  onInputMsgChange: (text: string) => void;
  onSendMessage: (e?: React.FormEvent) => void;
  onSendPaymentLink: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  chat,
  messages,
  isHumanControl,
  onToggleHumanControl,
  inputMsg,
  onInputMsgChange,
  onSendMessage,
  onSendPaymentLink
}) => {
  if (!chat) {
    return (
      <section className="col-span-12 lg:col-span-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-sm flex flex-col items-center justify-center p-8 text-center text-slate-400">
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
    <section className="col-span-12 lg:col-span-5 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 flex flex-col overflow-hidden relative h-full">
      {/* Conversation Header Bar */}
      <div className="px-5 py-3 border-b border-slate-100 dark:border-[#1F293D] flex items-center justify-between shrink-0 bg-white dark:bg-[#111827] z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">{chat.name}</h3>
              <span className="text-[11px] font-mono tabular-nums text-[#075E54] dark:text-emerald-300 font-bold bg-[#E7F6F2] dark:bg-[#128C7E]/20 px-2 py-0.5 rounded-full dir-ltr">
                {chat.phone}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>متصل الآن</span>
              <span>·</span>
              <span className="text-[#7C3AED] font-bold">
                {isHumanControl ? 'أنت تستلم الحوار كإنسان' : 'الذكاء الاصطناعي يقود الحوار'}
              </span>
            </div>
          </div>
        </div>

        {/* Mode Toggle Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleHumanControl}
            type="button"
            className={`h-[38px] px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer elevation-1 ${
              isHumanControl
                ? 'bg-[#7C3AED] text-white hover:bg-violet-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isHumanControl ? (
              <Bot className="w-4 h-4" />
            ) : (
              <UserCheck className="w-4 h-4 text-[#128C7E]" />
            )}
            <span>{isHumanControl ? 'إعادة للذكاء الاصطناعي' : 'استلام يدوي'}</span>
          </button>
        </div>
      </div>

      {/* Live Chat Thread Feed */}
      <div className="flex-1 p-5 overflow-y-auto bg-[#EFEAE2]/30 dark:bg-[#0A0E17] space-y-4">
        <div className="flex justify-center my-2">
          <span className="px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800 text-[11px] text-slate-500 font-bold">
            اليوم، 04:12 مساءً
          </span>
        </div>

        {messages.map((m) => {
          const isCustomer = m.sender === 'customer';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${
                isCustomer ? 'items-start max-w-[85%]' : 'items-end max-w-[88%] mr-auto'
              }`}
            >
              {!isCustomer && (
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-bold text-[#7C3AED]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {m.sender === 'ai'
                      ? `رد ذكي من WaSell AI (${m.latency || '1.2 ثانية'})`
                      : 'رد يدوي من موظف المتجر'}
                  </span>
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-right text-xs leading-relaxed elevation-1 ${
                  isCustomer
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tr-none border border-slate-100 dark:border-slate-700'
                    : 'bg-[#E7F6F2] dark:bg-[#064E3B]/40 text-[#064E3B] dark:text-emerald-100 rounded-tl-none border border-emerald-200/50 dark:border-emerald-800/50'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>

                {m.hasProduct && (
                  <div className="mt-2.5 p-2 bg-white/80 dark:bg-slate-900/80 rounded-xl flex items-center gap-2.5 border border-slate-200/60 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-[#128C7E]/20 flex items-center justify-center text-[#128C7E] shrink-0">
                      <Package className="w-5 h-5 text-[#128C7E]" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                        باقة عطور العود الملكي (قطعتين + مخلط)
                      </span>
                      <span className="text-[11px] text-[#128C7E] font-bold font-mono tabular-nums">
                        476 ر.س{' '}
                        <span className="text-[11px] line-through text-slate-400">560 ر.س</span>
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-slate-400 font-mono tabular-nums">
                  <span>{m.time}</span>
                  {!isCustomer && <CheckCheck className="w-3.5 h-3.5 text-[#128C7E]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Suggestion Chips Bar */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-[#1F293D] flex items-center gap-2 overflow-x-auto text-[11px] font-bold shrink-0">
        <span className="text-slate-400 whitespace-nowrap">إجراءات سريعة:</span>
        <button
          onClick={onSendPaymentLink}
          type="button"
          className="h-[30px] px-3 rounded-lg bg-[#128C7E] hover:bg-[#075E54] text-white whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer elevation-1"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span className="font-mono tabular-nums">أرسل رابط الدفع (476 ر.س)</span>
        </button>
        <button
          onClick={() =>
            onInputMsgChange('يسعدنا تطبيق كود خصم 10% إضافي لتأكيد طلبك اليوم!')
          }
          type="button"
          className="h-[30px] px-2.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer transition-colors"
        >
          كود خصم 10%
        </button>
        <button
          onClick={() =>
            onInputMsgChange(
              'التوصيل للرياض فوري خلال 3-5 ساعات وسعره 25 ريال ومجاني للطلب الحالي!'
            )
          }
          type="button"
          className="h-[30px] px-2.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer transition-colors"
        >
          عرض سياسة الشحن
        </button>
      </div>

      {/* Chat Message Input Bar */}
      <form
        onSubmit={onSendMessage}
        className="p-3 bg-white dark:bg-[#111827] border-t border-slate-100 dark:border-[#1F293D] flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer transition-colors"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => onInputMsgChange(e.target.value)}
          placeholder={
            isHumanControl
              ? 'اكتب رداً يدوياً للعميل كإنسان...'
              : 'الوكيل يرد آلياً، يمكنك كتابة رسالة هنا للاستلام...'
          }
          className="flex-1 h-[42px] px-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-[#128C7E] transition-all"
        />
        <button
          type="submit"
          disabled={!inputMsg.trim()}
          className="w-[42px] h-[42px] rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white flex items-center justify-center transition-all active:scale-95 elevation-1 disabled:opacity-40 cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </section>
  );
};
