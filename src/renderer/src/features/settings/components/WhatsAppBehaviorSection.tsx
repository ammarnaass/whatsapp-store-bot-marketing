import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { WhatsAppBehavior } from '../types/settings.types';
import { WhatsAppBehaviorToggle } from './WhatsAppBehaviorToggle';

interface WhatsAppBehaviorSectionProps {
  behavior: WhatsAppBehavior;
  onChange: (updated: WhatsAppBehavior) => void;
}

export const WhatsAppBehaviorSection: React.FC<WhatsAppBehaviorSectionProps> = ({
  behavior,
  onChange,
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
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-[#1F293D]/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">سلوك تجربة الواتساب</h2>
              <p className="text-xs text-slate-400">الردود الفورية، مسارات الدفع، والتفاعل التلقائي</p>
            </div>
          </div>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#128C7E] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#128C7E]" />
          </span>
        </div>

        <div className="space-y-3 mb-5">
          <WhatsAppBehaviorToggle
            title="البيع التلقائي الذاتي (24/7)"
            badge="موصى به"
            description="إتمام صفقات البيع وتوفير الكتالوج وروابط الدفع دون انتظار أي موظف."
            checked={behavior.autoSelling247}
            onToggle={() => toggleField('autoSelling247')}
          />

          <WhatsAppBehaviorToggle
            title="الاستجابة خارج أوقات العمل"
            description="الرد الفوري وتجميع بيانات عنوان العميل وتجهيز الطلب حتى فتح المستودع."
            checked={behavior.offHoursResponse}
            onToggle={() => toggleField('offHoursResponse')}
          />

          <WhatsAppBehaviorToggle
            title="الفاتورة الضريبية وتتبع الشحنة الفوري"
            description="إرسال رابط الفاتورة الإلكترونية المعتمدة ورقم التتبع للعميل بعد السداد."
            checked={behavior.taxInvoiceAndTracking}
            onToggle={() => toggleField('taxInvoiceAndTracking')}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              رسالة الترحيب الافتتاحية للمحادثة الجديدة
            </label>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#7C3AED]" />
              صياغة تسويقية جاذبة
            </span>
          </div>
          <textarea
            rows={3}
            value={behavior.greetingMessage}
            onChange={(e) => updateGreeting(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E] resize-none transition-all"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-[#1F293D] mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>زمن استجابة الوكيل: &lt; 0.8 ثانية</span>
        <span className="text-[#128C7E] font-bold">بوابة OpenWA نشطة</span>
      </div>
    </section>
  );
};
