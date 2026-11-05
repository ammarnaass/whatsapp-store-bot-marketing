import React from 'react';
import {
  Sparkles,
  Flame,
  Tag,
  Star,
  Gift,
  Heart,
  Zap,
  ShoppingBag,
  Percent,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import { CollectionFormData } from '../types/collection.types';

export const COLLECTION_COLORS = [
  '#7C3AED', // Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#6366F1', // Indigo
  '#14B8A6', // Teal
];

export const COLLECTION_ICONS = [
  'Sparkles',
  'Flame',
  'Tag',
  'Star',
  'Gift',
  'Heart',
  'Zap',
  'ShoppingBag',
  'Percent',
  'Clock',
  'Layers',
  'Award',
];

export const COLLECTION_ICONS_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Flame,
  Tag,
  Star,
  Gift,
  Heart,
  Zap,
  ShoppingBag,
  Percent,
  Clock,
  Layers,
  Award,
};

export const DEFAULT_COLLECTION_FORM: CollectionFormData = {
  name: '',
  slug: '',
  description: '',
  banner_url: '',
  icon: 'Sparkles',
  color: '#7C3AED',
  is_smart: false,
  rules_json: '{}',
  active: true,
  sort_order: 1,
  product_ids: [],
};
