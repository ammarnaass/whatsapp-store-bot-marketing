import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useStoreSettings } from '../hooks/useStoreSettings';
import {
  SettingsHeader, SettingsNavBar, StoreIdentitySection, WhatsAppBehaviorSection,
  AdminAlertsSection, SecurityBackupSection, KillSwitchModal, AccountManagementSection
} from '../components';
import { AppearanceSettingsSection } from '../../customization';

export const SettingsPage: React.FC = () => {
  const {
    settings, setSettings, activeTab, setActiveTab, toastMessage,
    isTestingSync, isSendingAlert, showKillSwitchModal, setShowKillSwitchModal,
    handleSaveAll, handleRestoreDefaults, handleTestSync, handleSendTestAlert, handleEmergencyStop
  } = useStoreSettings();

  const handleDownloadBackup = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `wasell_store_backup_${new Date().toISOString().slice(0, 10)}.json`
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full space-y-6 animate-in fade-in duration-200">
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#128C7E] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Toolbar */}
      <SettingsHeader onSave={handleSaveAll} onRestore={handleRestoreDefaults} onEmergencyStop={() => setShowKillSwitchModal(true)} />

      {/* 2. Navigation Tabs Bar */}
      <SettingsNavBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. Active Settings Tab Content */}
      <div className="w-full">
        {activeTab === 'tab-account' && <AccountManagementSection />}

        {activeTab === 'tab-appearance' && <AppearanceSettingsSection />}

        {activeTab === 'tab-identity' && (
          <StoreIdentitySection
            identity={settings.identity}
            onChange={(identity) => setSettings({ ...settings, identity })}
            onTestSync={handleTestSync}
            isTestingSync={isTestingSync}
          />
        )}

        {activeTab === 'tab-commerce' && (
          <WhatsAppBehaviorSection
            behavior={settings.behavior}
            onChange={(behavior) => setSettings({ ...settings, behavior })}
          />
        )}

        {activeTab === 'tab-alerts' && (
          <AdminAlertsSection
            alerts={settings.alerts}
            onChange={(alerts) => setSettings({ ...settings, alerts })}
            onSendTestAlert={handleSendTestAlert}
            isSendingAlert={isSendingAlert}
          />
        )}

        {activeTab === 'tab-security' && (
          <SecurityBackupSection
            security={settings.security}
            onChange={(security) => setSettings({ ...settings, security })}
            onDownloadBackup={handleDownloadBackup}
          />
        )}
      </div>

      <KillSwitchModal isOpen={showKillSwitchModal} onClose={() => setShowKillSwitchModal(false)} onConfirm={handleEmergencyStop} />
    </div>
  );
};
