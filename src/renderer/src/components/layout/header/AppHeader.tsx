import React from 'react';
import { Search, PauseCircle, Palette, Menu } from 'lucide-react';
import { ThemeToggle } from '../../../features/theme';
import { NotificationBellButton } from '../../../features/notifications';
import { UserProfileMenu } from '../../../features/auth';
import { useCustomizationStore } from '../../../features/customization';
import { api } from '../../../api-bridge';
import { AppHeaderProps } from './types';
import { AppHeaderStoreProfile } from './AppHeaderStoreProfile';
import { AppHeaderWindowControls } from './AppHeaderWindowControls';

export const AppHeader: React.FC<AppHeaderProps> = ({
  sessionStatus,
  globalSearch,
  onGlobalSearchChange,
  onEmergencyStop,
  isAgentStopped = true,
  onToggleSidebar,
}) => {
  const handleHeaderDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.app-no-drag')) {
      return;
    }
    api.window.toggleMaximize();
  };

  return (
    <header
      onDoubleClick={handleHeaderDoubleClick}
      className="h-16 border-b px-2 sm:px-4 md:px-5 flex items-center justify-between shrink-0 transition-colors z-30 bg-white dark:bg-[#111827] border-slate-200 dark:border-[#1F293D] elevation-1 app-drag-region select-none"
      title="انقر نقراً مزدوجاً لتكبير أو استعادة حجم النافذة"
    >
      {/* Right side: Mobile Menu Toggle, Store Identity & Global Search */}
      <div className="flex items-center gap-1.5 sm:gap-3 app-no-drag min-w-0">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition md:hidden shrink-0"
            title="فتح القائمة الرئيسية"
            aria-label="القائمة الرئيسية"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Store Identity & WhatsApp Connectivity Pill */}
        <AppHeaderStoreProfile sessionStatus={sessionStatus} />

        {/* Global Quick Search Bar */}
        <div className="relative w-32 sm:w-44 md:w-56 lg:w-64 hidden sm:block shrink">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => onGlobalSearchChange(e.target.value)}
            placeholder="ابحث في المتجر..."
            className="w-full h-[36px] pr-9 pl-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[#1F293D] rounded-xl text-xs font-medium focus:outline-none focus:border-[#128C7E] focus:ring-2 focus:ring-[#128C7E]/15 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Left side: AI Killswitch, Data Badge, Theme Toggle, Notifications, Store Avatar & Window Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 app-no-drag shrink-0">
        {/* Emergency Killswitch & Agent Status Badge */}
        <button
          onClick={onEmergencyStop}
          type="button"
          className={`h-[36px] flex items-center gap-1.5 px-2.5 sm:px-3 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
            isAgentStopped
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
          }`}
          title={isAgentStopped ? 'الوكيل متوقف حالياً (إشراف بشري) - انقر للتشغيل' : 'الوكيل نشط - انقر للإيقاف'}
        >
          <PauseCircle className={`w-4 h-4 shrink-0 ${isAgentStopped ? 'text-rose-500' : 'text-emerald-500'}`} />
          <span className="inline">{isAgentStopped ? 'الوكيل: متوقف' : 'الوكيل: نشط'}</span>
        </button>

        {/* Dark / Light Theme Toggle */}
        <ThemeToggle />

        {/* Quick Appearance Customizer */}
        <button
          onClick={() => useCustomizationStore.getState().setQuickModalOpen(true)}
          type="button"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="تخصيص المظهر، الألوان، وكثافة العرض"
        >
          <Palette className="w-4 h-4" />
        </button>

        {/* Real-time Notifications Bell with Badge */}
        <NotificationBellButton />

        {/* User Profile & Account Dropdown */}
        <div className="border-r border-slate-200 dark:border-[#1F293D] pr-1 mr-0.5">
          <UserProfileMenu />
        </div>

        {/* Consolidated Desktop Window Controls */}
        <AppHeaderWindowControls />
      </div>
    </header>
  );
};
