import React, { useState, useEffect } from 'react';
import { DashboardView } from './features/dashboard';
import { InboxView } from './features/inbox';
import { OrdersPage } from './features/orders';
import { ProductsPage } from './features/products';
import { AgentView } from './features/agent';
import { CustomersPage } from './features/customers';
import { AnalyticsPage } from './features/analytics';
import { SettingsPage } from './features/settings';
import { ChannelsPage } from './features/channels';
import { SetupWizardModal } from './features/onboarding';
import { DataManagerModal, useDataStore } from './features/data-management';
import { useTheme } from './features/theme';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppSidebar, AppHeader, TabType } from './components/layout';
import { api } from './api-bridge';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [sessionStatus, setSessionStatus] = useState<string>('CONNECTED');
  const [showWizardModal, setShowWizardModal] = useState<boolean>(false);
  const [showDataManagerModal, setShowDataManagerModal] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Reactive theme synchronization with DOM
  useTheme();

  useEffect(() => {
    // 1. مزامنة وجلب البيانات من قاعدة البيانات المحلية أو البيانات التجريبية
    useDataStore.getState().hydrateFromApi();

    // 2. الاستماع لأحداث وصول الرسائل الحية عبر Webhook وتحديث الواجهة تلقائياً
    const unsubMsg = api.chat.onMessageReceived((data) => {
      useDataStore.getState().handleLiveMessageReceived(data);
    });

    // 3. متابعة حالة جلسة واتساب
    api.session.getStatus().then((res) => setSessionStatus(res.status));
    const unsub = api.session.onStatusChanged((data) => setSessionStatus(data.status));

    return () => {
      unsub();
      unsubMsg();
    };
  }, []);

  const handleQuickEmergencyStop = async () => {
    if (confirm('تأكيد الإيقاف الطارئ للوكيل الذكي؟ سيتم تجميد الردود الآلية فوراً في كافة المحادثات.')) {
      await api.agent.emergencyStop();
      alert('تم تنفيذ الإيقاف الطارئ بنجاح وتحويل المحادثات للإشراف البشري.');
    }
  };

  const isFixedViewport = currentTab === 'inbox';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F6F7F9] dark:bg-[#0B0F19] text-[#1F2937] dark:text-[#F9FAFB] select-none transition-colors duration-200">
      {/* 1. القائمة الجانبية في اليمين (RTL Sidebar) */}
      <AppSidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenWizard={() => setShowWizardModal(true)}
      />

      {/* 2. منطقة المحتوى مع الشريط العلوي */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <AppHeader
          sessionStatus={sessionStatus}
          globalSearch={globalSearch}
          onGlobalSearchChange={setGlobalSearch}
          onEmergencyStop={handleQuickEmergencyStop}
          onOpenDataManager={() => setShowDataManagerModal(true)}
        />

        {/* 3. حاوية المحتوى بنظام التمرير المنفصل (Split-Scroll Strategy) */}
        <div
          className={`flex-1 min-h-0 ${
            isFixedViewport
              ? 'overflow-hidden p-4 md:p-5 flex flex-col h-full'
              : 'overflow-y-auto p-4 md:p-6'
          }`}
        >
          <ErrorBoundary>
            {currentTab === 'dashboard' && <DashboardView />}
            {currentTab === 'inbox' && <InboxView />}
            {currentTab === 'orders' && <OrdersPage />}
            {currentTab === 'products' && <ProductsPage />}
            {currentTab === 'agent' && <AgentView />}
            {currentTab === 'customers' && <CustomersPage />}
            {currentTab === 'analytics' && <AnalyticsPage />}
            {currentTab === 'channels' && <ChannelsPage />}
            {currentTab === 'settings' && <SettingsPage />}
          </ErrorBoundary>
        </div>
      </main>

      {/* معالج الإعداد التوجيهي (5 خطوات) */}
      <SetupWizardModal
        isOpen={showWizardModal}
        onClose={() => setShowWizardModal(false)}
      />

      {/* نافذة إدارة البيانات التجريبية والوهمية (توليد / حذف) */}
      <DataManagerModal
        isOpen={showDataManagerModal}
        onClose={() => setShowDataManagerModal(false)}
      />
    </div>
  );
};
