import { AudienceFilter } from '../types/marketing.types';

export function getAudienceFilterDescription(filter?: AudienceFilter): string {
  if (!filter || filter.all) {
    return 'كافة العملاء المسجلين (غير المحظورين)';
  }
  const parts: string[] = [];
  if (filter.city) {
    parts.push(`مدينة: ${filter.city}`);
  }
  if (filter.minOrders && filter.minOrders > 0) {
    parts.push(`طلبات أكثر من: ${filter.minOrders}`);
  }
  if (filter.tags && filter.tags.length > 0) {
    parts.push(`الوسوم: ${filter.tags.join(', ')}`);
  }
  return parts.length > 0 ? parts.join(' | ') : 'مخصص';
}

export function calculateDeliveryRate(sentCount?: number, totalCount?: number): number {
  if (!totalCount || totalCount <= 0 || !sentCount) return 0;
  return Math.min(100, Math.round((sentCount / totalCount) * 100));
}

