import React from 'react';
import { PieChart, Smile, CheckCircle, ShieldAlert } from 'lucide-react';
import { ConversationIntelligenceData } from '../types/analytics.types';

interface ConversationIntelligenceCardProps {
  intelligence: ConversationIntelligenceData;
}

export const ConversationIntelligenceCard: React.FC<ConversationIntelligenceCardProps> = ({ intelligence }) => {
  const { intents, sentiment, agentQuality } = intelligence;

  return (
    <div className="lg:col-span-5 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 space-y-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#7C3AED]" />
            <span>ذكاء المحادثات وتوزيع النوايا</span>
          </h3>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
            <Smile className="w-3 h-3" />
            رضا {sentiment.satisfactionRate}%
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-3">تحليل فوري لنوايا ورسائل العملاء بواسطة الوكيل</p>

        {/* Sentiment breakdown strip */}
        <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-4 text-xs font-bold border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 text-[11px]">مؤشر المشاعر:</span>
          <span className="text-emerald-600 font-mono">إيجابي {sentiment.positive}%</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-mono">محايد {sentiment.neutral}%</span>
          <span className="text-slate-300">•</span>
          <span className="text-rose-500 font-mono">سلبي {sentiment.negative}%</span>
        </div>

        {/* Intent Progress Bars */}
        <div className="space-y-2.5">
          {intents.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300 text-[11px]">{item.label}</span>
                <span className="text-slate-900 dark:text-white font-mono text-[11px]">{item.percent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Quality Bar */}
      <div className="pt-3 border-t border-slate-100 dark:border-[#1F293D] grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 block font-medium">دقة الإجابات</span>
          <span className="font-extrabold text-slate-900 dark:text-white font-mono text-xs text-[#128C7E]">
            {agentQuality.confidenceScore}%
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 block font-medium">سرعة الرد</span>
          <span className="font-extrabold text-slate-900 dark:text-white font-mono text-xs">
            {agentQuality.avgLatencyMs}ms
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 block font-medium">تصعيد بشري</span>
          <span className="font-extrabold text-slate-900 dark:text-white font-mono text-xs text-amber-500">
            {agentQuality.humanHandoverRate}%
          </span>
        </div>
      </div>
    </div>
  );
};
