import React from 'react';
import {
  Store,
  Bot,
  BellRing,
  ShieldCheck,
  Palette,
  UserCheck
} from 'lucide-react';
import { SettingsTabId } from '../types/settings.types';

interface SettingsNavBarProps {
  activeTab: SettingsTabId;
  onTabChange: (tabId: SettingsTabId) => void;
}

export const SettingsNavBar: React.FC<SettingsNavBarProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'tab-account' as SettingsTabId, label: 'إدارة الحساب وفريق العمل', icon: UserCheck },
    { id: 'tab-appearance' as SettingsTabId, label: 'المظهر وتخصيص الواجهة', icon: Palette },
    { id: 'tab-identity' as SettingsTabId, label: 'هوية المتجر والبيانات الأساسية', icon: Store },
    { id: 'tab-commerce' as SettingsTabId, label: 'سلوك وتجربة واتساب', icon: Bot },
    { id: 'tab-alerts' as SettingsTabId, label: 'الإشعارات وتنبيهات الإدارة', icon: BellRing },
    { id: 'tab-security' as SettingsTabId, label: 'الأمان والنسخ الاحتياطي', icon: ShieldCheck }
  ];

  return (
    <div className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F293D] rounded-2xl p-1.5 elevation-1 overflow-x-auto">
      <nav className="flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              type="button"
              className={`h-[38px] px-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#128C7E] text-white elevation-1'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
