import React from 'react';
import {
  Network,
  Zap,
  FileCheck,
  ShieldCheck,
  Server,
  Smartphone,
  FileCode2,
  Send,
} from 'lucide-react';
import { ChannelSubTab } from '../types/channels.types';

interface ChannelsSubTabsProps {
  activeSubtab: ChannelSubTab;
  onSubtabChange: (tab: ChannelSubTab) => void;
}

export const ChannelsSubTabs: React.FC<ChannelsSubTabsProps> = ({
  activeSubtab,
  onSubtabChange,
}) => {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl overflow-x-auto border border-slate-200/60 dark:border-slate-700/60 scrollbar-none">
      <button
        onClick={() => onSubtabChange('api')}
        type="button"
        className={`h-[38px] flex items-center gap-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
          activeSubtab === 'api'
            ? 'bg-white dark:bg-[#111827] text-[#128C7E] elevation-1'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Network className="w-4 h-4 text-[#128C7E]" />
        <span>قنوات الربط والمحرك المزدوج (Dual Channels)</span>
        <span className="w-2 h-2 rounded-full bg-[#128C7E] animate-pulse"></span>
      </button>

      <button
        onClick={() => onSubtabChange('openwa')}
        type="button"
        className={`h-[38px] flex items-center gap-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
          activeSubtab === 'openwa'
            ? 'bg-white dark:bg-[#111827] text-[#128C7E] elevation-1'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Smartphone className="w-4 h-4 text-emerald-500" />
        <span>بوابة OpenWA الذاتية (QR Gateway)</span>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          مجاني
        </span>
      </button>

      <button
        onClick={() => onSubtabChange('telegram')}
        type="button"
        className={`h-[38px] flex items-center gap-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
          activeSubtab === 'telegram'
            ? 'bg-white dark:bg-[#111827] text-[#0088cc] elevation-1'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Send className="w-4 h-4 text-[#0088cc] -rotate-45" />
        <span>بوابة بوت تليغرام (Telegram Gateway)</span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-[#0088cc]">
          جديد
        </span>
      </button>

      <button
        onClick={() => onSubtabChange('swagger_docs')}
        type="button"
        className={`h-[38px] flex items-center gap-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
          activeSubtab === 'swagger_docs'
            ? 'bg-white dark:bg-[#111827] text-[#128C7E] elevation-1'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <FileCode2 className="w-4 h-4 text-[#128C7E]" />
        <span>توثيق Swagger API (Port 2785)</span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
          163 مسار
        </span>
      </button>

      <button
        onClick={() => onSubtabChange('ai_engine')}
        type="button"
        className={`h-[38px] flex items-center gap-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
          activeSubtab === 'ai_engine'
            ? 'bg-white dark:bg-[#111827] text-[#7C3AED] elevation-1'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Zap className="w-4 h-4 text-[#7C3AED]" />
        <span>محرك الذكاء الاصطناعي (Prompts & Behavior)</span>
      </button>

      <button
        onClick={() => onSubtabChange('templates')}
        type="button"
        className={`h-[38px] flex items-center gap-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
          activeSubtab === 'templates'
            ? 'bg-white dark:bg-[#111827] text-[#128C7E] elevation-1'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <FileCheck className="w-4 h-4 text-emerald-500" />
        <span>قوالب الرسائل التفاعلية (Interactive HSM)</span>
      </button>

      <button
        onClick={() => onSubtabChange('compliance')}
        type="button"
        className={`h-[38px] flex items-center gap-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
          activeSubtab === 'compliance'
            ? 'bg-white dark:bg-[#111827] text-[#128C7E] elevation-1'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <ShieldCheck className="w-4 h-4 text-blue-500" />
        <span>التشفير وسياسة الامتثال (Compliance & Keys)</span>
      </button>

      <button
        onClick={() => onSubtabChange('logs')}
        type="button"
        className={`h-[38px] flex items-center gap-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
          activeSubtab === 'logs'
            ? 'bg-white dark:bg-[#111827] text-[#128C7E] elevation-1'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Server className="w-4 h-4 text-amber-500" />
        <span>سجلات خوادم Meta (Live Logs)</span>
      </button>
    </div>
  );
};
