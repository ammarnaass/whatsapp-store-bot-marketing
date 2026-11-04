export interface CustomerOrderSummary {
  id: string;
  total: number;
  status: string;
  created_at: string;
  items?: Array<{ id: string; product_name: string; qty: number; unit_price: number }>;
}

export interface CustomerDetailProfile {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  notes: string;
  tags: string[];
  isVip: boolean;
  memorySummary: string;
  address?: { city?: string; street?: string };
  orders: CustomerOrderSummary[];
  ordersCount: number;
  totalSpend: number;
  createdAt?: string;
}

