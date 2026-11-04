import { ArabicFontFamily } from '../types/customization.types';

export interface FontFamilyMeta {
  id: ArabicFontFamily;
  name: string;
  subTitle: string;
  cssFamily: string;
}

export const ARABIC_FONT_FAMILIES: Record<ArabicFontFamily, FontFamilyMeta> = {
  cairo: {
    id: 'cairo',
    name: 'خط القاهرة (Cairo)',
    subTitle: 'الخط العصري المتوازن الافتراضي لواجهات التجارة',
    cssFamily: "'Cairo', system-ui, -apple-system, sans-serif",
  },
  'ibm-plex': {
    id: 'ibm-plex',
    name: 'آي بي إم بلكس (IBM Plex Sans Arabic)',
    subTitle: 'خط تقني رصين عالي الوضوح في الأرقام والجداول',
    cssFamily: "'IBM Plex Sans Arabic', 'Cairo', system-ui, sans-serif",
  },
  system: {
    id: 'system',
    name: 'خط النظام الافتراضي (System Native)',
    subTitle: 'يعتمد على خط النظام الأصلي للجهاز بأقصى سرعة أداء',
    cssFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
};

