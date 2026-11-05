import React, { useState, useEffect } from 'react';
import { DashboardView } from './features/dashboard';
import { InboxView } from './features/inbox';
import { OrdersPage } from './features/orders';
import { ProductsPage } from './features/products';
import { InventoryPage } from './features/inventory';
import { ShippingPage } from './features/shipping';
import { MarketingPage } from './features/marketing';
import { AgentView } from './features/agent';
import { CustomersPage } from './features/customers';
import { AnalyticsPage } from './features/analytics';
import { SettingsPage } from './features/settings';
import { ChannelsPage } from './features/channels';
import { TelegramPage } from './features/telegram';
import { SetupWizardModal } from './features/onboarding';
import { NotificationDrawer, NotificationToastContainer, useNotificationEvents } from './features/notifications';
import { useTheme } from './features/theme';
import { AuthScreen, AccountManagementModal, useAuthStore } from './features/auth';
import { QuickAppearanceModal, useScreenBreakpoint, useCustomization } from './features/customization';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppSidebar, AppHeader, TabType } from './components/layout';
import { useAppLifecycle } from './hooks/useAppLifecycle';
import { api } from './api-bridge';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [showWizardModal, setShowWizardModal] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isAgentStopped, setIsAgentStopped] = useState<boolean>(true);
  const { isAuthenticated, isLoading } = useAuthStore();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('wasell_sidebar_collapsed');
      return saved !== null ? saved === 'true' : typeof window !== 'undefined' && window.innerWidth < 1180;
    } catch {
      return false;
    }
  });

  const { width, shouldAutoCollapseSidebar } = useScreenBreakpoint();

  useEffect(() => {
    if (shouldAutoCollapseSidebar) {
      setIsSidebarCollapsed(true);
    }
  }, [shouldAutoCollapseSidebar]);

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMobileSidebarOpen((prev) => !prev);
      return;
    }
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem('wasell_sidebar_collapsed', String(next)); } catch {}
      return next;
    });
  };

  useTheme();
  useCustomization();
  useNotificationEvents();
  const { sessionStatus } = useAppLifecycle({ handleToggleSidebar, isSidebarCollapsed, setIsSidebarCollapsed });

  const handleQuickEmergencyStop = async () => {
    if (isAgentStopped) {
      if (confirm('الوكيل الذكي متوقف حالياً. هل تريد تشغيله وتفعيل الردود التلقائية؟')) {
        await api.agent.setMode?.({ mode: 'AUTONOMOUS' });
        setIsAgentStopped(false);
        alert('تم تشغيل الوكيل الذكي بنجاح.');
      }
    } else if (confirm('تأكيد إيقاف الوكيل الذكي؟ سيتم تجميد الردود الآلية وتحويل كافة المحادثات للإشراف البشري.')) {
      await api.agent.emergencyStop();
      setIsAgentStopped(true);
      alert('تم إيقاف الوكيل الذكي بنجاح.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F6F7F9] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#128C7E] to-[#075E54] flex items-center justify-center text-white font-black text-xl shadow-xl animate-pulse">
          W
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-400">جارِ التحقق من الحساب وإعداد الجلسة...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const isFixedViewport = currentTab === 'inbox';

  return (
    <div className="flex h-full w-full min-h-screen overflow-hidden bg-[#F6F7F9] dark:bg-[#0B0F19] text-[#1F2937] dark:text-[#F9FAFB] select-none transition-colors duration-200">
      <AppSidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenWizard={() => setShowWizardModal(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <AppHeader
          sessionStatus={sessionStatus}
          globalSearch={globalSearch}
          onGlobalSearchChange={setGlobalSearch}
          onEmergencyStop={handleQuickEmergencyStop}
          isAgentStopped={isAgentStopped}
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <div className={`flex-1 min-h-0 ${isFixedViewport ? 'overflow-hidden p-2.5 sm:p-4 md:p-5 flex flex-col h-full' : 'overflow-y-auto p-3 sm:p-4 md:p-6'}`}>
          <ErrorBoundary>
            {currentTab === 'dashboard' && <DashboardView />}
            {currentTab === 'inbox' && <InboxView />}
            {currentTab === 'orders' && <OrdersPage />}
            {currentTab === 'products' && <ProductsPage />}
            {currentTab === 'inventory' && <InventoryPage />}
            {currentTab === 'shipping' && <ShippingPage />}
            {currentTab === 'marketing' && <MarketingPage />}
            {currentTab === 'agent' && <AgentView />}
            {currentTab === 'customers' && <CustomersPage />}
            {currentTab === 'analytics' && <AnalyticsPage />}
            {currentTab === 'channels' && <ChannelsPage />}
            {currentTab === 'telegram' && <TelegramPage />}
            {currentTab === 'settings' && <SettingsPage />}
          </ErrorBoundary>
        </div>
      </main>

      <SetupWizardModal isOpen={showWizardModal} onClose={() => setShowWizardModal(false)} />
      <NotificationDrawer onNavigateTab={(tab) => setCurrentTab(tab as TabType)} />
      <NotificationToastContainer />
      <AccountManagementModal />
      <QuickAppearanceModal />
    </div>
  );
};
