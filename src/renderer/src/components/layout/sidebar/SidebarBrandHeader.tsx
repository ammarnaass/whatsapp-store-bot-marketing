import React from 'react';
import { Bot, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { TabType } from './types';

interface SidebarBrandHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onBrandClick: (tab: TabType) => void;
}

export const SidebarBrandHeader: React.FC<SidebarBrandHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  onBrandClick,
}) => {
  return (
    <div
      className={`h-16 px-3.5 border-b flex items-center border-slate-200 dark:border-[#1F293D] shrink-0 ${
        isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'
      }`}
    >
      {/* Brand Identity */}
      <div
        onClick={() => onBrandClick('dashboard')}
        className="flex items-center gap-2.5 cursor-pointer group"
        title="WaSell AI - الرئيسية"
      >
        <div
          className="w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform duration-200"
          style={{
            backgroundImage: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-primary-dark))',
            boxShadow: '0 4px 14px 0 var(--color-brand-glow)',
          }}
        >
          <Bot className="w-5 h-5" />
        </div>

        {!isCollapsed && (
          <div className="flex flex-col text-right leading-tight">
            <div className="flex items-center gap-1.5">
              <span
                className="font-extrabold text-lg tracking-tight"
                style={{ color: 'var(--color-brand-primary)' }}
              >
                WaSell
              </span>
              <span
                className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: 'var(--color-brand-light-bg)',
                  color: 'var(--color-primary-dark)',
                }}
              >
                واسل AI
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium truncate max-w-[120px]">
              المبيعات والتسويق
            </span>
          </div>
        )}
      </div>

      {/* Single Sidebar Collapse / Expand Toggle Button */}
      <button
        onClick={onToggleCollapse}
        type="button"
        className={`rounded-xl border border-slate-200/80 dark:border-[#1F293D] text-slate-500 dark:text-slate-400 hover:text-[#128C7E] dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer flex items-center justify-center ${
          isCollapsed ? 'w-9 h-9 mt-1' : 'w-9 h-9'
        }`}
        title={isCollapsed ? 'توسيع القائمة الجانبية (Ctrl+B)' : 'طي القائمة الجانبية (Ctrl+B)'}
        aria-label={isCollapsed ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'}
      >
        {isCollapsed ? (
          <PanelRightOpen className="w-4 h-4" />
        ) : (
          <PanelRightClose className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

