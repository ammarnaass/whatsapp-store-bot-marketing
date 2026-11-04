import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  ShoppingBag,
  Package,
  Bot,
  Users,
  BarChart2,
  Settings,
  Compass,
  Network
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'inbox'
  | 'orders'
  | 'products'
  | 'agent'
  | 'customers'
  | 'analytics'
  | 'channels'
  | 'settings';

interface AppSidebarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenWizard: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenWizard
}) => {
  const navItems: Array<{
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
    isAi?: boolean;
  }> = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'inbox', label: 'المحادثات', icon: MessageSquare, badge: 12 },
    { id: 'orders', label: 'الطلبات والمبيعات', icon: ShoppingBag },
    { id: 'products', label: 'المنتجات والكتالوج', icon: Package },
    { id: 'agent', label: 'وكيل الذكاء الاصطناعي', icon: Bot, isAi: true },
    { id: 'customers', label: 'إدارة العملاء و CRM', icon: Users },
    { id: 'analytics', label: 'التحليلات وذكاء البيانات', icon: BarChart2 },
    { id: 'channels', label: 'قنوات واتساب والربط', icon: Network },
    { id: 'settings', label: 'الإعدادات والتكاملات', icon: Settings },
  ];

  return (
    <aside className="w-64 border-l flex flex-col justify-between shrink-0 z-40 select-none bg-white dark:bg-[#0E1526] border-slate-200 dark:border-[#1F293D] elevation-1 transition-colors h-full">
      <div>
        {/* Brand & Workspace Info */}
        <div className="p-4 border-b flex items-center justify-between border-slate-100 dark:border-[#1F293D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#128C7E] text-white flex items-center justify-center shadow-md shadow-[#128C7E]/25">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-[#128C7E] tracking-tight">WaSell</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E7F6F2] dark:bg-[#128C7E]/20 text-[#075E54] dark:text-emerald-300">
                  واسل AI
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">وكيل المبيعات والتسويق الذكي</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                type="button"
                className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? item.isAi
                      ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30'
                      : 'bg-[#128C7E] text-white shadow-md shadow-[#128C7E]/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : item.isAi ? 'text-[#7C3AED]' : ''
                    }`}
                  />
                  <span className={item.isAi && !isActive ? 'text-[#7C3AED] font-bold' : ''}>
                    {item.label}
                  </span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#128C7E]/10 text-[#128C7E] dark:bg-[#128C7E]/20 dark:text-emerald-300'
                    }`}
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

                {item.id === 'channels' && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-white' : 'bg-[#128C7E] animate-pulse'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom: Subscription Pro Promo & Wizard */}
      <div className="p-4 border-t space-y-3 border-slate-100 dark:border-[#1F293D]">
        {/* Subscription Pro Card */}
        <div className="p-3 bg-gradient-to-br from-[#128C7E]/10 via-[#7C3AED]/10 to-transparent border border-[#128C7E]/20 rounded-xl elevation-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#128C7E]">باقة التاجر الذكي</span>
            <span className="text-[11px] text-[#7C3AED] font-bold bg-violet-100 dark:bg-[#7C3AED]/20 px-2 py-0.5 rounded-full">
              نشطة
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-[#128C7E] h-full rounded-full" style={{ width: '78%' }} />
          </div>
          <button
            onClick={() => onTabChange('settings')}
            type="button"
            className="w-full h-8 px-2 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center shadow-xs"
          >
            ترقية الباقة
          </button>
        </div>

        {/* Quick Guide Wizard Button */}
        <button
          onClick={onOpenWizard}
          type="button"
          className="w-full h-10 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer elevation-1 bg-[#E7F6F2] dark:bg-slate-800/80 hover:bg-emerald-100 dark:hover:bg-slate-800 text-[#075E54] dark:text-slate-200 border-emerald-200 dark:border-slate-700"
        >
          <Compass className="w-4 h-4 text-[#128C7E]" />
          <span>معالج الإعداد (5 خطوات)</span>
        </button>
      </div>
    </aside>
  );
};

