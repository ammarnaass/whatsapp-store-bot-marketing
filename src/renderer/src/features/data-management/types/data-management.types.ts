export type DataSection = 'products' | 'orders' | 'customers' | 'chats' | 'channels';

export interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  city: string;
  avatar: string;
  segment: 'all' | 'vip' | 'whatsapp_active' | 'cart_abandoner' | 'churn_risk';
  segmentLabel: string;
  tags: string[];
  totalSpend: number;
  ordersCount: number;
  lastActive: string;
  aiSummary: string;
  buyingPropensity: number;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  avatar: string;
  items: Array<{ title: string; qty: number; price: number; icon: string }>;
  source: 'ai' | 'human' | 'link';
  sourceLabel: string;
  paymentMethod: 'mada' | 'apple_pay' | 'tamara' | 'tabby' | 'cod';
  paymentMethodLabel: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  fulfillmentStatus: 'new' | 'confirmed' | 'preparing' | 'shipped' | 'delivered';
  fulfillmentStatusLabel: string;
  total: number;
  timeAgo: string;
  city: string;
  carrier?: string;
  trackingNumber?: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  type: 'physical' | 'digital';
  price: number;
  oldPrice?: number;
  stock: number;
  image: string;
  aiRecommended: boolean;
  salesCount: number;
  conversionRate: number;
  description: string;
  digitalKeysAvailable?: number;
}

export interface ChatItem {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  time: string;
  lastMessage: string;
  isAi: boolean;
  needsHuman: boolean;
  isVip?: boolean;
  badge?: string;
  tag?: string;
  cartValue?: number;
  sentiment?: number;
}

export interface WebhookLog {
  id: string;
  status: string;
  event: string;
  origin: string;
  latency: string;
  time: string;
  iconType: 'chat' | 'button' | 'delivered' | 'system';
}

export interface HsmTemplate {
  id: string;
  name: string;
  category: 'تسويقي (Marketing)' | 'معاملات (Utility)' | 'مصادقة (Authentication)';
  status: 'approved' | 'in_review' | 'rejected';
  preview: string;
  metricLabel: string;
  metricValue: string;
}
