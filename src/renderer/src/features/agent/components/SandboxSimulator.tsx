import React from 'react';
import { Send, Bot, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';
import { useAgentSandbox } from '../hooks/useAgentSandbox';

export const SandboxSimulator: React.FC = () => {
  const { messages, input, setInput, isLoading, sendMessage, clearMessages } = useAgentSandbox();

  const handleTestScenario = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 1. عمود المحادثة التجريبية (اليمين) */}
      <div className="lg:col-span-2 wasell-card flex flex-col h-[580px] overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 dark:border-[#1F293D] flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#7C3AED]" />
              <span>ساحة محاكاة واتساب (AI Sandbox)</span>
            </h3>
            <span className="text-[11px] text-slate-400">اختبر ردود الوكيل وأدواته كأنك عميل واتساب حقيقي</span>
          </div>

          <button
            onClick={clearMessages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-[#1F293D] text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            إعادة تعيين
          </button>
        </div>

        {/* فقاعات المحادثة */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F6F7F9]/40 dark:bg-[#090D16]/40">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div key={idx} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-md p-3 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? 'bubble-inbound'
                      : 'bubble-outbound-agent border-violet-500/30'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center gap-1 text-[10px] font-bold mb-1 text-[#7C3AED] dark:text-violet-300">
                      <Sparkles className="w-3 h-3" /> استجابة الوكيل الذكي
                      {m.latency && <span className="mr-auto font-mono text-[9px] opacity-70">({m.latency}ms)</span>}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {/* تفاصيل الأدوات المستدعاة في هذه الرسالة */}
                  {m.tools && m.tools.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-violet-200 dark:border-violet-900/60 space-y-1">
                      <span className="text-[11px] font-bold text-[#7C3AED] block">
                        الأدوات التي استدعاها النموذج:
                      </span>
                      {m.tools.map((t, tIdx) => (
                        <div key={tIdx} className="bg-white/60 dark:bg-slate-900/80 p-1.5 rounded-lg font-mono text-[11px] text-slate-800 dark:text-slate-200 flex items-center justify-between">
                          <span className="font-bold text-[#128C7E]">{t.tool}</span>
                          <span className="text-slate-400 text-[11px]">تم بنجاح ✓</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-end">
              <div className="p-3 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 border border-violet-200 dark:border-violet-800 text-xs text-[#7C3AED] flex items-center gap-2 animate-pulse">
                <Bot className="w-4 h-4 animate-spin" />
                الوكيل يفكر ويستدعي أدوات قاعدة البيانات...
              </div>
            </div>
          )}
        </div>

        {/* حقل الإدخال */}
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-3 border-t border-slate-100 dark:border-[#1F293D] flex items-center gap-2 bg-white dark:bg-slate-900">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالة تجريبية (مثل: هل يوجد اشتراك سنوي؟ أو أريد خصم 20%)..."
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#7C3AED]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-[#7C3AED] hover:bg-violet-700 text-white p-2 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 2. عمود سيناريوهات الاختبار السريعة وتتبع التفكير (اليسار) */}
      <div className="wasell-card p-4 space-y-4 flex flex-col justify-between">
        <div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#7C3AED]" />
            سيناريوهات اختبار موصى بها
          </h4>
          <p className="text-[11px] text-slate-400 mb-3">اضغط لتجربة سلوك الوكيل فوراً وفحص ردوده:</p>

          <div className="space-y-2">
            {[
              { title: 'طلب استفسار عن الكتالوج', prompt: 'ما هي المنتجات الرقمية والاشتراكات المتوفرة لديكم؟' },
              { title: 'اختبار درع الخصم (0%)', prompt: 'هل يمكنك تقديم خصم 15% لي على الاشتراك؟' },
              { title: 'طلب شراء فعلي (مسودة طلب)', prompt: 'أريد شراء اشتراك برو السنوي لوسمحت.' },
              { title: 'طلب التحدث مع ممثل بشري', prompt: 'أريد التحدث مع موظف خدمة العملاء من فضلكم.' },
            ].map((sc, sIdx) => (
              <button
                key={sIdx}
                onClick={() => handleTestScenario(sc.prompt)}
                className="w-full text-right p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-violet-50 dark:hover:bg-violet-950/30 border border-slate-100 dark:border-[#1F293D] hover:border-violet-300 dark:hover:border-violet-700 transition-all text-xs"
              >
                <div className="font-bold text-slate-800 dark:text-slate-200">{sc.title}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">"{sc.prompt}"</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#E7F6F2] dark:bg-[#075E54]/30 border border-emerald-200 dark:border-emerald-800/50 text-[11px] text-[#075E54] dark:text-emerald-300">
          <CheckCircle className="w-4 h-4 text-[#128C7E] mb-1" />
          <strong>حد الخصم الصارم (0%):</strong> مفعّل في محرك الحماية لمنع أي تنازلات سعرية.
        </div>
      </div>
    </div>
  );
};
