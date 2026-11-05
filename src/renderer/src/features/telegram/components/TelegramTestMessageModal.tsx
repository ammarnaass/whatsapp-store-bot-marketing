import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface TelegramTestMessageModalProps {
  isOpen: boolean;
  botUsername?: string;
  onClose: () => void;
  onSend: (options: { chatId: string; text: string }) => Promise<{ success: boolean; error?: string }>;
}

export const TelegramTestMessageModal: React.FC<TelegramTestMessageModalProps> = ({
  isOpen, botUsername, onClose, onSend,
}) => {
  const [chatId, setChatId] = useState('');
  const [text, setText] = useState('مرحباً بك! هذه رسالة تجريبية من منصة وصّل عبر بوت تليغرام 🚀');
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId.trim() || !text.trim()) return;
    setIsSending(true);
    setStatusMsg(null);
    try {
      const res = await onSend({ chatId: chatId.trim(), text: text.trim() });
      if (res.success) {
        setStatusMsg({ type: 'ok', text: 'تم إرسال الرسالة بنجاح إلى حساب تليغرام!' });
      } else {
        setStatusMsg({ type: 'err', text: res.error || 'تعذر الإرسال. تأكد من إرسال /start للبوت أولاً.' });
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-xs">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#0088cc]">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">إرسال رسالة تجريبية عبر تليغرام</h3>
              {botUsername && <p className="text-[11px] text-slate-400">@{botUsername}</p>}
            </div>
          </div>
          <button onClick={onClose} type="button" className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSend} className="p-4 space-y-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">معرّف المحادثة (Chat ID) *</label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="مثال: 123456789 (معرف حسابك الشخصي أو مجموعتك)"
              className="w-full h-8 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0088cc]"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              ملاحظة: يجب على المستخدم أن يضغط على زر <b>/start</b> داخل البوت أولاً ليسمح تليغرام باستلام الرسائل.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">نص الرسالة</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0088cc]"
            />
          </div>

          {statusMsg && (
            <div className={`p-2.5 rounded-xl flex items-center gap-2 ${statusMsg.type === 'ok' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'}`}>
              {statusMsg.type === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="h-8 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100">إلغاء</button>
            <button type="submit" disabled={isSending} className="h-8 px-5 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 disabled:opacity-50">
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

