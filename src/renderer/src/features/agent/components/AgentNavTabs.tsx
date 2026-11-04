import React from 'react';
import { BookOpen, Bot, Shield, Zap } from 'lucide-react';
import { AgentTab } from '../types/agent.types';

interface AgentNavTabsProps {
  activeTab: AgentTab;
  onTabChange: (tab: AgentTab) => void;
}

export const AgentNavTabs: React.FC<AgentNavTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-[#111827] p-1.5 rounded-2xl border border-slate-200 dark:border-[#1F293D] elevation-1 overflow-x-auto">
      <button
        onClick={() => onTabChange('knowledge')}
        type="button"
        className={`h-[38px] flex items-center gap-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
          activeTab === 'knowledge'
            ? 'bg-[#128C7E] text-white elevation-1'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <BookOpen className="w-4 h-4" />
        <span>كتالوج المنتجات ومصادر المعرفة</span>
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-mono tabular-nums ${
            activeTab === 'knowledge'
              ? 'bg-white/20 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}
        >
          1,420
        </span>
      </button>

      <button
        onClick={() => onTabChange('persona')}
        type="button"
        className={`h-[38px] flex items-center gap-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
          activeTab === 'persona'
            ? 'bg-[#128C7E] text-white elevation-1'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <Bot className="w-4 h-4" />
        <span>شخصية ونبرة الصوت</span>
      </button>

      <button
        onClick={() => onTabChange('guardrails')}
        type="button"
        className={`h-[38px] flex items-center gap-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
          activeTab === 'guardrails'
            ? 'bg-[#7C3AED] text-white elevation-1 glow-ai'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <Shield className="w-4 h-4" />
        <span>سياسات الأمان والتحويل البشري</span>
        <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse"></span>
      </button>

      <button
        onClick={() => onTabChange('integrations')}
        type="button"
        className={`h-[38px] flex items-center gap-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
          activeTab === 'integrations'
            ? 'bg-[#128C7E] text-white elevation-1'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <Zap className="w-4 h-4" />
        <span>القنوات والربط التقني (WhatsApp API)</span>
      </button>
    </div>
  );
};
