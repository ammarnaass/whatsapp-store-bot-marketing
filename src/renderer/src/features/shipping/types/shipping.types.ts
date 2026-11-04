export type ShipmentStatus =
  | 'PREPARING'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'RETURNED';

export interface ShipmentAddress {
  city?: string;
  district?: string;
  street?: string;
  notes?: string;
}

export interface ShipmentItem {
  id: string;
  order_id: string;
  product_id?: string;
  title: string;
  quantity: number;
  unit_price: number;
}

export interface Shipment {
  id: string;
  order_id: string;
  order_number?: string;
  total?: number;
  payment_method?: string;
  customer_name?: string;
  customer_phone?: string;
  carrier: string;
  tracking_no: string;
  tracking_url?: string;
  status: ShipmentStatus;
  shipped_at?: string;
  delivered_at?: string;
  address?: ShipmentAddress;
  items?: ShipmentItem[];
}

export interface ShippingZone {
  id: string;
  name: string;
  cities: string[];
  fee: number;
  free_over?: number | null;
}

export interface LogisticsKPIs {
  totalShipments: number;
  inTransit: number;
  outForDelivery: number;
  deliveredToday: number;
  successRate: number;
}

export interface ShipmentFilterState {
  search: string;
  status: string;
  carrier: string;
}

