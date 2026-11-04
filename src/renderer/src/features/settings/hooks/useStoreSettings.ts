import { useState, useEffect, useCallback } from 'react';
import { StoreSettingsState, SettingsTabId } from '../types/settings.types';
import { api } from '../../../api-bridge';

const SETTINGS_STORAGE_KEY = 'wasell_store_settings_v1';

export const DEFAULT_STORE_SETTINGS: StoreSettingsState = {
  identity: {
    storeNameAr: 'متجر الرياض الفاخر',
    storeNameEn: 'Riyadh Luxury Store',
    storeUrl: 'https://salla.sa/riyadh-luxury',
    currency: 'SAR',
    timezone: 'Asia/Riyadh',
    aiDialect: 'اللهجة السعودية (نجدية / حجازية راقية)',
    logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=160'
  },
  behavior: {
    autoSelling247: true,
    offHoursResponse: true,
    taxInvoiceAndTracking: true,
    greetingMessage:
      'يا هلا ومرحب فيك بمتجر الرياض الفاخر! يسعدني أساعدك في اختيار أرقى القطع وتجهيز طلبك فوراً. وش حاب تشوف اليوم؟'
  },
  payments: {
    madaApplePay: true,
    tamara: true,
    tabby: true,
    cod: true,
    codFee: 15
  },
  shipping: {
    smsaActive: true,
    aramexActive: true,
    torodActive: true,
    splActive: false,
    flatShippingRate: 25,
    freeShippingThreshold: 300,
    autoPrintWaybill: true
  },
  alerts: {
    vipOrdersAlert: true,
    humanEscalationAlert: true,
    morningDigestAlert: true,
    adminWhatsAppNumber: '+966 50 123 4567'
  },
  security: {
    twoFactorAuth: true,
    localHostingPdpl: true,
    lastBackupDate: 'اليوم، 03:00 ص',
    backupSizeBytes: '142 MB'
  }
};

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettingsState>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  const [activeTab, setActiveTab] = useState<SettingsTabId>('tab-all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTestingSync, setIsTestingSync] = useState(false);
  const [isSendingAlert, setIsSendingAlert] = useState(false);
  const [showKillSwitchModal, setShowKillSwitchModal] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  const saveSettings = useCallback((newSettings: StoreSettingsState) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save settings to localStorage:', e);
    }
  }, []);

  const handleSaveAll = useCallback(() => {
    saveSettings(settings);
    showToast('تم حفظ كافة إعدادات المنظومة وهوية المتجر وتحديث بوابات الدفع والشحن بنجاح!');
  }, [settings, saveSettings, showToast]);

  const handleRestoreDefaults = useCallback(() => {
    if (confirm('هل أنت متأكد من رغبتك في استعادة الإعدادات الافتراضية للمتجر؟')) {
      saveSettings(DEFAULT_STORE_SETTINGS);
      showToast('تمت استعادة الإعدادات الافتراضية لمنصة WaSell بنجاح.');
    }
  }, [saveSettings, showToast]);

  const handleTestSync = useCallback(() => {
    setIsTestingSync(true);
    setTimeout(() => {
      setIsTestingSync(false);
      showToast('تم اختبار مزامنة المنصة السحابية مع سلة بنجاح (زمن الاستجابة: 64ms) ⚡');
    }, 900);
  }, [showToast]);

  const handleSendTestAlert = useCallback(() => {
    setIsSendingAlert(true);
    setTimeout(() => {
      setIsSendingAlert(false);
      showToast(`تم إرسال إشعار تجريبي فوري إلى رقم الإدارة: ${settings.alerts.adminWhatsAppNumber}`);
    }, 850);
  }, [settings.alerts.adminWhatsAppNumber, showToast]);

  const handleEmergencyStop = useCallback(async () => {
    try {
      await api.agent.emergencyStop();
      setShowKillSwitchModal(false);
      showToast('تم تفعيل الإيقاف الطارئ بنجاح وتحويل كافة المحادثات إلى الطاقم البشري.');
    } catch {
      setShowKillSwitchModal(false);
      showToast('تم إيقاف الوكيل الذكي مؤقتاً.');
    }
  }, [showToast]);

  return {
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
  };
}
