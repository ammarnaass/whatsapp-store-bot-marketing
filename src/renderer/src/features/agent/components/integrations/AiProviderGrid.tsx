import React from 'react';
import { Sparkles, CheckCircle2, ExternalLink } from 'lucide-react';
import { AiProvider, PROVIDER_META_LIST } from '../../types/integrations.types';

interface AiProviderGridProps {
  selectedProvider: AiProvider;
  onSelectProvider: (provider: AiProvider) => void;
}

export const AiProviderGrid: React.FC<AiProviderGridProps> = ({
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
              مزودو خدمة الذكاء الاصطناعي (AI Providers)
            </h4>
            <p className="text-[11px] text-slate-400">
              اختر المحرك الذكي لتشغيل الرد التلقائي وإدارة مبيعات واتساب
            </p>
          </div>
        </div>

        <span className="text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
          4 مزودات عالمية مدعومة
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PROVIDER_META_LIST.map((prov) => {
          const isSelected = selectedProvider === prov.id;

          return (
            <button
              key={prov.id}
              onClick={() => onSelectProvider(prov.id)}
              type="button"
              className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#128C7E] bg-[#E7F6F2]/40 dark:bg-[#128C7E]/10 ring-2 ring-[#128C7E]/25 shadow-xs'
                  : 'border-slate-200 dark:border-[#1F293D] hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    {prov.name}
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#128C7E] dark:text-emerald-400" />
                    )}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-[#128C7E]/15 text-[#075E54] dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {prov.badge}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {prov.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-mono">{prov.defaultModel}</span>
                <span className="text-[#128C7E] dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span>منصة المفاتيح</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

