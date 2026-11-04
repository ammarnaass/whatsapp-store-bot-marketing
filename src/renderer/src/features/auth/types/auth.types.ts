export type UserRole = 'owner' | 'admin' | 'sales' | 'support';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  status: 'active' | 'suspended';
  last_login_at?: string;
  created_at?: string;
}

export const ROLE_LABELS: Record<UserRole, { label: string; badgeColor: string; description: string }> = {
  owner: {
    label: 'مالك المتجر',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    description: 'صلاحيات كاملة وغير مقيدة على المنظومة',
  },
  admin: {
    label: 'مدير العمليات',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
    description: 'إدارة الطلبات، المنتجات، والوكيل الذكي',
  },
  sales: {
    label: 'مسؤول مبيعات',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    description: 'استقبال المحادثات وتأكيد الطلبات',
  },
  support: {
    label: 'خدمة عملاء',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
    description: 'الرد على الاستفسارات وحل الشكاوى',
  },
};

