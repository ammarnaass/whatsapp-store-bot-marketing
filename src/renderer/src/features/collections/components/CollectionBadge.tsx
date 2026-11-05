import React from 'react';
import { Sparkles } from 'lucide-react';
import { COLLECTION_ICONS_MAP } from '../constants/collection.constants';

interface CollectionBadgeProps {
  name: string;
  icon?: string;
  color?: string;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const CollectionBadge: React.FC<CollectionBadgeProps> = ({
  name,
  icon = 'Sparkles',
  color = '#7C3AED',
  count,
  size = 'md',
  className = '',
  onClick,
}) => {
  const IconComp = COLLECTION_ICONS_MAP[icon] || Sparkles;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-xl font-medium border transition-all ${sizeClasses} ${
        onClick ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''
      } ${className}`}
      style={{
        backgroundColor: `${color}18`,
        color: color,
        borderColor: `${color}35`,
      }}
    >
      <IconComp className={iconSizes} />
      <span>{name}</span>
      {typeof count === 'number' && (
        <span
          className="mr-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold opacity-80"
          style={{ backgroundColor: `${color}25` }}
        >
          {count}
        </span>
      )}
    </span>
  );
};
