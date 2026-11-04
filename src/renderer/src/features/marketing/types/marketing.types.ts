import { Campaign, CampaignStatus, CampaignRecipient, Coupon, BlocklistEntry } from '../../../../shared/types';

export type { Campaign, CampaignStatus, CampaignRecipient, Coupon, BlocklistEntry };

export type MarketingTab = 'campaigns' | 'coupons' | 'blocklist';

export interface AudienceFilter {
  all?: boolean;
  city?: string;
  minOrders?: number;
  tags?: string[];
}

export interface CreateCampaignFormData {
  name: string;
  template: string;
  media_path?: string;
  min_delay_sec: number;
  max_delay_sec: number;
  daily_limit: number;
  audience_filter: AudienceFilter;
}

export interface CreateCouponFormData {
  code: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  min_order_amount: number;
  expires_at?: string;
  max_uses: number;
}

export interface AntiBanMetrics {
  jitterMin: number;
  jitterMax: number;
  dailyLimit: number;
  optOutKeyword: string;
  todaySentCount: number;
  safetyScore: number;
}

