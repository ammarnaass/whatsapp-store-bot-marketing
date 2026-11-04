import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useChannels } from '../hooks/useChannels';
import { useOpenWA } from '../hooks/useOpenWA';
import { ChannelsHeader } from '../components/ChannelsHeader';
import { ChannelsSubTabs } from '../components/ChannelsSubTabs';
import { ChannelsKpis } from '../components/ChannelsKpis';
import { ProviderSelectorCard } from '../components/ProviderSelectorCard';
import { OpenWACard } from '../components/OpenWACard';
import { OpenWAQrModal } from '../components/OpenWAQrModal';
import { WabaCredentialsCard } from '../components/WabaCredentialsCard';
import { WebhookConfigCard } from '../components/WebhookConfigCard';
import { LiveWebhookStreamCard } from '../components/LiveWebhookStreamCard';
import { HsmTemplatesCard } from '../components/HsmTemplatesCard';
import { SupportChannelsCard } from '../components/SupportChannelsCard';
import { AiChannelEngineCard } from '../components/AiChannelEngineCard';

export const ChannelsPage: React.FC = () => {
  const {
    activeSubtab,
    setActiveSubtab,
    wbaid,
    setWbaid,
    phoneNumberId,
    setPhoneNumberId,
    accessToken,
    setAccessToken,
    showAccessToken,
    setShowAccessToken,
    callbackUrl,
    verifyToken,
    setVerifyToken,
    isPingingWebhook,
    isPingingServer,
    smsFallbackActive,
    setSmsFallbackActive,
    instagramConnected,
    setInstagramConnected,
    toastMessage,
    showToast,
    copyToClipboard,
    handleTestPing,
    handleWebhookPing,
    handleTokenRegenerate,
    handleSaveSettings,
    webhookLogs,
    templates,
  } = useChannels();

  const {
    session: openwaSession,
    activeProvider,
    setActiveProvider,
    isQrModalOpen,
    setIsQrModalOpen,
    qrCodeData,
    isOfflineDemo,
    countdown,
    isStarting: isOpenwaStarting,
    isPinging: isOpenwaPinging,
    handleStartSession: handleOpenwaStartSession,
    handleRefreshQr: handleOpenwaRefreshQr,
    handleSimulatePair: handleOpenwaSimulatePair,
    handleLogout: handleOpenwaLogout,
    handlePingGateway: handleOpenwaPing,
  } = useOpenWA(showToast);

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#128C7E] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Actions */}
      <ChannelsHeader
        isPingingServer={isPingingServer}
        onTestPing={handleTestPing}
        onTokenRegenerate={handleTokenRegenerate}
        onSaveSettings={handleSaveSettings}
      />

      {/* 2. Sub-Navigation Tabs */}
      <ChannelsSubTabs activeSubtab={activeSubtab} onSubtabChange={setActiveSubtab} />

      {/* 3. Server Status & Cloud API Health KPIs */}
      <ChannelsKpis
        session={openwaSession}
        activeProvider={activeProvider}
        processedCount={webhookLogs.length}
        wbaid={wbaid}
        phoneNumberId={phoneNumberId}
      />

      {/* 4. Dual-Engine Architecture Selector */}
      <ProviderSelectorCard
        activeProvider={activeProvider}
        onProviderChange={(prov) => {
          setActiveProvider(prov);
          showToast(
            prov === 'openwa_gateway'
              ? 'تم تفعيل بوابة OpenWA المفتوحة (مجاني - QR)'
              : prov === 'meta_cloud'
              ? 'تم تفعيل سحابة Meta Cloud API الرسمية'
              : 'تم تفعيل المحرك الهجين الذكي'
          );
        }}
      />

      {/* 5. OpenWA Gateway QR Connection Card */}
      {(activeSubtab === 'api' || activeSubtab === 'openwa') && (
        <OpenWACard
          session={openwaSession}
          isStarting={isOpenwaStarting}
          isPinging={isOpenwaPinging}
          onOpenQrModal={handleOpenwaStartSession}
          onPing={handleOpenwaPing}
          onLogout={handleOpenwaLogout}
        />
      )}

      {/* 6. Meta Cloud Credentials & Webhooks Grid */}
      {(activeSubtab === 'api' || activeSubtab === 'compliance') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <WabaCredentialsCard
            wbaid={wbaid}
            phoneNumberId={phoneNumberId}
            accessToken={accessToken}
            showAccessToken={showAccessToken}
            onWbaidChange={setWbaid}
            onPhoneNumberIdChange={setPhoneNumberId}
            onAccessTokenChange={setAccessToken}
            onToggleShowAccessToken={() => setShowAccessToken(!showAccessToken)}
            onCopy={copyToClipboard}
          />

          <WebhookConfigCard
            callbackUrl={callbackUrl}
            verifyToken={verifyToken}
            onVerifyTokenChange={setVerifyToken}
            isPingingWebhook={isPingingWebhook}
            onWebhookPing={handleWebhookPing}
            onCopy={copyToClipboard}
          />
        </div>
      )}

      {/* 7. Live Webhook Event Stream */}
      {(activeSubtab === 'api' || activeSubtab === 'logs' || activeSubtab === 'openwa') && (
        <LiveWebhookStreamCard
          logs={webhookLogs}
          onRefresh={() => showToast('تم تحديث سجل استدعاءات خطافات الويب بنجاح')}
        />
      )}

      {/* 8. WhatsApp Approved HSM Templates */}
      {(activeSubtab === 'api' || activeSubtab === 'templates') && (
        <HsmTemplatesCard
          templates={templates}
          onSync={() => showToast('تمت مزامنة 14 قالباً مع حساب Meta Business بنجاح')}
          onCreateNew={() => showToast('تم فتح نافذة مصمم قوالب واتساب التفاعلية')}
        />
      )}

      {/* 9. Support Channels & Failover Routing */}
      {activeSubtab === 'api' && (
        <SupportChannelsCard
          smsFallbackActive={smsFallbackActive}
          onToggleSmsFallback={(active) => {
            setSmsFallbackActive(active);
            showToast(
              active ? 'تم تفعيل الرسائل النصية الاحتياطية' : 'تم تعطيل SMS Fallback'
            );
          }}
          instagramConnected={instagramConnected}
          onToggleInstagram={() => {
            setInstagramConnected(!instagramConnected);
            showToast(
              instagramConnected
                ? 'تم إلغاء ربط Instagram'
                : 'تم ربط حساب Instagram Business بنجاح'
            );
          }}
        />
      )}

      {/* 9b. AI Engine Channel Behavior & Anti-Ban Pacing */}
      {(activeSubtab === 'ai_engine' || activeSubtab === 'api') && (
        <AiChannelEngineCard onSave={() => showToast('تم حفظ قواعد سلوك الذكاء الاصطناعي للقنوات')} />
      )}

      {/* 10. OpenWA QR Code Pairing Modal */}
      <OpenWAQrModal
        isOpen={isQrModalOpen}
        qrCodeData={qrCodeData}
        countdown={countdown}
        isOfflineDemo={isOfflineDemo}
        onClose={() => setIsQrModalOpen(false)}
        onRefresh={handleOpenwaRefreshQr}
        onSimulatePair={handleOpenwaSimulatePair}
      />
    </div>
  );
};
