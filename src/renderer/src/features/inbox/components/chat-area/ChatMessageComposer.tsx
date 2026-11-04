import React from 'react';
import { Paperclip, Send } from 'lucide-react';

interface ChatMessageComposerProps {
  inputMsg: string;
  onInputMsgChange: (text: string) => void;
  onSendMessage: (e?: React.FormEvent) => void;
  isHumanControl: boolean;
}

export const ChatMessageComposer: React.FC<ChatMessageComposerProps> = ({
  inputMsg,
  onInputMsgChange,
  onSendMessage,
  isHumanControl,
}) => {
  return (
    <form
      onSubmit={onSendMessage}
      className="p-3 bg-white dark:bg-[#111827] border-t border-slate-100 dark:border-[#1F293D] flex items-center gap-2 shrink-0"
    >
      <button
        type="button"
        title="إرفاق ملف أو صورة"
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
  );
};

