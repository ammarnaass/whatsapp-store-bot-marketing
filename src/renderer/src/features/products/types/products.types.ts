import { CatalogProduct } from '../../data-management';

export type { CatalogProduct };

export type ProductViewMode = 'table' | 'grid';

export type ProductTabFilter = 'all' | 'demanded' | 'low_stock' | 'ai_disabled';

export interface NewProductFormData {
  name: string;
  price: number;
  category: string;
  type: 'physical' | 'digital';
  stock: number;
  description: string;
}
