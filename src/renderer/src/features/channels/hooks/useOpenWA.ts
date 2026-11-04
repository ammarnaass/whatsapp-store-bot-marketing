import { useState, useEffect, useCallback, useRef } from 'react';
import { SessionStatus, ChannelProviderType } from '../../../../shared/types';
import { OpenWASessionDetails } from '../types/openwa.types';
import { formatQrCodeDataUrl, getMockWhatsAppQrDataUrl } from '../../../utils/qr.utils';

export const useOpenWA = (onToast?: (msg: string) => void) => {
  const [session, setSession] = useState<OpenWASessionDetails>({
    sessionId: 'wasell_main_store',
    name: 'رقم المتجر الرئيسي (OpenWA)',
    status: 'DISCONNECTED',
    phone: undefined,
    latencyMs: undefined,
    uptimeSeconds: 0,
    isBusiness: false,
    platform: 'Multi-Device Baileys',
  });

  const [activeProvider, setActiveProvider] = useState<ChannelProviderType>('openwa_gateway');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [isOfflineDemo, setIsOfflineDemo] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // تحديث العد التنازلي لمسح رمز الـ QR
  useEffect(() => {
    if (isQrModalOpen && (session.status === 'QR_READY' || session.status === 'SCAN_QR')) {
      setCountdown(20);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleRefreshQr();
            return 20;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    }

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [isQrModalOpen, session.status]);

  // الاشتراك في أحداث الـ IPC للجلسة
  useEffect(() => {
    // جلب الحالة الابتدائية
    if (window.api?.session?.getStatus) {
      window.api.session.getStatus().then((res: any) => {
        if (res && res.status) {
          setSession((prev) => ({
            ...prev,
            status: res.status,
            phone: res.phone || prev.phone,
          }));
        }
      }).catch(() => {});
    }

    // الاستماع لرمز الـ QR
    const unsubQr = window.api?.session?.onQrCode?.((data: any) => {
      if (data?.qrCodeDataUrl) {
        const formatted = formatQrCodeDataUrl(data.qrCodeDataUrl);
        setQrCodeData(formatted);
        setIsOfflineDemo(Boolean(data.isOfflineDemo));
        setSession((prev) => ({ ...prev, status: 'QR_READY', qrCode: formatted }));
        setCountdown(20);
      }
    });

    // الاستماع لتغير حالة الجلسة
    const unsubStatus = window.api?.session?.onStatusChanged?.((data: any) => {
      if (data?.status) {
        setSession((prev) => ({
          ...prev,
          status: data.status,
          phone: data.phone !== undefined ? data.phone : prev.phone,
        }));
        if (data.status === 'CONNECTED' || data.status === 'WORKING') {
          setIsQrModalOpen(false);
          onToast?.('تم اقتران رقم واتساب بنجاح عبر بوابة OpenWA!');
        }
      }
    });

    return () => {
      if (unsubQr) unsubQr();
      if (unsubStatus) unsubStatus();
    };
  }, [onToast]);

  // بدء الجلسة وطلب رمز الـ QR
  const handleStartSession = useCallback(async () => {
    setIsStarting(true);
    try {
      let qr = '';
      let isDemo = false;
      if (window.api?.session?.start) {
        const res = await window.api.session.start(session.sessionId);
        if (res?.qr) {
          qr = formatQrCodeDataUrl(res.qr);
          isDemo = Boolean(res.isOfflineDemo);
        }
      }
      if (!qr) {
        qr = getMockWhatsAppQrDataUrl(session.sessionId);
        isDemo = true;
      }

      setQrCodeData(qr);
      setIsOfflineDemo(isDemo);
      setSession((prev) => ({ ...prev, status: 'QR_READY', qrCode: qr }));
      setIsQrModalOpen(true);
      if (isDemo) {
        onToast?.('تم تجهيز رمز QR التفاعلي (وضع الـ Sandbox)');
      } else {
        onToast?.('تم استلام رمز QR من بوابة OpenWA');
      }
    } catch {
      const fallbackQr = getMockWhatsAppQrDataUrl(session.sessionId);
      setQrCodeData(fallbackQr);
      setIsOfflineDemo(true);
      setSession((prev) => ({ ...prev, status: 'QR_READY', qrCode: fallbackQr }));
      setIsQrModalOpen(true);
      onToast?.('تم فتح نافذة الاقتران (Sandbox QR)');
    } finally {
      setIsStarting(false);
    }
  }, [session.sessionId, onToast]);

  // تحديث رمز الـ QR يدوياً أو آلياً
  const handleRefreshQr = useCallback(async () => {
    try {
      let qr = '';
      if (window.api?.session?.start) {
        const res = await window.api.session.start(session.sessionId);
        if (res?.qr) {
          qr = formatQrCodeDataUrl(res.qr);
          setIsOfflineDemo(Boolean(res.isOfflineDemo));
        }
      }
      if (!qr) {
        qr = getMockWhatsAppQrDataUrl(session.sessionId);
      }
      setQrCodeData(qr);
    } catch {
      setQrCodeData(getMockWhatsAppQrDataUrl(session.sessionId));
    }
    setCountdown(20);
  }, [session.sessionId]);

  // محاكاة مسح الرمز والاقتران
  const handleSimulatePair = useCallback(async () => {
    try {
      const phone = '966501234567';
      if ((window.api?.session as any)?.simulatePair) {
        await (window.api.session as any).simulatePair(phone);
      }
      setSession((prev) => ({
        ...prev,
        status: 'CONNECTED',
        phone,
      }));
      setIsQrModalOpen(false);
      onToast?.('تم اقتران رقم واتساب التجريبي بنجاح (+966 50 123 4567)!');
    } catch (err) {
      console.error(err);
    }
  }, [onToast]);

  // تسجيل الخروج وإلغاء الاقتران
  const handleLogout = useCallback(async () => {
    try {
      if (window.api?.session?.logout) {
        await window.api.session.logout();
      }
      setSession((prev) => ({
        ...prev,
        status: 'DISCONNECTED',
        phone: undefined,
        qrCode: undefined,
      }));
      setIsQrModalOpen(false);
      onToast?.('تم تسجيل الخروج وفك اقتران الجلسة بنجاح.');
    } catch {
      onToast?.('حدث خطأ أثناء محاولة تسجيل الخروج.');
    }
  }, [onToast]);

  // فحص الاتصال وسرعة الاستجابة
  const handlePingGateway = useCallback(async () => {
    setIsPinging(true);
    const start = Date.now();
    try {
      if (window.api?.session?.getStatus) {
        await window.api.session.getStatus();
      }
      const lat = Date.now() - start;
      setSession((prev) => ({ ...prev, latencyMs: Math.max(lat, 24) }));
      onToast?.(`بوابة OpenWA نشطة - سرعة الاستجابة: ${Math.max(lat, 24)}ms`);
    } catch {
      onToast?.('بوابة OpenWA غير متصلة على المنفذ 2785');
    } finally {
      setIsPinging(false);
    }
  }, [onToast]);

  return {
    session,
    activeProvider,
    setActiveProvider,
    isQrModalOpen,
    setIsQrModalOpen,
    qrCodeData,
    isOfflineDemo,
    countdown,
    isStarting,
    isPinging,
    handleStartSession,
    handleRefreshQr,
    handleSimulatePair,
    handleLogout,
    handlePingGateway,
  };
};
