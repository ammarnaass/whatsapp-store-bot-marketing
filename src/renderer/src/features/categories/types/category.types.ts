import { Category } from '../../../../shared/types';

export type { Category };

export interface CategoryFormData {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  color: string;
  parent_id?: string | null;
  sort_order?: number;
  active: boolean;
}

export interface CategoryFormErrors {
  name?: string;
  slug?: string;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
  level: number;
}

export type CategoryFilterId = 'all' | string;
