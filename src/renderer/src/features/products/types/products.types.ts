import { CatalogProduct } from '../../data-management';

export type { CatalogProduct };

export type ProductViewMode = 'table' | 'grid';

export type ProductTabFilter = 'all' | 'demanded' | 'low_stock' | 'ai_disabled';

export type ProductShippingType = 'default' | 'free' | 'fixed';

export interface ProductFormData {
  id?: string;
  name: string;
  category: string;
  category_id?: string;
  type: 'physical' | 'digital';
  description: string;
  sku: string;
  barcode?: string;
  brand?: string;
  price: number;
  currency?: string;
  cost_price: number;
  compare_at_price?: number;
  tax_rate: number;
  is_tax_inclusive: boolean;
  stock: number;
  low_stock_threshold: number;
  allow_backorders: boolean;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  shipping_type: ProductShippingType;
  shipping_fee?: number;
  media: string[];
  tags: string[];
  whatsapp_short_desc?: string;
  is_featured: boolean;
  active: boolean;
}

export type NewProductFormData = ProductFormData;
export type EditProductFormData = ProductFormData;

export interface ProfitAnalysis {
  netProfit: number;
  marginPercent: number;
  markupPercent: number;
  taxAmount: number;
  volumetricWeight: number;
  marginHealth: 'excellent' | 'good' | 'low' | 'loss';
}

export interface ProductFormErrors {
  name?: string;
  price?: string;
  cost_price?: string;
  stock?: string;
  sku?: string;
}
