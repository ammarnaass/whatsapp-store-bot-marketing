import React from 'react';
import { Sparkles, Shield, Zap } from 'lucide-react';

interface AgentHeaderProps {
  onOpenGuardrails: () => void;
  onSaveDeploy: () => void;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  onOpenGuardrails,
  onSaveDeploy
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            إعدادات وتدريب وكيل الذكاء الاصطناعي
          </h1>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            الوكيل نشط وجاهز للرد الفوري على واتساب
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7C3AED]" />
          نموذج محادثة Gemini Flash مخصص ومتصل بمتجر الرياض الرئيسي • تم تدريبه على 240 قاعدة تجارية
          وسياسة استرجاع حية
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenGuardrails}
          type="button"
          className="h-[38px] px-4 rounded-xl wasell-btn-secondary elevation-1 text-xs font-bold flex items-center gap-2 cursor-pointer"
        >
          <Shield className="w-4 h-4 text-[#128C7E]" />
          <span>سياسات الأمان والحماية</span>
        </button>
        <button
          onClick={onSaveDeploy}
          type="button"
          className="h-[38px] px-5 rounded-xl wasell-btn-primary elevation-2 glow-whatsapp text-xs font-bold flex items-center gap-2 cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>حفظ ونشر التحديثات على واتساب</span>
        </button>
      </div>
    </div>
  );
};
