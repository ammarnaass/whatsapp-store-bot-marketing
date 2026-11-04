export interface StoreIdentity {
  storeNameAr: string;
  storeNameEn: string;
  storeSlogan?: string;
  storeDescription?: string;
  logoUrl: string;

  commercialRegistration?: string;
  taxNumber?: string;
  sbcLicense?: string;
  showTaxOnInvoice: boolean;

  supportPhone?: string;
  supportEmail?: string;
  country: string;
  city: string;
  address?: string;
  storeUrl: string;

  currency: string;
  timezone: string;
  aiDialect: string;

  socialLinks?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    snapchat?: string;
  };
}

export interface WhatsAppBehavior {
  autoSelling247: boolean;
  offHoursResponse: boolean;
  taxInvoiceAndTracking: boolean;
  greetingMessage: string;
}

export interface PaymentGatewaySettings {
  madaApplePay: boolean;
  tamara: boolean;
  tabby: boolean;
  cod: boolean;
  codFee: number;
}

export interface ShippingSettings {
  smsaActive: boolean;
  aramexActive: boolean;
  torodActive: boolean;
  splActive: boolean;
  flatShippingRate: number;
  freeShippingThreshold: number;
  autoPrintWaybill: boolean;
}

export interface AdminAlertSettings {
  adminWhatsAppNumber: string;
  backupWhatsAppNumber?: string;
  adminEmail?: string;
  enableDesktopPush: boolean;
  enableNotificationSound: boolean;

  vipOrdersAlert: boolean;
  vipOrderThreshold: number;
  abandonedCartAlert: boolean;
  lowStockAlert: boolean;
  lowStockThreshold: number;
  newOrderAlert: boolean;

  humanEscalationAlert: boolean;
  channelDisconnectAlert: boolean;

  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  bypassQuietForCritical: boolean;
  morningDigestAlert: boolean;
  morningDigestTime: string;
  eveningDigestAlert: boolean;
}

export interface BackupRecord {
  id: string;
  filename: string;
  sizeBytes: number;
  sizeFormatted: string;
  createdAt: string;
  type: 'manual' | 'scheduled';
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  localHostingPdpl: boolean;
  lastBackupDate: string;
  backupSizeBytes: string;
  autoBackupEnabled: boolean;
  autoBackupSchedule: 'daily' | 'weekly';
  autoBackupRetentionCopies: number;
  sessionTimeoutMinutes: number;
  bruteForceProtection: boolean;
}

export interface StoreSettingsState {
  identity: StoreIdentity;
  behavior: WhatsAppBehavior;
  payments: PaymentGatewaySettings;
  shipping: ShippingSettings;
  alerts: AdminAlertSettings;
  security: SecuritySettings;
}

export type SettingsTabId =
  | 'tab-account'
  | 'tab-appearance'
  | 'tab-identity'
  | 'tab-commerce'
  | 'tab-alerts'
  | 'tab-security';
