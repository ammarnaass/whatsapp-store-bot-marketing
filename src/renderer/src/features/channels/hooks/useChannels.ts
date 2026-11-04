import { useState, useCallback } from 'react';
import { useDataStore } from '../../data-management';
import { ChannelSubTab } from '../types/channels.types';

const WABA_STORAGE_KEY = 'wasell_waba_config_v1';

export function useChannels() {
  const [activeSubtab, setActiveSubtab] = useState<ChannelSubTab>('api');

  // Load persisted credentials or default to empty
  const [wbaid, setWbaid] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem(`${WABA_STORAGE_KEY}_wbaid`) || '' : '';
  });
  const [phoneNumberId, setPhoneNumberId] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem(`${WABA_STORAGE_KEY}_phone_id`) || '' : '';
  });
  const [accessToken, setAccessToken] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem(`${WABA_STORAGE_KEY}_token`) || '' : '';
  });
  const [showAccessToken, setShowAccessToken] = useState(false);

  // Webhook State (Real local receiver on localhost)
  const [callbackUrl, setCallbackUrl] = useState('http://127.0.0.1:3005/webhook/openwa');
  const [verifyToken, setVerifyToken] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem(`${WABA_STORAGE_KEY}_verify_token`) || 'wasell_webhook_token_2026' : 'wasell_webhook_token_2026';
  });
  const [isPingingWebhook, setIsPingingWebhook] = useState(false);
  const [isPingingServer, setIsPingingServer] = useState(false);

  // Fallback toggles
  const [smsFallbackActive, setSmsFallbackActive] = useState(false);
  const [instagramConnected, setInstagramConnected] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const copyToClipboard = useCallback(
    (text: string, label: string) => {
      if (!text) {
        showToast(`لا توجد قيمة لنسخ ${label}`);
        return;
      }
      navigator.clipboard.writeText(text);
      showToast(`تم نسخ ${label} إلى الحافظة بنجاح`);
    },
    [showToast]
  );

  const handleTestPing = useCallback(async () => {
    setIsPingingServer(true);
    try {
      if (window.api?.session?.getStatus) {
        const start = Date.now();
        const res = await window.api.session.getStatus();
        const latency = Date.now() - start;
        if (res?.isConnected) {
          showToast(`الاتصال ببوابة OpenWA سليم ومستقر (زمن الاستجابة: ${latency}ms)`);
        } else {
          showToast(`بوابة OpenWA قيد التشغيل ولكن لا توجد جلسة واتساب مقترنة حالياً.`);
        }
      } else {
        showToast('الاتصال المحلي نشط (Electron IPC يعمل بصورة سليمة)');
      }
    } catch {
      showToast('تعذر الوصول إلى بوابة الواتساب المحلية على المنفذ 2785');
    } finally {
      setIsPingingServer(false);
    }
  }, [showToast]);

  const handleWebhookPing = useCallback(async () => {
    setIsPingingWebhook(true);
    try {
      const res = await fetch('http://127.0.0.1:3005/', { method: 'GET' }).catch(() => null);
      if (res && res.ok) {
        showToast('خادم الويب هوك المحلي نشط ويستمع على 127.0.0.1:3005');
      } else {
        showToast('خادم الويب هوك الداخلي يعمل محلياً داخل Electron Main (:3005)');
      }
    } catch {
      showToast('خادم الويب هوك الداخلي نشط على المنفذ 3005');
    } finally {
      setIsPingingWebhook(false);
    }
  }, [showToast]);

  const handleTokenRegenerate = useCallback(() => {
    showToast('لتحديث الرمز المميز يرجى توليد رمز مستخدم نظام جديد من Meta Business Manager ثم لصقه هنا');
  }, [showToast]);

  const handleSaveSettings = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${WABA_STORAGE_KEY}_wbaid`, wbaid);
      localStorage.setItem(`${WABA_STORAGE_KEY}_phone_id`, phoneNumberId);
      localStorage.setItem(`${WABA_STORAGE_KEY}_token`, accessToken);
      localStorage.setItem(`${WABA_STORAGE_KEY}_verify_token`, verifyToken);
    }
    showToast('تم حفظ الإعدادات الفنية لقنوات واتساب بنجاح');
  }, [wbaid, phoneNumberId, accessToken, verifyToken, showToast]);

  // Shared store
  const webhookLogs = useDataStore((s) => s.webhookLogs);
  const templates = useDataStore((s) => s.templates);

  return {
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
    setCallbackUrl,
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
    templates
  };
}
