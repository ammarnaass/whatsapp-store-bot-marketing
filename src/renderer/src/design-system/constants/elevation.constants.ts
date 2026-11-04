import { ElevationToken } from '../types/tokens.types';

export const ELEVATION_SCALE: ElevationToken[] = [
  {
    level: 1,
    label: 'Elevation 1: أسطح مستوية',
    shadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
    darkShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.35)',
    purpose: 'البطاقات الأساسية، الجداول، وأشرطة القوائم الجانبية',
  },
  {
    level: 2,
    label: 'Elevation 2: بطاقات تفاعلية',
    shadow: '0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
    darkShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.45)',
    purpose: 'حالات التحويم للبطاقات وعناصر القوائم النشطة',
  },
  {
    level: 3,
    label: 'Elevation 3: تلميحات وقوائم منسدلة',
    shadow: '0 12px 28px -6px rgba(15, 23, 42, 0.10), 0 4px 8px -4px rgba(15, 23, 42, 0.05)',
    darkShadow: '0 12px 28px -6px rgba(0, 0, 0, 0.55)',
    purpose: 'القوائم المنسدلة (Dropdowns)، والتلميحات (Tooltips)',
  },
  {
    level: 4,
    label: 'Elevation 4: نوافذ منبثقة (Modals)',
    shadow: '0 24px 48px -12px rgba(15, 23, 42, 0.18), 0 8px 16px -8px rgba(15, 23, 42, 0.08)',
    darkShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.65)',
    purpose: 'النوافذ الحوارية المركزية، وتأكيدات الحذف الهامة',
  },
];

