import React from 'react';
import { Lightbulb, ArrowLeft, Zap, Clock, TrendingUp } from 'lucide-react';
import { ActionableInsightItem } from '../types/analytics.types';

interface SmartActionableInsightsProps {
  insights: ActionableInsightItem[];
}

export const SmartActionableInsights: React.FC<SmartActionableInsightsProps> = ({ insights }) => {
  const getIcon = (type: string) => {
    if (type === 'timing') return Clock;
    if (type === 'automation') return Zap;
    return TrendingUp;
  };

  const getBadgeStyle = (impact: string) => {
    if (impact === 'مرتفع') return 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/50';
    if (impact === 'متوسط') return 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50';
    return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50';
  };

  return (
    <div className="lg:col-span-6 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#128C7E]" />
            <span>توصيات وفرص نمو ذكية (Actionable Insights)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">فرص تسويقية وتشغيلية مستخرجة آلياً من سلوك المشترين</p>
        </div>
        <span className="text-[11px] font-bold text-[#7C3AED] bg-purple-50 dark:bg-[#7C3AED]/15 px-2.5 py-1 rounded-full">
          محدث لحظياً
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {insights.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 hover:border-[#128C7E]/40 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-[#128C7E]/20 text-[#128C7E] flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(item.impact)}`}>
                  أثر {item.impact}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pr-8">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

