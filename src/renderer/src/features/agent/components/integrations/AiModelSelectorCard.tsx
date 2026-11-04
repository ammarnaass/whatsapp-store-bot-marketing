import React from 'react';
import { Cpu, CheckCircle2, Zap } from 'lucide-react';
import { AiModelOption } from '../../types/integrations.types';

interface AiModelSelectorCardProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
}

const GEMINI_MODELS: AiModelOption[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    tag: 'موصى به للتجارة الإلكترونية',
    description: 'الأنسب للرد السريع على العملاء في واتساب واستدعاء أدوات المتجر بأقل تكلفة.',
    speed: '< 0.9 ثانية',
    reasoning: 'دقيق وعالي الكفاءة',
    isRecommended: true,
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    tag: 'الاستنتاج المعقد والدعم الفني',
    description: 'قدرات استنتاج استثنائية لمطابقة المنتجات المعقدة وحل استفسارات العملاء المتقدمة.',
    speed: '~ 1.6 ثانية',
    reasoning: 'أعلى مستوى استنتاج',
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    tag: 'الجيل الأحدث فائق التطور',
    description: 'إصدار الجيل القادم لزمن استجابة قياسي وفهم عميق للهجات العربية المتنوعة.',
    speed: '< 0.7 ثانية',
    reasoning: 'استجابة فائقة السرعة',
  },
];

export const AiModelSelectorCard: React.FC<AiModelSelectorCardProps> = ({
  selectedModel,
  onSelectModel,
}) => {
  return (
    <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#128C7E] dark:text-emerald-400 flex items-center justify-center font-bold">
          <Cpu className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            النموذج اللغوي الذكي (Active AI Model)
          </h4>
          <p className="text-[11px] text-slate-400">
            حدد نموذج الذكاء الاصطناعي الأنسب لسرعة وتكلفة متجرك
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {GEMINI_MODELS.map((m) => {
          const isSelected = selectedModel === m.id;

          return (
            <button
              key={m.id}
              onClick={() => onSelectModel(m.id)}
              type="button"
              className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#128C7E] bg-[#E7F6F2]/40 dark:bg-[#128C7E]/10 ring-2 ring-[#128C7E]/20'
                  : 'border-slate-200 dark:border-[#1F293D] hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    {m.name}
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#128C7E] dark:text-emerald-400" />
                    )}
                  </span>
                  {m.isRecommended && (
                    <span className="text-[9px] bg-[#128C7E]/15 text-[#075E54] dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded-full">
                      الأفضل
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-[#128C7E] dark:text-emerald-400 font-semibold block mb-2">
                  {m.tag}
                </span>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {m.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <Zap className="w-3 h-3 text-amber-500" />
                  {m.speed}
                </span>
                <span>{m.reasoning}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

