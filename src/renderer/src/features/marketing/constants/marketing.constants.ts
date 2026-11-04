import { CampaignStatus } from '../types/marketing.types';

export const CAMPAIGN_STATUS_CONFIG: Record<CampaignStatus, { label: string; bg: string; text: string; dot: string }> = {
  DRAFT: {
    label: 'مسودة',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-300',
    dot: 'bg-slate-400',
  },
  RUNNING: {
    label: 'جارِ الإرسال',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500 animate-pulse',
  },
  PAUSED: {
    label: 'متوقفة مؤقتاً',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  COMPLETED: {
    label: 'مكتملة',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  CANCELLED: {
    label: 'ملغاة',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
};

export const TEMPLATE_VARIABLES = [
  { tag: '{الاسم}', label: 'اسم العميل' },
  { tag: '{رقم_الطلب}', label: 'رقم الطلب' },
  { tag: '{الكوبون}', label: 'كود الخصم' },
  { tag: '{رابط_المتجر}', label: 'رابط المتجر' },
];

export const PRESET_CAMPAIGN_TEMPLATES = [
  {
    name: 'عرض الخصم الترحيبي',
    text: 'أهلاً بك {الاسم}! يسعدنا تقديم كود خصم حصري {الكوبون} بخصم 10% على كافة منتجاتنا. تسوق الآن عبر متجرنا {رابط_المتجر}. للإلغاء اكتب "إيقاف".',
  },
  {
    name: 'تنبيه شحن مجاني للطلبات',
    text: 'مرحباً {الاسم}، استفد اليوم من الشحن المجاني لكافة مدن المملكة عند طلبك من {رابط_المتجر} واستخدام كود FREESHIP. للإلغاء اكتب "إيقاف".',
  },
  {
    name: 'استعادة السلات المتروكة',
    text: 'مرحباً {الاسم}، لاحظنا أنك تركت بعض المنتجات في سلتك! استخدم كود SAVE5 للحصول على تخفيض فوري وأكمل طلبك بسهولة. للإلغاء اكتب "إيقاف".',
  },
];

export const DEFAULT_ANTI_BAN_SETTINGS = {
  minDelaySec: 20,
  maxDelaySec: 45,
  dailyLimit: 200,
  optOutKeyword: 'إيقاف',
};

