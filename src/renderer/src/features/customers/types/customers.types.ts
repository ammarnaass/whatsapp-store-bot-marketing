import { CustomerItem } from '../../data-management';

export type { CustomerItem };

export type CustomerSegmentFilter =
  | 'all'
  | 'vip'
  | 'whatsapp_active'
  | 'cart_abandoner'
  | 'churn_risk';

export interface CampaignData {
  title: string;
  text: string;
}
