import React from 'react';
import { SidebarNavItem, TabType } from './types';

interface SidebarNavItemButtonProps {
  item: SidebarNavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: (id: TabType) => void;
}

export const SidebarNavItemButton: React.FC<SidebarNavItemButtonProps> = ({
  item,
  isActive,
  isCollapsed,
  onClick,
}) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onClick(item.id)}
      type="button"
      title={`${item.label} — ${item.description}`}
      className={`relative w-full rounded-xl transition-all duration-150 cursor-pointer group flex items-center ${
        isCollapsed
          ? 'justify-center h-10 p-0'
          : 'justify-between px-2.5 py-2 min-h-[38px]'
      } ${
        isActive
          ? item.isAi
            ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-md shadow-[#7C3AED]/25 font-bold'
            : 'text-white shadow-md font-bold'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 font-medium'
      }`}
      style={
        isActive && !item.isAi
          ? {
              backgroundImage: 'linear-gradient(to left, var(--color-brand-primary), var(--color-primary-dark))',
              boxShadow: '0 4px 14px 0 var(--color-brand-glow)',
            }
          : undefined
      }
    >
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 min-w-0'}`}>
        {/* Squircle Icon Container */}
        <div
          className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-150 ${
            isActive
              ? 'bg-white/20 text-white shadow-xs'
              : `${item.iconBgLight} ${item.iconBgDark} group-hover:scale-105`
          }`}
        >
          <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.2 : 1.9} />
        </div>

        {/* Labels (Expanded mode) */}
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 text-right leading-tight truncate">
            <span
              className={`text-[13px] font-bold truncate ${
                item.isAi && !isActive ? 'text-[#7C3AED] dark:text-violet-400' : ''
              }`}
            >
              {item.label}
            </span>
            {item.isAi && !isActive && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-violet-100 dark:bg-violet-950/60 text-[#7C3AED] dark:text-violet-300">
                AI
              </span>
            )}
          </div>
        )}
      </div>

      {/* Badges / Active dots */}
      {!isCollapsed ? (
        <div className="flex items-center gap-1.5 shrink-0 mr-1">
          {item.badge !== undefined && (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                isActive ? 'bg-white/25 text-white' : ''
              }`}
              style={
                !isActive
                  ? {
                      backgroundColor: 'var(--color-brand-light-bg)',
                      color: 'var(--color-brand-primary)',
                    }
                  : undefined
              }
            >
              {item.badge}
            </span>
          )}

          {item.isAi && !item.badge && (
            <span
              className={`w-2 h-2 rounded-full ${
                isActive ? 'bg-white' : 'bg-[#7C3AED] animate-pulse'
              }`}
            />
          )}
        </div>
      ) : (
        item.badge !== undefined && (
          <span className="absolute top-1 left-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-xs">
            {item.badge}
          </span>
        )
      )}
    </button>
  );
};
