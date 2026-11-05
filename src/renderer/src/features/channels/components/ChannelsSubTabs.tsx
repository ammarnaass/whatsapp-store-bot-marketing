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
  const tabs = [
    { id: 'api' as const, label: 'المحرك المزدوج (Dual Channels)', icon: Network, badge: 'نشط' },
    { id: 'openwa' as const, label: 'بوابة OpenWA (QR Gateway)', icon: Smartphone, badge: 'مجاني' },
    { id: 'telegram' as const, label: 'بوابة بوت تليغرام', icon: Send, badge: 'جديد' },
    { id: 'swagger_docs' as const, label: 'توثيق Swagger API', icon: FileCode2, badge: '163 مسار' },
    { id: 'ai_engine' as const, label: 'محرك الذكاء الاصطناعي', icon: Zap },
    { id: 'templates' as const, label: 'قوالب الرسائل (HSM)', icon: FileCheck },
    { id: 'compliance' as const, label: 'بيانات Meta والامتثال', icon: ShieldCheck },
    { id: 'logs' as const, label: 'سجلات الويب هوك', icon: Server },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl overflow-x-auto border border-slate-200/60 dark:border-slate-700/60 scrollbar-none">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeSubtab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSubtabChange(t.id)}
            type="button"
            className={`h-[36px] flex items-center gap-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? 'bg-white dark:bg-[#111827] text-[#128C7E] elevation-1 font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{t.label}</span>
            {t.badge && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-[#128C7E]/15 text-[#128C7E]' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
