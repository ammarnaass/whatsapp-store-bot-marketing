import React from 'react';
import { AgentPersona } from '../types/agent.types';

interface PersonaTabProps {
  selectedPersona: AgentPersona;
  onSelectPersona: (p: AgentPersona) => void;
  agentName: string;
  onAgentNameChange: (name: string) => void;
  discountLimit: number;
  onDiscountLimitChange: (limit: number) => void;
}

export const PersonaTab: React.FC<PersonaTabProps> = ({
  selectedPersona,
  onSelectPersona,
  agentName,
  onAgentNameChange,
  discountLimit,
  onDiscountLimitChange
}) => {
  const personas = [
    {
      id: 'friendly_saudi' as const,
      title: 'سعودي ودود وناصح',
      desc: 'يرحب بـ "يا هلا ومسهلا"، أسلوب مرح ولطيف مع إيموجي خفيف، يعزز التحويل للمتاجر العصرية.',
      badge: 'الأكثر تحويلاً'
    },
    {
      id: 'formal' as const,
      title: 'رسمي ومؤسسي',
      desc: 'عربية فصحى مبسطة، دقيق ومختصر بدون إطالة، مناسب للشركات والخدمات الراقية.',
      badge: 'B2B & رسمي'
    },
    {
      id: 'expert_trader' as const,
      title: 'تاجر شعبي خبير',
      desc: 'لهجة تجارية سريعة، تفاوض عالي وإغلاق سريع، مناسب لأسواق الجملة والمنتجات السريعة.',
      badge: 'إغلاق سريع'
    }
  ];

  return (
    <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] shadow-sm space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          شخصية ونبرة صوت الوكيل الذكي
        </h3>
        <p className="text-xs text-slate-400">
          اختر الأسلوب الذي يمثل علامتك التجارية أمام عملائك في واتساب
        </p>
      </div>

      {/* Persona Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {personas.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectPersona(item.id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedPersona === item.id
                ? 'border-[#128C7E] bg-emerald-50/50 dark:bg-[#128C7E]/20'
                : 'border-slate-200 dark:border-[#1F293D] hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                {item.title}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#128C7E]/10 text-[#128C7E]">
                {item.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Agent Name & Identity */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          اسم الوكيل الظاهر للعملاء
        </label>
        <input
          type="text"
          value={agentName}
          onChange={(e) => onAgentNameChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#128C7E]"
        />
      </div>

      {/* Discount Limit Slider */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-[#1F293D] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              الحد الأقصى للخصم التفاوضي التلقائي
            </span>
            <span className="text-[11px] text-slate-400">
              يمنع الوكيل منعاً باتاً من تقديم خصم أعلى من هذه النسبة مهما فاوضه العميل
            </span>
          </div>
          <span className="text-lg font-black text-[#128C7E]">{discountLimit}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="25"
          value={discountLimit}
          onChange={(e) => onDiscountLimitChange(Number(e.target.value))}
          className="w-full accent-[#128C7E] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
          <span>0% (ممنوع الخصم نهائياً)</span>
          <span>10%</span>
          <span className="text-[#128C7E]">15% (موصى به)</span>
          <span>25%</span>
        </div>
      </div>
    </div>
  );
};
