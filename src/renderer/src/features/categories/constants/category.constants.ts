import { CategoryFormData } from '../types/category.types';

export const CATEGORY_ICONS = [
  'Folder',
  'Sparkles',
  'Watch',
  'Shirt',
  'Key',
  'Home',
  'Heart',
  'Package',
  'ShoppingBag',
  'Tag',
  'Gift',
  'Coffee',
  'Headphones',
  'Smartphone',
  'Laptop',
  'Camera',
] as const;

export const CATEGORY_COLORS = [
  '#128C7E', // WhatsApp Brand Teal
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F43F5E', // Rose
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
  '#475569', // Slate
] as const;

export const DEFAULT_CATEGORY_FORM: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
  icon: 'Folder',
  color: '#128C7E',
  parent_id: null,
  active: true,
};
