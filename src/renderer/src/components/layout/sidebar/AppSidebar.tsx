import React from 'react';
import { AppSidebarProps, TabType } from './types';
import { SIDEBAR_NAV_GROUPS } from './nav-items';
import { SidebarBrandHeader } from './SidebarBrandHeader';
import { SidebarNavItemButton } from './SidebarNavItemButton';
import { SidebarProSection } from './SidebarProSection';

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenWizard,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const handleItemClick = (id: TabType) => {
    onTabChange(id);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Main Frame */}
      <aside
        className={`fixed md:static inset-y-0 right-0 z-50 md:z-40 flex flex-col shrink-0 select-none bg-white dark:bg-[#111827] border-l border-slate-200 dark:border-[#1F293D] elevation-2 md:elevation-1 transition-all duration-300 ease-in-out h-full overflow-hidden ${
          isCollapsed ? 'w-[72px]' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        {/* 1. Header (Fixed top) */}
        <SidebarBrandHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
          onBrandClick={handleItemClick}
        />

        {/* 2. Scrollable Navigation (True Flexbox flex-1 min-h-0 with overscroll-contain) */}
        <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-2 py-2 space-y-2.5 wasell-sidebar-scroll">
          {SIDEBAR_NAV_GROUPS.map((group, groupIdx) => (
            <div key={group.id} className="space-y-1">
              {/* Group Section Header / Divider */}
              {!isCollapsed ? (
                <div className="px-2.5 pt-1 pb-0.5 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {group.title}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400/60 tabular-nums">
                    {group.items.length}
                  </span>
                </div>
              ) : (
                groupIdx > 0 && (
                  <div className="my-1.5 mx-auto w-6 border-t border-slate-200 dark:border-slate-800" />
                )
              )}

              {/* Group Nav Items */}
              {group.items.map((item) => (
                <SidebarNavItemButton
                  key={item.id}
                  item={item}
                  isActive={currentTab === item.id}
                  isCollapsed={isCollapsed}
                  onClick={handleItemClick}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* 3. Bottom Section (Fixed bottom) */}
        <SidebarProSection
          isCollapsed={isCollapsed}
          onOpenWizard={onOpenWizard}
          onNavigateSettings={handleItemClick}
        />
      </aside>
    </>
  );
};
