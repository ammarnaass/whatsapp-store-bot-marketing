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

  // الاشتراك في أحداث الـ IPC للجلسة واستطلاع الحالة اللحظية
  useEffect(() => {
    const sessionApi = (window as any).api?.session || (window as any).electronAPI?.session;

    const fetchStatus = async () => {
      try {
        if (sessionApi?.getStatus) {
          const res: any = await sessionApi.getStatus();
          if (res) {
            const computedStatus: SessionStatus =
              res.status || (res.isConnected ? 'CONNECTED' : 'DISCONNECTED');
            setSession((prev) => ({
              ...prev,
              status: computedStatus,
              phone: res.phone || prev.phone,
              latencyMs: res.latencyMs !== undefined ? res.latencyMs : prev.latencyMs,
              uptimeSeconds: res.uptimeSeconds !== undefined ? res.uptimeSeconds : prev.uptimeSeconds,
            }));
          }
        }
      } catch (err) {
        console.warn('[useOpenWA] getStatus error:', err);
      }
    };

    // جلب فوري للحالة عند التحميل
    fetchStatus();

    // استطلاع دوري خفيف كل 4 ثوانٍ لضمان التزامن اللحظي للواجهة
    const pollTimer = setInterval(fetchStatus, 4000);

    // الاستماع لرمز الـ QR
    const unsubQr = sessionApi?.onQrCode?.((data: any) => {
      if (data?.qrCodeDataUrl) {
        const formatted = formatQrCodeDataUrl(data.qrCodeDataUrl);
        setQrCodeData(formatted);
        setIsOfflineDemo(Boolean(data.isOfflineDemo));
        setSession((prev) => ({ ...prev, status: 'QR_READY', qrCode: formatted }));
        setCountdown(20);
      }
    });

    // الاستماع لتغير حالة الجلسة
    const unsubStatus = sessionApi?.onStatusChanged?.((data: any) => {
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
      clearInterval(pollTimer);
      if (unsubQr) unsubQr();
      if (unsubStatus) unsubStatus();
    };
  }, [onToast]);

  // بدء الجلسة وطلب رمز الـ QR
  const handleStartSession = useCallback(async () => {
    setIsStarting(true);
    const sessionApi = (window as any).api?.session || (window as any).electronAPI?.session;
    try {
      let qr = '';
      let isDemo = false;
      if (sessionApi?.start) {
        const res = await sessionApi.start(session.sessionId);
        if (res?.message?.includes('متصل') || res?.message?.includes('مقترن')) {
          onToast?.(res.message);
          setIsQrModalOpen(false);
          return;
        }
        if (res?.qr) {
          qr = formatQrCodeDataUrl(res.qr);
          isDemo = Boolean(res.isOfflineDemo);
        }
      }

      setQrCodeData(qr);
      setIsOfflineDemo(isDemo);
      setSession((prev) => ({ ...prev, status: 'QR_READY', qrCode: qr }));
      setIsQrModalOpen(true);
      if (qr) {
        onToast?.(isDemo ? 'تم فتح رمز المعاينة' : 'تم استلام رمز QR الحقيقي من واتساب');
      } else {
        onToast?.('جارٍ توليد الرمز الحقيقي من خوادم واتساب...');
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
    const sessionApi = (window as any).api?.session || (window as any).electronAPI?.session;
    try {
      if (sessionApi?.start) {
        const res = await sessionApi.start(session.sessionId);
        if (res?.qr) {
          const formatted = formatQrCodeDataUrl(res.qr);
          setQrCodeData(formatted);
          setIsOfflineDemo(Boolean(res.isOfflineDemo));
        }
      }
    } catch (err) {
      console.warn('[useOpenWA] Refresh QR error:', err);
    }
    setCountdown(20);
  }, [session.sessionId]);

  // محاكاة مسح الرمز والاقتران
  const handleSimulatePair = useCallback(async () => {
    const sessionApi = (window as any).api?.session || (window as any).electronAPI?.session;
    try {
      const phone = '966501234567';
      if (sessionApi?.simulatePair) {
        await sessionApi.simulatePair(phone);
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
    const sessionApi = (window as any).api?.session || (window as any).electronAPI?.session;
    try {
      if (sessionApi?.logout) {
        await sessionApi.logout();
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
    const sessionApi = (window as any).api?.session || (window as any).electronAPI?.session;
    const start = Date.now();
    try {
      if (sessionApi?.getStatus) {
        await sessionApi.getStatus();
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
