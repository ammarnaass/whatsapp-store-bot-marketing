import React, { useState } from 'react';
import { Send, Bot, UserCheck, ShieldAlert, CheckCheck, Paperclip } from 'lucide-react';
import { Conversation, Message } from '../../../../shared/types';

interface ChatThreadProps {
  conversation?: Conversation;
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
  onTakeover: () => Promise<void>;
  onReturnToAgent: () => Promise<void>;
}

export const ChatThread: React.FC<ChatThreadProps> = ({
  conversation,
  messages,
  onSendMessage,
  onTakeover,
  onReturnToAgent,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    setIsSending(true);
    try {
      await onSendMessage(inputText);
      setInputText('');
    } finally {
      setIsSending(false);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 wasell-card flex items-center justify-center text-slate-400 text-xs">
        اختر محادثة لعرض التفاصيل
      </div>
    );
  }

  const isAgent = conversation.handler === 'agent';

  return (
    <div className="flex-1 flex flex-col wasell-card overflow-hidden">
      {/* شريط رأس المحادثة */}
      <div className="p-3.5 border-b border-slate-100 dark:border-[#1F293D] flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span>{conversation.contact?.name || conversation.contact?.phone}</span>
            <span className="text-[10px] text-slate-400 font-mono">({conversation.contact?.phone})</span>
          </h3>
          <span className="text-[11px] text-slate-400">آخر ظهور: متصل الآن عبر واتساب</span>
        </div>

        {/* زر التبديل بين الوكيل والإنسان */}
        <div>
          {isAgent ? (
            <button
              onClick={onTakeover}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              استلام المحادثة كإنسان
            </button>
          ) : (
            <button
              onClick={onReturnToAgent}
              className="bg-[#7C3AED] hover:bg-violet-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              إعادة المحادثة للوكيل الذكي
            </button>
          )}
        </div>
      </div>

      {/* فقاعات الرسائل */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F6F7F9]/40 dark:bg-[#090D16]/40">
        {messages.map((m) => {
          const isInbound = m.direction === 'inbound';
          const isAi = m.sender_type === 'agent';

          return (
            <div key={m.id} className={`flex ${isInbound ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-md p-3 text-xs leading-relaxed shadow-sm ${
                  isInbound
                    ? 'bubble-inbound'
                    : isAi
                    ? 'bubble-outbound-agent'
                    : 'bubble-outbound-human'
                }`}
              >
                {!isInbound && (
                  <div className="flex items-center gap-1 text-[10px] font-bold mb-1 opacity-80">
                    {isAi ? (
                      <span className="flex items-center gap-1 text-[#128C7E] dark:text-emerald-300">
                        <Bot className="w-3 h-3" /> تم الإرسال بواسطة الوكيل (AI)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-blue-700 dark:text-blue-200">
                        <UserCheck className="w-3 h-3" /> تم الإرسال بواسطة موظف
                      </span>
                    )}
                  </div>
                )}
                <p className="whitespace-pre-wrap">{m.body}</p>
                <div className="flex items-center justify-end gap-1 text-[9px] opacity-60 mt-1 font-mono">
                  <span>{new Date(m.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                  {!isInbound && <CheckCheck className="w-3 h-3 text-[#128C7E]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* صندوق الإدخال والإرسال */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-[#1F293D] flex items-center gap-2 bg-white dark:bg-slate-900">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isAgent ? 'اكتب رداً وسيتوقف الوكيل مؤقتاً...' : 'اكتب ردك للعميل مباشرة...'}
          className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E]"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="bg-[#128C7E] hover:bg-[#075E54] text-white p-2 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
