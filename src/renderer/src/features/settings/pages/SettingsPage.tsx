import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useStoreSettings } from '../hooks/useStoreSettings';
import { SettingsHeader } from '../components/SettingsHeader';
import { SettingsNavBar } from '../components/SettingsNavBar';
import { StoreIdentitySection } from '../components/StoreIdentitySection';
import { WhatsAppBehaviorSection } from '../components/WhatsAppBehaviorSection';
import { PaymentGatewaysSection } from '../components/PaymentGatewaysSection';
import { SmartShippingSection } from '../components/SmartShippingSection';
import { AdminAlertsSection } from '../components/AdminAlertsSection';
import { SecurityBackupSection } from '../components/SecurityBackupSection';
import { KillSwitchModal } from '../components/KillSwitchModal';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    setSettings,
    activeTab,
    setActiveTab,
    toastMessage,
    isTestingSync,
    isSendingAlert,
    showKillSwitchModal,
    setShowKillSwitchModal,
    handleSaveAll,
    handleRestoreDefaults,
    handleTestSync,
    handleSendTestAlert,
    handleEmergencyStop
  } = useStoreSettings();

  const isVisible = (tabId: string) => activeTab === 'tab-all' || activeTab === tabId;

  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `wasell_store_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col w-full space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#128C7E] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Toolbar */}
      <SettingsHeader
        onSave={handleSaveAll}
        onRestore={handleRestoreDefaults}
        onEmergencyStop={() => setShowKillSwitchModal(true)}
      />

      {/* 2. Navigation Tabs Bar */}
      <SettingsNavBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. Bento Grid Settings Layout per Stitch Screen 10 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* SECTION 1: Brand & Core Store Identity (Span 7) */}
        {isVisible('tab-identity') && (
          <div className={activeTab === 'tab-all' ? 'xl:col-span-7' : 'xl:col-span-12'}>
            <StoreIdentitySection
              identity={settings.identity}
              onChange={(identity) => setSettings({ ...settings, identity })}
              onTestSync={handleTestSync}
              isTestingSync={isTestingSync}
            />
          </div>
        )}

        {/* SECTION 2: WhatsApp Experience Behavior (Span 5) */}
        {isVisible('tab-commerce') && (
          <div className={activeTab === 'tab-all' ? 'xl:col-span-5' : 'xl:col-span-12'}>
            <WhatsAppBehaviorSection
              behavior={settings.behavior}
              onChange={(behavior) => setSettings({ ...settings, behavior })}
            />
          </div>
        )}

        {/* SECTION 3: Payment Gateways & Rapid Checkout (Span 6) */}
        {isVisible('tab-payments') && (
          <div className={activeTab === 'tab-all' ? 'xl:col-span-6' : 'xl:col-span-12'}>
            <PaymentGatewaysSection
              payments={settings.payments}
              onChange={(payments) => setSettings({ ...settings, payments })}
            />
          </div>
        )}

        {/* SECTION 4: Smart Shipping & Logistics (Span 6) */}
        {isVisible('tab-shipping') && (
          <div className={activeTab === 'tab-all' ? 'xl:col-span-6' : 'xl:col-span-12'}>
            <SmartShippingSection
              shipping={settings.shipping}
              onChange={(shipping) => setSettings({ ...settings, shipping })}
            />
          </div>
        )}

        {/* SECTION 5: System Notifications & Admin Alerts (Span 6) */}
        {isVisible('tab-alerts') && (
          <div className={activeTab === 'tab-all' ? 'xl:col-span-6' : 'xl:col-span-12'}>
            <AdminAlertsSection
              alerts={settings.alerts}
              onChange={(alerts) => setSettings({ ...settings, alerts })}
              onSendTestAlert={handleSendTestAlert}
              isSendingAlert={isSendingAlert}
            />
          </div>
        )}

        {/* SECTION 6: Security, PDPL & Encrypted Backup (Span 6) */}
        {isVisible('tab-security') && (
          <div className={activeTab === 'tab-all' ? 'xl:col-span-6' : 'xl:col-span-12'}>
            <SecurityBackupSection
              security={settings.security}
              onChange={(security) => setSettings({ ...settings, security })}
              onDownloadBackup={handleDownloadBackup}
            />
          </div>
        )}
      </div>

      {/* Emergency Kill Switch Modal */}
      <KillSwitchModal
        isOpen={showKillSwitchModal}
        onClose={() => setShowKillSwitchModal(false)}
        onConfirm={handleEmergencyStop}
      />
    </div>
  );
};
