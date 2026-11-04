import { ShipmentStatus } from '../types/shipping.types';

export const CARRIERS_LIST = [
  { id: 'smsa', name: 'SMSA Express', labelAr: 'سمسا إكسبريس', color: '#E11D48' },
  { id: 'aramex', name: 'Aramex', labelAr: 'أرامكس', color: '#EA580C' },
  { id: 'spl', name: 'SPL (سبل)', labelAr: 'البريد السعودي (سبل)', color: '#0284C7' },
  { id: 'torod', name: 'Torod', labelAr: 'طرود اللوجستية', color: '#7C3AED' },
  { id: 'fleet', name: 'الأسطول الخاص', labelAr: 'توصيل عبر متجرنا', color: '#059669' },
];

export const STATUS_META: Record<
  ShipmentStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  PREPARING: {
    label: 'قيد التجهيز',
    bg: 'bg-slate-100 dark:bg-slate-800/80',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-500',
  },
  IN_TRANSIT: {
    label: 'في الطريق للمستودع/الشحن',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  OUT_FOR_DELIVERY: {
    label: 'مع المندوب للتسليم اليوم',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  DELIVERED: {
    label: 'تم التسليم بنجاح',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  RETURNED: {
    label: 'مرتجع / لم يُستلم',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800',
    dot: 'bg-rose-500',
  },
};

export const STATUS_FILTER_OPTIONS = [
  { value: 'ALL', label: 'كافة الشحنات' },
  { value: 'IN_TRANSIT', label: 'في الطريق' },
  { value: 'OUT_FOR_DELIVERY', label: 'مع المندوب' },
  { value: 'DELIVERED', label: 'تم التسليم' },
  { value: 'RETURNED', label: 'المرتجعة' },
];

