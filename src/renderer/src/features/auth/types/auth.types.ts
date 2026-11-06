export type UserRole = 'owner' | 'admin' | 'sales' | 'inventory' | 'support';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions?: string[];
  created_by?: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'suspended';
  last_login_at?: string;
  created_at?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  sessionToken: string;
  deviceName?: string;
  ipAddress?: string;
  expiresAt: string;
  isActive: boolean;
  lastActiveAt?: string;
  createdAt: string;
  isCurrent?: boolean;
}

export interface PermissionOption {
  id: string;
  label: string;
  description: string;
}

export const AVAILABLE_PERMISSIONS: PermissionOption[] = [
  { id: 'inbox', label: 'المحادثات وصندوق الوارد', description: 'الرد على رسائل واتساب والتدخل البشري' },
  { id: 'catalog', label: 'المنتجات والكتالوج', description: 'استعراض وإدارة المنتجات والأسعار والتصنيفات' },
  { id: 'inventory', label: 'المخزون والتراخيص', description: 'تعديل الكميات، سجلات الجرد، ومفاتيح التراخيص' },
  { id: 'orders', label: 'الطلبات والمبيعات', description: 'متابعة الطلبات، تحديث الحالات، والطلبات اليدوية' },
  { id: 'shipping', label: 'الشحن واللوجستيات', description: 'بوليصات الشحن، التتبع، ومناطق التوصيل' },
  { id: 'customers', label: 'العملاء وجهات الاتصال', description: 'بيانات العملاء، الملاحظات، والتصنيفات' },
  { id: 'knowledge', label: 'قاعدة المعرفة والذكاء', description: 'كتالوج المصادر وإجابات الوكيل الذكي' },
  { id: 'analytics', label: 'التحليلات والأرباح', description: 'مؤشرات الأداء، قمع التحويل، والتقارير المالية' },
  { id: 'campaigns', label: 'الحملات التسويقية', description: 'الرسائل الجماعية والعروض الترويجية' },
  { id: 'settings', label: 'إعدادات المنظومة', description: 'هوية المتجر، إعدادات الربط، والنسخ الاحتياطي' },
];

export const ROLE_LABELS: Record<UserRole, { label: string; badgeColor: string; description: string }> = {
  owner: {
    label: 'مالك المتجر',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    description: 'صلاحيات كاملة وغير مقيدة على المنظومة',
  },
  admin: {
    label: 'مدير العمليات',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
    description: 'إدارة العمليات والمنتجات والمخزون',
  },
  sales: {
    label: 'مسؤول مبيعات',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    description: 'استقبال المحادثات وتأكيد الطلبات',
  },
  inventory: {
    label: 'أمين المستودع',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300',
    description: 'إدارة المخزون، التراخيص، والشحن',
  },
  support: {
    label: 'خدمة عملاء',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
    description: 'الرد على الاستفسارات وقاعدة المعرفة',
  },
};
