import React from 'react';
import { Sparkles, CheckCheck, Package } from 'lucide-react';
import { ChatMessage } from '../../types/inbox.types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isCustomer = message.sender === 'customer';

  return (
    <div
      className={`flex flex-col ${
        isCustomer ? 'items-start max-w-[85%]' : 'items-end max-w-[88%] mr-auto'
      }`}
    >
      {!isCustomer && (
        <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-bold text-[#7C3AED]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {message.sender === 'ai'
              ? `رد ذكي من WaSell AI (${message.latency || '1.2 ثانية'})`
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
        <p className="whitespace-pre-wrap">{message.text}</p>

        {message.hasProduct && (
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
          <span>{message.time}</span>
          {!isCustomer && <CheckCheck className="w-3.5 h-3.5 text-[#128C7E]" />}
        </div>
      </div>
    </div>
  );
};

