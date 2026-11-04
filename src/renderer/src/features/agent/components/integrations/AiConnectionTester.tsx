import React from 'react';
import { Activity, Loader2, CheckCircle2, AlertCircle, DollarSign } from 'lucide-react';
import { AiConnectionTestResult } from '../../types/integrations.types';

interface AiConnectionTesterProps {
  isTesting: boolean;
  testResult: AiConnectionTestResult | null;
  dailyCostLimit: number;
  onDailyCostLimitChange: (val: number) => void;
  onRunTest: () => void;
}

export const AiConnectionTester: React.FC<AiConnectionTesterProps> = ({
  isTesting,
  testResult,
  dailyCostLimit,
  onDailyCostLimitChange,
  onRunTest,
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              فحص الاتصال وسقف التكلفة اليومي
            </h4>
            <p className="text-[11px] text-slate-400">
              اختبر استجابة المزود السحابي وحدد سقف الأمان المالي اليومي
            </p>
          </div>
        </div>

        {/* Test Button */}
        <button
          onClick={onRunTest}
          disabled={isTesting}
          type="button"
          className="h-10 px-4 rounded-xl bg-[#128C7E] hover:bg-[#075E54] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جارٍ فحص استجابة API...</span>
            </>
          ) : (
            <>
              <Activity className="w-4 h-4" />
              <span>اختبار الاتصال المباشر بـ API</span>
            </>
          )}
        </button>
      </div>

      {/* Test Result Feedback Alert */}
      {testResult && (
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs transition-all ${
            testResult.success
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <span className="font-bold block">
              {testResult.success
                ? `✓ تم الاتصال بنجاح • زمن الاستجابة: ${testResult.latencyMs}ms (${testResult.modelName})`
                : 'تعذر الاتصال بواجهة برمجة التطبيقات'}
            </span>
            <span className="text-[11px] opacity-90 leading-relaxed block mt-0.5">
              {testResult.success
                ? 'مفتاح الـ API صالح والنموذج جاهز لمعالجة محادثات العملاء واستدعاء أدوات الكتالوج فوراً.'
                : testResult.error}
            </span>
          </div>
        </div>
      )}

      {/* Daily Cost Cap Slider & Input */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <DollarSign className="w-4 h-4 text-amber-500" />
          <span>سقف التكلفة اليومي للوكيل:</span>
          <span className="font-mono text-[#128C7E] dark:text-emerald-400 font-extrabold text-sm">
            ${dailyCostLimit} / يوم
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={dailyCostLimit}
            onChange={(e) => onDailyCostLimitChange(Number(e.target.value))}
            className="w-32 accent-[#128C7E] cursor-pointer"
          />
          <span className="text-[11px] text-slate-400">إيقاف ذاتي عند الوصول للسقف</span>
        </div>
      </div>
    </div>
  );
};

