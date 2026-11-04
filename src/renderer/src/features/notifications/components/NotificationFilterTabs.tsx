import React from 'react';
import { NotificationCategory } from '../types/notification.types';

interface NotificationFilterTabsProps {
  activeCategory: NotificationCategory;
  onSelectCategory: (cat: NotificationCategory) => void;
  counts: Record<NotificationCategory, number>;
}

export const NotificationFilterTabs: React.FC<NotificationFilterTabsProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  const tabs: { id: NotificationCategory; label: string }[] = [
    { id: 'all', label: 'الكل' },
    { id: 'unread', label: 'غير مقروءة' },
    { id: 'whatsapp', label: 'واتساب' },
    { id: 'order', label: 'الطلبات' },
    { id: 'ai_alert', label: 'الوكيل الذكي' },
  ];

  return (
    <div className="px-3 py-2 border-b border-slate-100 dark:border-[#1F293D] flex items-center gap-1.5 overflow-x-auto bg-slate-50/60 dark:bg-[#0B0F19]/40 shrink-0">
      {tabs.map((tab) => {
        const isActive = activeCategory === tab.id;
        const count = counts[tab.id] || 0;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectCategory(tab.id)}
            type="button"
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              isActive
                ? 'bg-[#128C7E] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            {count > 0 && (
              <span
                className={`text-[9px] px-1 py-0.2 rounded-full tabular-nums ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

