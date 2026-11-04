import React, { useState } from 'react';
import { Bot, CheckCircle, RotateCcw, Sparkles, Send, Package, CreditCard } from 'lucide-react';
import { SimMessage } from '../types/agent.types';

interface AgentSimulatorProps {
  messages: SimMessage[];
  isLoading: boolean;
  onSendMessage: (text?: string) => void;
  onResetChat: () => void;
}

export const AgentSimulator: React.FC<AgentSimulatorProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onResetChat
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="xl:col-span-5 sticky top-24">
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-2 overflow-hidden flex flex-col h-[700px]">
        {/* Simulator Top Bar (WhatsApp Style Header) */}
        <div className="bg-[#128C7E] px-4 py-3 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#128C7E]"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold">WaSell Agent • محاكي تجريبي</span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <span className="text-[11px] text-emerald-100 font-mono tabular-nums">سرعة الاستجابة الحية: 1.1s</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onResetChat}
              type="button"
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
              title="إعادة بدء المحادثة"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white font-bold">
              تجربة حية
            </span>
          </div>
        </div>

        {/* Chat History Stream (WhatsApp Wallpaper look) */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#EFEAE2]/30 dark:bg-[#0A0E17] flex flex-col justify-start">
          {/* System Notice */}
          <div className="text-center my-1">
            <span className="px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800 text-[11px] text-slate-500 font-bold">
              اليوم • بدأت جلسة الاختبار التجريبية
            </span>
          </div>

          {/* Message List */}
          {messages.map((msg) => {
            const isCustomer = msg.role === 'customer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isCustomer ? 'items-start max-w-[85%]' : 'items-end max-w-[88%] mr-auto'
                }`}
              >
                {!isCustomer && (
                  <div className="flex items-center justify-between mb-1 px-1 w-full text-[11px] font-bold text-[#7C3AED]">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#7C3AED]" />
                      رد آلي بواسطة Gemini Flash
                    </span>
                    <span className="text-slate-400 font-mono tabular-nums text-[10px]">
                      {msg.latency || '1.1s'}
                    </span>
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl elevation-1 text-right text-xs leading-relaxed ${
                    isCustomer
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tr-none border border-slate-100 dark:border-slate-700'
                      : 'bg-[#E7F6F2] dark:bg-[#064E3B]/40 text-[#064E3B] dark:text-emerald-100 rounded-tl-none border border-emerald-200/50 dark:border-emerald-800/50'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Micro Product Card in Chat if applicable */}
                  {msg.hasProduct && (
                    <div className="mt-2.5 p-2 bg-white/80 dark:bg-slate-900/80 rounded-xl flex items-center gap-2.5 border border-slate-200/60 dark:border-slate-700">
                      <div className="w-11 h-11 rounded-lg bg-emerald-50 dark:bg-[#128C7E]/20 flex items-center justify-center text-[#128C7E] shrink-0 font-bold">
                        <Package className="w-5 h-5 text-[#128C7E]" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                          عطر لافندر الملكي الفاخر (100 مل)
                        </span>
                        <span className="text-[11px] text-[#128C7E] font-bold font-mono tabular-nums">
                          285 ر.س{' '}
                          <span className="text-[11px] line-through text-slate-400">340 ر.س</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action buttons inside chat */}
                  {msg.hasProduct && (
                    <div className="mt-2 pt-2 flex flex-wrap gap-1.5 justify-start border-t border-emerald-200/40">
                      <button
                        onClick={() => onSendMessage('اعتمدت الطلب وأبي رابط الدفع')}
                        type="button"
                        className="h-[28px] px-3 rounded-full bg-[#128C7E] text-white text-[11px] font-bold hover:bg-[#075E54] transition-colors cursor-pointer flex items-center gap-1 elevation-1"
                      >
                        <CreditCard className="w-3 h-3" />
                        <span>اعتمد الطلب الحين</span>
                      </button>
                      <button
                        onClick={() => onSendMessage('وش مكونات العطر؟')}
                        type="button"
                        className="h-[28px] px-3 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        وش مكونات العطر؟
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-slate-400 font-mono tabular-nums">
                    <span>{msg.time}</span>
                    {!isCustomer && <span className="text-[#128C7E] font-bold">✓✓</span>}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="self-end max-w-[85%] bg-[#E7F6F2] dark:bg-[#064E3B]/40 p-3 rounded-2xl rounded-tl-none border border-emerald-200/50 text-right animate-pulse elevation-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#075E54] dark:text-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] animate-spin" />
                <span>الوكيل الذكي يكتب رداً مخصصاً طبقاً لسياسة المتجر...</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Simulator Input */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-white dark:bg-[#111827] border-t border-slate-100 dark:border-[#1F293D] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالاً تجريبياً لاختبار ذكاء الوكيل..."
            className="flex-1 h-[42px] px-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-[#128C7E] transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-[42px] h-[42px] rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white flex items-center justify-center transition-all active:scale-95 elevation-1 disabled:opacity-40 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Simulator Quick Prompt Suggestions */}
        <div className="px-3 pb-3 bg-white dark:bg-[#111827] flex items-center gap-1.5 overflow-x-auto text-[11px] font-medium">
          <span className="text-slate-400 whitespace-nowrap font-bold">جرّب بسرعة:</span>
          <button
            onClick={() => onSendMessage('أبي كود خصم إضافي')}
            type="button"
            className="h-[28px] px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
          >
            "أبي كود خصم إضافي"
          </button>
          <button
            onClick={() => onSendMessage('حولني للمدير فوراً أنا غاضب')}
            type="button"
            className="h-[28px] px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
          >
            "حولني للمدير فوراً أنا غاضب"
          </button>
          <button
            onClick={() => onSendMessage('كم ياخذ الشحن لجدة؟')}
            type="button"
            className="h-[28px] px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
          >
            "كم ياخذ الشحن لجدة؟"
          </button>
        </div>
      </div>
    </div>
  );
};
