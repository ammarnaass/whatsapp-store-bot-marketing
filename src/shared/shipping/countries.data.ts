import { CountryInfo } from './types';

export const GLOBAL_COUNTRIES_LIST: CountryInfo[] = [
  // المغرب العربي وشمال أفريقيا
  { code: 'DZ', name: 'الجزائر', nameEn: 'Algeria', flag: '🇩🇿', currency: 'DZD', phoneCode: '+213' },
  { code: 'MA', name: 'المغرب', nameEn: 'Morocco', flag: '🇲🇦', currency: 'MAD', phoneCode: '+212' },
  { code: 'TN', name: 'تونس', nameEn: 'Tunisia', flag: '🇹🇳', currency: 'TND', phoneCode: '+216' },
  { code: 'LY', name: 'ليبيا', nameEn: 'Libya', flag: '🇱🇾', currency: 'LYD', phoneCode: '+218' },
  { code: 'EG', name: 'مصر', nameEn: 'Egypt', flag: '🇪🇬', currency: 'EGP', phoneCode: '+20' },
  { code: 'SD', name: 'السودان', nameEn: 'Sudan', flag: '🇸🇩', currency: 'SDG', phoneCode: '+249' },

  // دول الخليج العربي
  { code: 'SA', name: 'المملكة العربية السعودية', nameEn: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', phoneCode: '+966' },
  { code: 'AE', name: 'الإمارات العربية المتحدة', nameEn: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', phoneCode: '+971' },
  { code: 'KW', name: 'الكويت', nameEn: 'Kuwait', flag: '🇰🇼', currency: 'KWD', phoneCode: '+965' },
  { code: 'QA', name: 'قطر', nameEn: 'Qatar', flag: '🇶🇦', currency: 'QAR', phoneCode: '+974' },
  { code: 'BH', name: 'البحرين', nameEn: 'Bahrain', flag: '🇧🇭', currency: 'BHD', phoneCode: '+973' },
  { code: 'OM', name: 'سلطنة عمان', nameEn: 'Oman', flag: '🇴🇲', currency: 'OMR', phoneCode: '+968' },

  // المشرق والشرق الأوسط
  { code: 'JO', name: 'الأردن', nameEn: 'Jordan', flag: '🇯🇴', currency: 'JOD', phoneCode: '+962' },
  { code: 'IQ', name: 'العراق', nameEn: 'Iraq', flag: '🇮🇶', currency: 'IQD', phoneCode: '+964' },
  { code: 'LB', name: 'لبنان', nameEn: 'Lebanon', flag: '🇱🇧', currency: 'LBP', phoneCode: '+961' },
  { code: 'YE', name: 'اليمن', nameEn: 'Yemen', flag: '🇾🇪', currency: 'YER', phoneCode: '+967' },
  { code: 'TR', name: 'تركيا', nameEn: 'Turkey', flag: '🇹🇷', currency: 'TRY', phoneCode: '+90' },

  // أوروبا والأمريكتين وآسيا
  { code: 'US', name: 'الولايات المتحدة الأمريكية', nameEn: 'United States', flag: '🇺🇸', currency: 'USD', phoneCode: '+1' },
  { code: 'GB', name: 'المملكة المتحدة (بريطانيا)', nameEn: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', phoneCode: '+44' },
  { code: 'FR', name: 'فرنسا', nameEn: 'France', flag: '🇫🇷', currency: 'EUR', phoneCode: '+33' },
  { code: 'DE', name: 'ألمانيا', nameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', phoneCode: '+49' },
  { code: 'ES', name: 'إسبانيا', nameEn: 'Spain', flag: '🇪🇸', currency: 'EUR', phoneCode: '+34' },
  { code: 'IT', name: 'إيطاليا', nameEn: 'Italy', flag: '🇮🇹', currency: 'EUR', phoneCode: '+39' },
  { code: 'CA', name: 'كندا', nameEn: 'Canada', flag: '🇨🇦', currency: 'CAD', phoneCode: '+1' },
  { code: 'CN', name: 'الصين', nameEn: 'China', flag: '🇨🇳', currency: 'CNY', phoneCode: '+86' },
  { code: 'MY', name: 'ماليزيا', nameEn: 'Malaysia', flag: '🇲🇾', currency: 'MYR', phoneCode: '+60' },

  // شحن عالمي / عام
  { code: 'GLOBAL', name: 'شحن دولي عام (سائر الدول)', nameEn: 'Worldwide Shipping', flag: '🌐', currency: 'USD', phoneCode: '' },
];

export const COUNTRIES_MAP: Record<string, CountryInfo> = GLOBAL_COUNTRIES_LIST.reduce(
  (acc, c) => ({ ...acc, [c.code]: c }),
  {}
);

export function getCountryByCode(code?: string): CountryInfo {
  if (!code) return COUNTRIES_MAP['DZ'] || GLOBAL_COUNTRIES_LIST[0];
  const upper = code.toUpperCase();
  return COUNTRIES_MAP[upper] || {
    code: upper,
    name: upper,
    nameEn: upper,
    flag: '🌐',
    currency: 'USD',
    phoneCode: '',
  };
}

