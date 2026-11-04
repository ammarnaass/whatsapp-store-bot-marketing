import { ProductFormData } from '../types/products.types';

export const PRODUCT_CATEGORIES = [
  'عطور وباقات',
  'إلكترونيات وساعات',
  'أزياء وإكسسوارات',
  'منتجات رقمية وتراخيص',
  'مستلزمات منزلية',
  'صحة وجمال',
  'أخرى',
];

export const SHIPPING_TYPE_OPTIONS = [
  { value: 'default', label: 'حسب مناطق الشحن للمتجر (سمسا / أرامكس / سبل)', desc: 'تطبيق تسعيرة المنطقة' },
  { value: 'free', label: 'شحن مجاني لهذا المنتج (عرض ترويجي)', desc: 'بدون أي رسوم شحن' },
  { value: 'fixed', label: 'رسوم شحن ثابتة مخصصة للمنتج', desc: 'مبلغ شحن محدد مقدماً' },
];

export const DEFAULT_PRODUCT_FORM: ProductFormData = {
  name: '',
  category: 'عطور وباقات',
  type: 'physical',
  description: '',
  sku: '',
  barcode: '',
  brand: '',
  price: 150,
  cost_price: 90,
  compare_at_price: 0,
  tax_rate: 15,
  is_tax_inclusive: true,
  stock: 25,
  low_stock_threshold: 5,
  allow_backorders: false,
  weight: 0.5,
  length: 15,
  width: 10,
  height: 5,
  shipping_type: 'default',
  shipping_fee: 0,
  media: [],
  tags: [],
  whatsapp_short_desc: '',
  is_featured: false,
  active: true,
};

export const MARGIN_HEALTH_CONFIG = {
  excellent: { label: 'هامش ممتاز (35%+)', bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200' },
  good: { label: 'هامش جيد (20% - 35%)', bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200' },
  low: { label: 'هامش ضئيل (0% - 20%)', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200' },
  loss: { label: 'تحذير: بيع بخسارة!', bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200' },
};

