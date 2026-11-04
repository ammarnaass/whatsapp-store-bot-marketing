import React from 'react';
import { CheckCircle2, QrCode, WifiOff, AlertTriangle } from 'lucide-react';
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

      {/* FR-79: Session Status Live Indicator & Disconnect/Scan Warning Banner */}
      {(!openwaSession || (openwaSession.status !== 'CONNECTED' && openwaSession.status !== 'WORKING')) && (
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-200 ${
            openwaSession?.status === 'QR_READY' || openwaSession?.status === 'SCAN_QR'
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}
        >
          <div className="flex items-start sm:items-center gap-3">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                openwaSession?.status === 'QR_READY' || openwaSession?.status === 'SCAN_QR'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}
            >
              {openwaSession?.status === 'QR_READY' || openwaSession?.status === 'SCAN_QR' ? (
                <QrCode className="w-5 h-5 animate-pulse" />
              ) : (
                <WifiOff className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm">
                  {openwaSession?.status === 'QR_READY' || openwaSession?.status === 'SCAN_QR'
                    ? 'تنبيه الجلسة (FR-79): مطلوب مسح رمز QR لربط واتساب'
                    : 'تنبيه انقطاع الاتصال (FR-79): جلسة واتساب غير متصلة حالياً'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80 dark:bg-black/30 border border-current">
                  الحالة: {openwaSession?.status || 'DISCONNECTED'}
                </span>
              </div>
              <p className="text-xs opacity-90 mt-0.5">
                {openwaSession?.status === 'QR_READY' || openwaSession?.status === 'SCAN_QR'
                  ? 'قم بمسح رمز الاستجابة السريعة لمزامنة جلسة المتجر وتفعيل استقبال رسائل العملاء وردود الوكيل الذكي.'
                  : 'توقف إرسال واستقبال الرسائل التلقائية لمتجرك حتى تتم إعادة تشغيل الجلسة بنجاح.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenwaStartSession}
            className="h-[38px] px-4 rounded-xl text-xs font-bold bg-[#128C7E] hover:bg-[#0e7064] text-white flex items-center gap-2 shrink-0 transition-all shadow-sm cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>
              {openwaSession?.status === 'QR_READY' || openwaSession?.status === 'SCAN_QR'
                ? 'عرض رمز QR للمسح'
                : 'إعادة الاتصال / مسح QR'}
            </span>
          </button>
        </div>
      )}

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
