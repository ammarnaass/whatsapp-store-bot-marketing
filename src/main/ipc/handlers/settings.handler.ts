import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';

export const DEFAULT_DATABASE_STORE_SETTINGS = {
  identity: {
    storeNameAr: 'متجر وصّل التجاري الذكي',
    storeNameEn: 'WaSell Smart Commerce Store',
    storeSlogan: 'وجهتك الأولى للتسوق الذكي والتوصيل الفوري عبر واتساب',
    storeDescription: 'متجر سعودي رائد يقدم أفضل المنتجات العصرية مع خدمة عملاء ذكية ومؤتمتة على مدار الساعة.',
    logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=160',
    commercialRegistration: '1010789456',
    taxNumber: '310245896300003',
    sbcLicense: 'SBC-0009842',
    showTaxOnInvoice: true,
    supportPhone: '+966 50 123 4567',
    supportEmail: 'support@wasell.store',
    country: 'المملكة العربية السعودية',
    city: 'الرياض',
    address: 'طريق الملك فهد، حي الصحافة',
    storeUrl: 'https://wasell.store',
    currency: 'SAR',
    timezone: 'Asia/Riyadh',
    aiDialect: 'اللهجة السعودية (نجدية / حجازية راقية)',
    socialLinks: {
      instagram: 'https://instagram.com/wasell.store',
      twitter: 'https://x.com/wasell_store',
      tiktok: 'https://tiktok.com/@wasell.store',
      snapchat: 'https://snapchat.com/add/wasell.store',
    },
  },
  behavior: {
    autoSelling247: true,
    offHoursResponse: true,
    taxInvoiceAndTracking: true,
    greetingMessage:
      'يا هلا ومرحب فيك بمتجرنا الذكي! يسعدني أساعدك في اختيار أرقى المنتجات وتجهيز طلبك وتوصيله فوراً عبر واتساب. وش حاب تشوف اليوم؟',
  },
  payments: {
    madaApplePay: true,
    tamara: true,
    tabby: true,
    cod: true,
    codFee: 15,
  },
  shipping: {
    smsaActive: true,
    aramexActive: true,
    torodActive: true,
    splActive: false,
    flatShippingRate: 25,
    freeShippingThreshold: 300,
    autoPrintWaybill: true,
  },
  alerts: {
    adminWhatsAppNumber: '+213555220620',
    backupWhatsAppNumber: '+966559876543',
    adminEmail: 'admin@wasell.store',
    enableDesktopPush: true,
    enableNotificationSound: true,
    vipOrdersAlert: true,
    vipOrderThreshold: 1000,
    abandonedCartAlert: true,
    lowStockAlert: true,
    lowStockThreshold: 5,
    newOrderAlert: true,
    humanEscalationAlert: true,
    channelDisconnectAlert: true,
    quietHoursEnabled: false,
    quietHoursStart: '00:00',
    quietHoursEnd: '07:00',
    bypassQuietForCritical: true,
    morningDigestAlert: true,
    morningDigestTime: '09:00',
    eveningDigestAlert: true,
  },
  security: {
    twoFactorAuth: true,
    localHostingPdpl: true,
    lastBackupDate: 'اليوم، محفوظ محلياً',
    backupSizeBytes: 'قاعدة بيانات SQLite محلية نشطة',
    autoBackupEnabled: true,
    autoBackupSchedule: 'daily',
    autoBackupRetentionCopies: 7,
    sessionTimeoutMinutes: 30,
    bruteForceProtection: true,
  },
};

export function registerSettingsHandlers(db: Database.Database): void {
  // جلب كافة إعدادات المتجر والتطبيق من SQLite
  ipcMain.handle(IPC_CHANNELS.SETTINGS_GET_STORE_SETTINGS, async () => {
    try {
      const row = db.prepare("SELECT value FROM store_settings WHERE key = 'main_config'").get() as any;
      if (row?.value) {
        return JSON.parse(row.value);
      }
      // إدراج وحفظ الإعدادات الافتراضية لأول مرة
      const defaultStr = JSON.stringify(DEFAULT_DATABASE_STORE_SETTINGS);
      db.prepare(`
        INSERT INTO store_settings (key, value) VALUES ('main_config', ?)
        ON CONFLICT(key) DO UPDATE SET value = ?
      `).run(defaultStr, defaultStr);
      return DEFAULT_DATABASE_STORE_SETTINGS;
    } catch (err) {
      console.error('[SettingsHandler] Error fetching store settings:', err);
      return DEFAULT_DATABASE_STORE_SETTINGS;
    }
  });

  // حفظ وتحديث إعدادات المتجر بالكامل في SQLite
  ipcMain.handle(IPC_CHANNELS.SETTINGS_SAVE_STORE_SETTINGS, async (_event, settings) => {
    try {
      const jsonStr = JSON.stringify(settings);
      db.prepare(`
        INSERT INTO store_settings (key, value, updated_at)
        VALUES ('main_config', ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP
      `).run(jsonStr, jsonStr);
      return { success: true };
    } catch (err: any) {
      console.error('[SettingsHandler] Error saving store settings:', err);
      return { success: false, error: err.message };
    }
  });

  // إعادة ضبط الإعدادات الافتراضية
  ipcMain.handle(IPC_CHANNELS.SETTINGS_RESET_DEFAULTS, async () => {
    try {
      const defaultStr = JSON.stringify(DEFAULT_DATABASE_STORE_SETTINGS);
      db.prepare(`
        INSERT INTO store_settings (key, value, updated_at)
        VALUES ('main_config', ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP
      `).run(defaultStr, defaultStr);
      return { success: true, settings: DEFAULT_DATABASE_STORE_SETTINGS };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });
}

