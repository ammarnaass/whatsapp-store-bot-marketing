import { OrderItem } from '../../data-management';

export type { OrderItem };

export type OrderStatusFilter = 'all' | 'confirmed' | 'shipping' | 'delivered';
export type OrderSourceFilter = 'all' | 'agent' | 'human';
export type OrderPaymentFilter = 'all' | 'apple_pay' | 'tamara' | 'tabby' | 'cod';

export interface NewManualOrderData {
  customerName: string;
  customerPhone: string;
  productTitle: string;
  price: number;
}
