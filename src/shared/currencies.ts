export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  // عملات عالمية رئيسية
  { code: 'USD', name: 'دولار أمريكي', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'يورو أوروبي', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'جنيه إسترليني', symbol: '£', flag: '🇬🇧' },
  { code: 'CAD', name: 'دولار كندي', symbol: 'CA$', flag: '🇨🇦' },
  { code: 'AUD', name: 'دولار أسترالي', symbol: 'AU$', flag: '🇦🇺' },
  { code: 'TRY', name: 'ليرة تركية', symbol: '₺', flag: '🇹🇷' },
  { code: 'CNY', name: 'يوان صيني', symbol: '¥', flag: '🇨🇳' },
  { code: 'JPY', name: 'ين ياباني', symbol: '¥', flag: '🇯🇵' },

  // عملات الخليج والشرق الأوسط
  { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س', flag: '🇸🇦' },
  { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'KWD', name: 'دينار كويتي', symbol: 'د.ك', flag: '🇰🇼' },
  { code: 'QAR', name: 'ريال قطري', symbol: 'ر.ق', flag: '🇶🇦' },
  { code: 'BHD', name: 'دينار بحريني', symbol: 'د.ب', flag: '🇧🇭' },
  { code: 'OMR', name: 'ريال عماني', symbol: 'ر.ع', flag: '🇴🇲' },

  // عملات شمال أفريقيا والوطن العربي
  { code: 'DZD', name: 'دينار جزائري', symbol: 'د.ج', flag: '🇩🇿' },
  { code: 'EGP', name: 'جنيه مصري', symbol: 'ج.م', flag: '🇪🇬' },
  { code: 'MAD', name: 'درهم مغربي', symbol: 'د.م', flag: '🇲🇦' },
  { code: 'TND', name: 'دينار تونسي', symbol: 'د.ت', flag: '🇹🇳' },
  { code: 'LYD', name: 'دينار ليبي', symbol: 'د.ل', flag: '🇱🇾' },
  { code: 'JOD', name: 'دينار أردني', symbol: 'د.أ', flag: '🇯🇴' },
  { code: 'IQD', name: 'دينار عراقي', symbol: 'د.ع', flag: '🇮🇶' },
  { code: 'LBP', name: 'ليرة لبنانية', symbol: 'ل.ل', flag: '🇱🇧' },
  { code: 'YER', name: 'ريال يمني', symbol: 'ر.ي', flag: '🇾🇪' },
  { code: 'SDG', name: 'جنيه سوداني', symbol: 'ج.س', flag: '🇸🇩' },
];

export const CURRENCY_MAP: Record<string, CurrencyInfo> = SUPPORTED_CURRENCIES.reduce(
  (acc, c) => ({ ...acc, [c.code]: c }),
  {}
);

export function getCurrencyInfo(code?: string): CurrencyInfo {
  if (!code) return CURRENCY_MAP['SAR'] || SUPPORTED_CURRENCIES[0];
  const upper = code.toUpperCase();
  return CURRENCY_MAP[upper] || { code: upper, name: upper, symbol: upper, flag: '🌐' };
}

export function formatCurrency(amount: number, code = 'SAR'): string {
  const info = getCurrencyInfo(code);
  const formattedNum = Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${formattedNum} ${info.symbol}`;
}

