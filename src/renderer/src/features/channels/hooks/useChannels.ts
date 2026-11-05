import { useState, useCallback, useEffect } from 'react';
import { ChannelSubTab } from '../types/channels.types';
import { ChannelsService } from '../services/channels.service';
import { useDataStore } from '../../data-management';

export function useChannels() {
  const [activeSubtab, setActiveSubtab] = useState<ChannelSubTab>('api');
  const [wbaid, setWbaid] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState('http://127.0.0.1:3005/webhook/whatsapp');
  const [verifyToken, setVerifyToken] = useState('wasell_webhook_token_2026');
  const [activeProvider, setActiveProviderState] = useState<'openwa_gateway' | 'meta_cloud'>('openwa_gateway');
  const [isPingingWebhook, setIsPingingWebhook] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
  const templates = useDataStore((s) => s.templates);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((prev) => (prev === msg ? null : prev)), 3500);
  }, []);

  const loadConfig = useCallback(async () => {
    const config = await ChannelsService.getConfig();
    setWbaid(config.wbaid);
    setPhoneNumberId(config.phoneNumberId);
    setAccessToken(config.accessToken);
    setVerifyToken(config.verifyToken);
    setCallbackUrl(config.webhookUrl);
    setActiveProviderState(config.activeProvider);
    const logs = await ChannelsService.getWebhookLogs();
    setWebhookLogs(logs);
  }, []);

  useEffect(() => { loadConfig(); }, [loadConfig]);

  const handleProviderChange = useCallback(async (prov: 'openwa_gateway' | 'meta_cloud') => {
    setActiveProviderState(prov);
    await ChannelsService.setActiveProvider(prov);
    showToast(prov === 'meta_cloud' ? 'تم تفعيل بوابة WhatsApp Cloud API كقناة أساسية' : 'تم تفعيل بوابة OpenWA QR كقناة أساسية');
  }, [showToast]);

  const handleSaveSettings = useCallback(async () => {
    const res = await ChannelsService.saveConfig({
      phoneNumberId, wbaid, accessToken, verifyToken, webhookUrl: callbackUrl, activeProvider,
    });
    showToast(res.success ? 'تم حفظ إعدادات الربط السحابي في قاعدة البيانات بنجاح' : 'تعذر حفظ الإعدادات');
  }, [phoneNumberId, wbaid, accessToken, verifyToken, callbackUrl, activeProvider, showToast]);

  const handleTestCloudApi = useCallback(async () => {
    setIsTestingApi(true);
    try {
      const res = await ChannelsService.testCloudApi(phoneNumberId, accessToken);
      if (res.success) {
        showToast(`الاتصال بـ Meta سليم! (${res.data?.displayPhoneNumber} - ${res.data?.verifiedName})`);
      } else {
        showToast(res.error || 'فشل الاتصال بـ Meta Graph API');
      }
    } finally {
      setIsTestingApi(false);
    }
  }, [phoneNumberId, accessToken, showToast]);

  const handleWebhookPing = useCallback(async () => {
    setIsPingingWebhook(true);
    try {
      const res = await ChannelsService.testWebhook();
      showToast(res.success ? 'خادم الويب هوك المحلي يستمع بنجاح على المنفذ 3005' : 'تعذر الاتصال بخادم الويب هوك');
      const logs = await ChannelsService.getWebhookLogs();
      setWebhookLogs(logs);
    } finally {
      setIsPingingWebhook(false);
    }
  }, [showToast]);

  const copyToClipboard = useCallback((text: string, label: string) => {
    if (!text) { showToast(`لا توجد قيمة لنسخ ${label}`); return; }
    navigator.clipboard.writeText(text);
    showToast(`تم نسخ ${label} إلى الحافظة بنجاح`);
  }, [showToast]);

  return {
    activeSubtab, setActiveSubtab,
    wbaid, setWbaid,
    phoneNumberId, setPhoneNumberId,
    accessToken, setAccessToken,
    showAccessToken, setShowAccessToken,
    callbackUrl, setCallbackUrl,
    verifyToken, setVerifyToken,
    activeProvider, handleProviderChange,
    isPingingWebhook, isTestingApi,
    toastMessage, showToast, copyToClipboard,
    handleSaveSettings, handleTestCloudApi, handleWebhookPing,
    webhookLogs, templates,
  };
}
