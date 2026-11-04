export interface StoreIdentity {
  storeNameAr: string;
  storeNameEn: string;
  storeUrl: string;
  currency: string;
  timezone: string;
  aiDialect: string;
  logoUrl: string;
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
  vipOrdersAlert: boolean;
  humanEscalationAlert: boolean;
  morningDigestAlert: boolean;
  adminWhatsAppNumber: string;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  localHostingPdpl: boolean;
  lastBackupDate: string;
  backupSizeBytes: string;
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
  | 'tab-all'
  | 'tab-identity'
  | 'tab-commerce'
  | 'tab-payments'
  | 'tab-shipping'
  | 'tab-alerts'
  | 'tab-security';
