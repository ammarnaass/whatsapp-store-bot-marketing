import React from 'react';

export type TabType =
  | 'dashboard'
  | 'inbox'
  | 'orders'
  | 'products'
  | 'inventory'
  | 'shipping'
  | 'marketing'
  | 'agent'
  | 'customers'
  | 'analytics'
  | 'channels'
  | 'telegram'
  | 'settings';

export interface SidebarNavItem {
  id: TabType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: string | number;
  badgeColor?: string;
  isAi?: boolean;
  iconBgLight: string;
  iconBgDark: string;
  iconColorLight: string;
  iconColorDark: string;
}

export interface SidebarNavGroup {
  id: string;
  title: string;
  items: SidebarNavItem[];
}

export interface AppSidebarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenWizard: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

