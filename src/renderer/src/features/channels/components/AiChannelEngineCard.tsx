import React, { useState } from 'react';
import { Bot, CheckCircle2, Sparkles, ShieldCheck, Clock, AlertTriangle, X, ShieldAlert } from 'lucide-react';

interface AiChannelEngineCardProps {
  onSave?: () => void;
}

export const AiChannelEngineCard: React.FC<AiChannelEngineCardProps> = ({ onSave }) => {
  // FR-78: تباطؤ الإرسال وتسخين الرقم مفعّلان افتراضياً
  const [simulateTyping, setSimulateTyping] = useState<boolean>(true);
  const [sendPacing, setSendPacing] = useState<boolean>(true);
  const [warmupSchedule, setWarmupSchedule] = useState<boolean>(true);

  // نافذة التأكيد الصريح للمالك عند محاولة التعطيل
  const [pendingDisableFeature, setPendingDisableFeature] = useState<'pacing' | 'warmup' | null>(null);

  const handleTogglePacing = () => {
    if (sendPacing) {
      // محاولة تعطيل: تتطلب قرار صريح للمالك (FR-78)
      setPendingDisableFeature('pacing');
    } else {
      setSendPacing(true);
    }
  };

  const handleToggleWarmup = () => {
    if (warmupSchedule) {
      // محاولة تعطيل: تتطلب قرار صريح للمالك (FR-78)
      setPendingDisableFeature('warmup');
    } else {
      setWarmupSchedule(true);
    }
  };

  const handleConfirmDisable = () => {
    if (pendingDisableFeature === 'pacing') {
      setSendPacing(false);
    } else if (pendingDisableFeature === 'warmup') {
      setWarmupSchedule(false);
    }
    setPendingDisableFeature(null);
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                سلوك وكيل الذكاء الاصطناعي وتباطؤ الإرسال (FR-78 Pacing & Warmup)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-[#128C7E] dark:text-emerald-300">
                مفعل افتراضياً لحماية الحساب
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              إعدادات محاكاة السلوك البشري لحماية الرقم من قيود خوارزميات واتساب وسرعة الاستجابة الذكية.
            </p>
          </div>
        </div>
        {onSave && (
          <button
            onClick={onSave}
            type="button"
            className="h-[38px] px-4 rounded-xl wasell-btn-primary text-xs font-bold flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>حفظ الإعدادات</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Rule 1: Simulate Typing */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                محاكاة الكتابة الحية (Typing...)
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={simulateTyping}
                onChange={(e) => setSimulateTyping(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#128C7E]"></div>
            </label>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            إظهار عبارة «يكتب الآن...» في تطبيق واتساب للعميل قبل إرسال الرد بـ 1.5 - 3 ثوانٍ لمنع كشف الردود الآلية.
          </p>
          <span className="text-[11px] font-mono font-bold text-[#128C7E]">
            SIMULATE_TYPING = {simulateTyping ? 'true' : 'false'}
          </span>
        </div>

        {/* Rule 2: Send Pacing (FR-78) */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#128C7E]" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                تباطؤ الإرسال (Send Pacing - FR-78)
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sendPacing}
                onChange={handleTogglePacing}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#128C7E]"></div>
            </label>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تأخير عشوائي بشري ذكي بين الرسائل وقاطع فشل متتالٍ لحماية الرقم (مفعّل افتراضياً بموجب FR-78).
          </p>
          <div className="flex items-center justify-between text-[11px] font-mono font-bold">
            <span className={sendPacing ? 'text-[#128C7E]' : 'text-rose-500'}>
              SEND_PACING = {sendPacing ? 'active' : 'disabled'}
            </span>
            <span className="text-[10px] text-slate-400 font-sans">إلزامي للمالك</span>
          </div>
        </div>

        {/* Rule 3: Number Warmup (FR-78) */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                تسخين الرقم الجديد (Warmup Schedule)
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={warmupSchedule}
                onChange={handleToggleWarmup}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#128C7E]"></div>
            </label>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تدرج تدريجي للحمل اليومي للأرقام الجديدة (20 محادثة بالأسبوع 1) لمنع استشعار الحسابات الجديدة.
          </p>
          <div className="flex items-center justify-between text-[11px] font-mono font-bold">
            <span className={warmupSchedule ? 'text-[#128C7E]' : 'text-rose-500'}>
              WARMUP = {warmupSchedule ? 'active' : 'disabled'}
            </span>
            <span className="text-[10px] text-slate-400 font-sans">تدرج آمن</span>
          </div>
        </div>
      </div>

      {/* Owner Confirmation Modal for FR-78 Explicit Decision */}
      {pendingDisableFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#111827] border border-rose-300 dark:border-rose-900/60 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  قرار صريح من المالك مطلوب (متطلب FR-78)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  أنت على وشك تعطيل{' '}
                  <strong className="text-rose-600 dark:text-rose-400">
                    {pendingDisableFeature === 'pacing' ? 'تباطؤ الإرسال الآمن' : 'جدول تسخين الرقم الجديد'}
                  </strong>
                  .
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
              تحذير شديد: تنص سياسة PRD v0.3 (FR-78) على أن التباطؤ والتدفئة مفعّلان افتراضياً. إن تعطيلهما يرفع خطر حظر رقم الواتساب فورياً بواسطة خوارزميات مكافحة السبام التابعة لـ Meta.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPendingDisableFeature(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                إلغاء والاحتفاظ بالأمان (موصى به)
              </button>
              <button
                type="button"
                onClick={handleConfirmDisable}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-sm"
              >
                تأكيد التعطيل بقرار المالك
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

