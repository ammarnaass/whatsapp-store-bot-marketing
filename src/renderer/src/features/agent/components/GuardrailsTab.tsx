import React from 'react';
import { Shield, AlertTriangle, Bot, Sparkles } from 'lucide-react';
import { GuardrailsState } from '../types/agent.types';

interface GuardrailsTabProps {
  guardrails: GuardrailsState;
  onUpdateGuardrail: (key: keyof GuardrailsState, val: boolean) => void;
  discountLimit: number;
  retryLimit: number;
  onRetryLimitChange: (limit: number) => void;
  onEmergencyStop: () => void;
}

export const GuardrailsTab: React.FC<GuardrailsTabProps> = ({
  guardrails,
  onUpdateGuardrail,
  discountLimit,
  retryLimit,
  onRetryLimitChange,
  onEmergencyStop
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F293D]">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#7C3AED]" />
            سياسات الأمان والحماية والتحويل البشري الفوري
          </h3>
          <p className="text-xs text-slate-400">
            قواعد صارمة لتجميد ردود الذكاء الاصطناعي وتحويل المحادثة لموظفي خدمة العملاء فوراً
          </p>
        </div>
        <button
          onClick={onEmergencyStop}
          type="button"
          className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 text-xs font-bold hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
        >
          إيقاف طارئ شامل
        </button>
      </div>

      {/* Guardrail Rules List */}
      <div className="space-y-3">
        {/* Rule 1: Negative Sentiment */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                اكتشاف نبرة الغضب أو التذمر الشديد (Sentiment Negative &gt; 80%)
              </span>
              <span className="text-[11px] text-slate-400">
                تحويل المحادثة تلقائياً لقسم الشكاوى مع إشعار صوتي فوري
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={guardrails.negativeSentiment}
            onChange={(e) => onUpdateGuardrail('negativeSentiment', e.target.checked)}
            className="w-5 h-5 rounded text-[#128C7E] focus:ring-0 cursor-pointer"
          />
        </div>

        {/* Rule 2: Explicit Human Request */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                طلب التحدث مع شخص بشري صراحةً
              </span>
              <span className="text-[11px] text-slate-400">
                مثل: "أبي موظف"، "حولني لممثل خدمة"، "ما أبي بوت"
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={guardrails.explicitHumanRequest}
            onChange={(e) => onUpdateGuardrail('explicitHumanRequest', e.target.checked)}
            className="w-5 h-5 rounded text-[#128C7E] focus:ring-0 cursor-pointer"
          />
        </div>

        {/* Rule 3: Discount Over Limit */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                التفاوض على سعر أو خصم يفوق {discountLimit}%
              </span>
              <span className="text-[11px] text-slate-400">
                منع الوكيل من إعطاء وعود مالية خارج حدود السياسة المعتمدة
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={guardrails.discountOverLimit}
            onChange={(e) => onUpdateGuardrail('discountOverLimit', e.target.checked)}
            className="w-5 h-5 rounded text-[#128C7E] focus:ring-0 cursor-pointer"
          />
        </div>

        {/* Rule 4: Payment Disputes */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                مشاكل دفع وفواتير معلقة أو بلاغات استرداد
              </span>
              <span className="text-[11px] text-slate-400">
                تحويل العميل فوراً لقسم المالية والمطابقات لضمان الدقة
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={guardrails.paymentDisputes}
            onChange={(e) => onUpdateGuardrail('paymentDisputes', e.target.checked)}
            className="w-5 h-5 rounded text-[#128C7E] focus:ring-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Fallback Retry Limit */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            حد إعادة الفهم الذكي (Misunderstanding Retry Limit)
          </span>
          <span className="text-[11px] text-slate-400">
            إذا لم يفهم الوكيل قصد العميل بعد محاولات متتالية، يتم التحويل لموظف بشري فوراً
          </span>
        </div>
        <select
          value={retryLimit}
          onChange={(e) => onRetryLimitChange(Number(e.target.value))}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
        >
          <option value={1}>محاولة واحدة</option>
          <option value={2}>محاولتان (موصى به)</option>
          <option value={3}>3 محاولات</option>
        </select>
      </div>
    </div>
  );
};
