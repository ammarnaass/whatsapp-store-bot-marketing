import React from 'react';
import { Sparkles, Bot, ExternalLink, CheckCircle2 } from 'lucide-react';
import { AiProvider } from '../../types/integrations.types';

interface AiProviderCardProps {
  selectedProvider: AiProvider;
  onSelectProvider: (provider: AiProvider) => void;
}

export const AiProviderCard: React.FC<AiProviderCardProps> = ({
  selectedProvider,
  onSelectProvider,
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] dark:bg-[#7C3AED]/20 dark:text-violet-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              مزود خدمة الذكاء الاصطناعي (AI Provider)
            </h4>
            <p className="text-[11px] text-slate-400">
              اختر محرك الذكاء الاصطناعي لتشغيل وكيل المبيعات والرد التلقائي
            </p>
          </div>
        </div>

        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#128C7E] dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
        >
          <span>Google AI Studio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Google Gemini Card */}
        <button
          onClick={() => onSelectProvider('gemini')}
          type="button"
          className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer relative ${
            selectedProvider === 'gemini'
              ? 'border-[#128C7E] bg-[#E7F6F2]/50 dark:bg-[#128C7E]/10 ring-2 ring-[#128C7E]/20'
              : 'border-slate-200 dark:border-[#1F293D] hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              Google Gemini API
              {selectedProvider === 'gemini' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#128C7E] dark:text-emerald-400" />
              )}
            </span>
            <span className="text-[10px] bg-[#128C7E]/15 text-[#075E54] dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              موصى به
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            محرك فائق السرعة، دعم استدعاء أدوات المتجر الحي ومجاني للبدء
          </p>
        </button>

        {/* OpenAI Card */}
        <button
          onClick={() => onSelectProvider('openai')}
          type="button"
          className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer relative ${
            selectedProvider === 'openai'
              ? 'border-[#7C3AED] bg-violet-50/50 dark:bg-[#7C3AED]/10 ring-2 ring-[#7C3AED]/20'
              : 'border-slate-200 dark:border-[#1F293D] hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              OpenAI (GPT-4o)
              {selectedProvider === 'openai' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7C3AED] dark:text-violet-400" />
              )}
            </span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold px-2 py-0.5 rounded-full">
              مدعوم
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            نماذج GPT-4o و GPT-4o-mini عبر مفتاح OpenAI الخاص بك
          </p>
        </button>
      </div>
    </div>
  );
};

