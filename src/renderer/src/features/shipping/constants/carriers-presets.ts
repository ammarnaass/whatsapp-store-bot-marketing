export interface CarrierPreset {
  code: string;
  name: string;
  country: string;
  badgeColor: string;
  defaultCost: number;
  currency: string;
  defaultDays: string;
  trackingTemplate: string;
}

export const PRESET_CARRIERS: CarrierPreset[] = [
  // السعودية والخليج
  { code: 'smsa', name: 'سمسا إكسبريس (SMSA Express)', country: 'SA', badgeColor: 'bg-rose-500', defaultCost: 28, currency: 'SAR', defaultDays: '24-48 ساعة', trackingTemplate: 'https://www.smsaexpress.com/tracking?track={tracking_no}' },
  { code: 'aramex', name: 'أرامكس (Aramex Priority)', country: 'SA', badgeColor: 'bg-orange-500', defaultCost: 30, currency: 'SAR', defaultDays: '1-3 أيام عمل', trackingTemplate: 'https://www.aramex.com/track/results?shipmentNumber={tracking_no}' },
  { code: 'spl', name: 'البريد السعودي (سبل SPL)', country: 'SA', badgeColor: 'bg-sky-600', defaultCost: 22, currency: 'SAR', defaultDays: '3-5 أيام عمل', trackingTemplate: 'https://splonline.com.sa/ar/track?tracking_no={tracking_no}' },
  { code: 'torod', name: 'طرود اللوجستية (Torod)', country: 'SA', badgeColor: 'bg-purple-600', defaultCost: 26, currency: 'SAR', defaultDays: '2-4 أيام عمل', trackingTemplate: '' },

  // الجزائر وشمال أفريقيا
  { code: 'yalidine', name: 'ياليدين إكسبريس (Yalidine Express)', country: 'DZ', badgeColor: 'bg-red-600', defaultCost: 600, currency: 'DZD', defaultDays: '24-48 ساعة', trackingTemplate: 'https://yalidine.com/tracking/?tracking={tracking_no}' },
  { code: 'procolis', name: 'بروكوليس السريع (Procolis)', country: 'DZ', badgeColor: 'bg-emerald-600', defaultCost: 550, currency: 'DZD', defaultDays: '48 ساعة', trackingTemplate: 'https://procolis.com/track/{tracking_no}' },
  { code: 'zr_express', name: 'زاد إكسبريس (ZR Express)', country: 'DZ', badgeColor: 'bg-amber-600', defaultCost: 500, currency: 'DZD', defaultDays: '2-3 أيام', trackingTemplate: '' },

  // شحن دولي وعام
  { code: 'dhl', name: 'دي إتش إل إكسبريس (DHL Express)', country: 'GLOBAL', badgeColor: 'bg-yellow-500', defaultCost: 35, currency: 'USD', defaultDays: '3-5 أيام عمل', trackingTemplate: 'https://www.dhl.com/en/express/tracking.html?AWB={tracking_no}' },
  { code: 'fedex', name: 'فيديكس (FedEx International)', country: 'GLOBAL', badgeColor: 'bg-indigo-600', defaultCost: 40, currency: 'USD', defaultDays: '3-5 أيام عمل', trackingTemplate: '' },
  { code: 'fleet', name: 'أسطول التوصيل الخاص بالمتجر', country: 'ALL', badgeColor: 'bg-teal-600', defaultCost: 15, currency: 'SAR', defaultDays: 'نفس اليوم / خلال ساعات', trackingTemplate: '' },
  { code: 'custom', name: 'شركة شحن مخصصة (أخرى)', country: 'ALL', badgeColor: 'bg-slate-600', defaultCost: 20, currency: 'USD', defaultDays: '2-4 أيام', trackingTemplate: '' },
];

export interface SupportedCountry {
  code: string;
  name: string;
  flag: string;
  defaultCurrency: string;
}

export const SUPPORTED_SHIPPING_COUNTRIES: SupportedCountry[] = [
  { code: 'SA', name: 'المملكة العربية السعودية', flag: '🇸🇦', defaultCurrency: 'SAR' },
  { code: 'DZ', name: 'الجمهورية الجزائرية', flag: '🇩🇿', defaultCurrency: 'DZD' },
  { code: 'AE', name: 'الإمارات العربية المتحدة', flag: '🇦🇪', defaultCurrency: 'AED' },
  { code: 'EG', name: 'جمهورية مصر العربية', flag: '🇪🇬', defaultCurrency: 'EGP' },
  { code: 'KW', name: 'دولة الكويت', flag: '🇰🇼', defaultCurrency: 'KWD' },
  { code: 'QA', name: 'دولة قطر', flag: '🇶🇦', defaultCurrency: 'QAR' },
  { code: 'BH', name: 'مملكة البحرين', flag: '🇧🇭', defaultCurrency: 'BHD' },
  { code: 'OM', name: 'سلطنة عمان', flag: '🇴🇲', defaultCurrency: 'OMR' },
  { code: 'MA', name: 'المملكة المغربية', flag: '🇲🇦', defaultCurrency: 'MAD' },
  { code: 'TN', name: 'الجمهورية التونسية', flag: '🇹🇳', defaultCurrency: 'TND' },
  { code: 'IQ', name: 'جمهورية العراق', flag: '🇮🇶', defaultCurrency: 'IQD' },
  { code: 'JO', name: 'المملكة الأردنية', flag: '🇯🇴', defaultCurrency: 'JOD' },
  { code: 'GLOBAL', name: 'شحن دولي لكافة دول العالم', flag: '🌐', defaultCurrency: 'USD' },
];
