export type InventoryTabFilter = 'all' | 'low_stock' | 'out_of_stock' | 'digital' | 'physical';

export interface StockSummary {
  totalSkus: number;
  totalQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  type: 'physical' | 'digital';
  price: number;
  stockQty: number;
  reservedQty: number;
  availableQty: number;
  image?: string;
}

export interface InventoryLog {
  id: string;
  variant_id: string;
  sku: string;
  product_name: string;
  change_qty: number;
  quantity_before: number;
  quantity_after: number;
  reason: string;
  order_id?: string;
  created_by?: string;
  created_at: string;
}

export interface LicenseKey {
  id: string;
  product_id: string;
  product_name?: string;
  key_code: string;
  status: 'available' | 'sold';
  order_id?: string;
  sold_at?: string;
}

