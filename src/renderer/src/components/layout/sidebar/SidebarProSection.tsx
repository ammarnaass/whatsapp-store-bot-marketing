import React from 'react';
import { Sparkles, Compass, Zap, ArrowUpRight } from 'lucide-react';
import { TabType } from './types';

interface SidebarProSectionProps {
  isCollapsed: boolean;
  onOpenWizard: () => void;
  onNavigateSettings: (tab: TabType) => void;
}

export const SidebarProSection: React.FC<SidebarProSectionProps> = ({
  isCollapsed,
  onOpenWizard,
  onNavigateSettings,
}) => {
  return (
    <div className="shrink-0 p-2.5 border-t border-slate-100 dark:border-[#1F293D] bg-slate-50/70 dark:bg-slate-900/60 space-y-2">
      {!isCollapsed ? (
        <>
          {/* Subscription Mini Banner */}
          <div className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-[#7C3AED] flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-bold text-slate-800 dark:text-slate-100 truncate">
                  باقة التاجر الذكي
                </div>
                <div className="text-[10px] text-slate-400 font-semibold truncate">
                  نشطة • 85% مستهلك
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateSettings('settings')}
              type="button"
              className="h-6.5 px-2 text-[10px] font-bold rounded-lg text-white shrink-0 cursor-pointer hover:opacity-90 transition-all shadow-xs flex items-center gap-0.5"
              style={{ backgroundColor: 'var(--color-brand-primary)' }}
              title="ترقية الباقة"
            >
              <span>ترقية</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Guide Wizard Button */}
          <button
            onClick={onOpenWizard}
            type="button"
            className="w-full h-8 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-xs hover:opacity-90 border-slate-200/80 dark:border-slate-700"
            style={{
              backgroundColor: 'var(--color-brand-light-bg)',
              color: 'var(--color-primary-dark)',
            }}
          >
            <Compass className="w-3.5 h-3.5" style={{ color: 'var(--color-brand-primary)' }} />
            <span>معالج الإعداد (5 خطوات)</span>
          </button>
        </>
      ) : (
        /* Collapsed View */
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={onOpenWizard}
            type="button"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer hover:opacity-90 shadow-xs"
            style={{
              backgroundColor: 'var(--color-brand-light-bg)',
              color: 'var(--color-brand-primary)',
            }}
            title="معالج الإعداد التوجيهي (5 خطوات)"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigateSettings('settings')}
            type="button"
            className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center text-[#7C3AED] hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-all cursor-pointer shadow-xs"
            title="باقة التاجر والإعدادات"
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
