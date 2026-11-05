import React from 'react';
import {
  Folder, Sparkles, Watch, Shirt, Key, Home, Heart,
  Package, ShoppingBag, Tag, Gift, Coffee, Headphones,
  Smartphone, Laptop, Camera, LucideIcon
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Folder, Sparkles, Watch, Shirt, Key, Home, Heart,
  Package, ShoppingBag, Tag, Gift, Coffee, Headphones,
  Smartphone, Laptop, Camera,
};

interface CategoryBadgeProps {
  name: string;
  icon?: string;
  color?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  name,
  icon = 'Folder',
  color = '#128C7E',
  size = 'sm',
  className = '',
}) => {
  const IconComponent = ICON_MAP[icon] || Folder;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg font-bold border transition-all ${
        isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${className}`}
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}35`,
        color: color,
      }}
    >
      <IconComponent className={isSm ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />
      <span className="truncate max-w-[120px]">{name}</span>
    </span>
  );
};
