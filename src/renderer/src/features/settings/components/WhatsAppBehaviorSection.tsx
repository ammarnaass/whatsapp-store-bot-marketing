import React from 'react';
import { Bot, Sparkles, Eye, CheckCheck } from 'lucide-react';
import { WhatsAppBehavior } from '../types/settings.types';

interface WhatsAppBehaviorSectionProps {
  behavior: WhatsAppBehavior;
  onChange: (updated: WhatsAppBehavior) => void;
}

export const WhatsAppBehaviorSection: React.FC<WhatsAppBehaviorSectionProps> = ({
  behavior,
  onChange
}) => {
  const toggleField = (key: keyof Omit<WhatsAppBehavior, 'greetingMessage'>) => {
    onChange({ ...behavior, [key]: !behavior[key] });
  };

  const updateGreeting = (text: string) => {
    onChange({ ...behavior, greetingMessage: text });
  };

  return (
    <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-[#1F293D]/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                سلوك تجربة الواتساب
              </h2>
              <p className="text-xs text-slate-400">
                الردود الفورية، مسارات الدفع، والتفاعل التلقائي
              </p>
            </div>
          </div>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#128C7E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#128C7E]"></span>
          </span>
        </div>

        {/* Toggles List */}
        <div className="space-y-3 mb-5">
          {/* Toggle 1 */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D]">
            <div className="space-y-0.5 max-w-[78%]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  البيع التلقائي الذاتي (24/7)
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#128C7E] text-white font-bold">
                  موصى به
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                إتمام صفقات البيع وتوفير الكتالوج وروابط الدفع دون انتظار أي موظف.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={behavior.autoSelling247}
                onChange={() => toggleField('autoSelling247')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#128C7E]"></div>
            </label>
          </div>

          {/* Toggle 2 */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D]">
            <div className="space-y-0.5 max-w-[78%]">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                الاستجابة خارج أوقات العمل
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                الرد الفوري وتجميع بيانات عنوان العميل وتجهيز الطلب حتى فتح المستودع.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={behavior.offHoursResponse}
                onChange={() => toggleField('offHoursResponse')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#128C7E]"></div>
            </label>
          </div>

          {/* Toggle 3 */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D]">
            <div className="space-y-0.5 max-w-[78%]">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                الفاتورة الضريبية وتتبع الشحنة الفوري
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                إرسال مستند PDF الضريبي ورابط تتبع البوليصة فور اكتمال الدفع بنجاح.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={behavior.taxInvoiceAndTracking}
                onChange={() => toggleField('taxInvoiceAndTracking')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#128C7E]"></div>
            </label>
          </div>
        </div>

        {/* Greeting Message Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            رسالة الترحيب الأولى للمحادثة
          </label>
          <textarea
            value={behavior.greetingMessage}
            onChange={(e) => updateGreeting(e.target.value)}
            rows={2}
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#128C7E]/20 resize-none font-medium"
          />
        </div>

        {/* Realistic WhatsApp Chat Bubble Live Mockup */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#EFEAE2] dark:bg-[#0B141A] flex flex-col gap-2 shadow-inner border border-amber-900/10 dark:border-[#1F293D]">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-bold text-[#128C7E]">
              <Eye className="w-3.5 h-3.5" />
              معاينة رسالة الواتساب الحية
            </span>
            <span className="font-mono text-[11px]">الآن</span>
          </div>

          <div className="self-start max-w-[92%] bg-white dark:bg-[#1F2C34] text-slate-800 dark:text-slate-100 p-3 rounded-2xl rounded-tr-none shadow-sm space-y-1.5 border border-slate-200/40 dark:border-slate-700/50">
            <p className="text-xs leading-relaxed">
              {behavior.greetingMessage || 'يا هلا ومرحب فيك بمتجرنا الفاخر! ✨'}
            </p>
            <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-mono">
              <span>10:42 ص</span>
              <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
